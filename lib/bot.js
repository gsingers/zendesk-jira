var _ = require('underscore');

var fs = require('fs');
var jira = require('jira');
var JiraApi = require('jira').JiraApi;
var request = require('request');
var q = require('q');
var zendesk = require('node-zendesk');

/**
 * Bot to integrate JIRA and Zendesk.
 *
 *
 *
 * See config-example.js for configuration
 *
 * To run:  node config-XXX.js   (where XXX is the name of your config
 *
 * See:
 * https://www.npmjs.com/package/node-zendesk
 * https://www.npmjs.com/package/jira
 */
var Bot = function (config) {
  var self = this;
  var theStartDate = new Date();
  theStartDate.setDate(theStartDate.getDate() - 1);
  this.config = _.defaults(config, {
    bot_name: "ZD-JIRABot",
    emoji: ":jira:",
    post: true,
    startDate: theStartDate //default to now minus 1 day
  });
  return this;
};


function getJiraApi(apis, prjName) {
  var jiraApi = apis[prjName];
  if (jiraApi == null) {
    //explicit urls that don't have jira credentials will be marked by NONE.  If we don't have a
    // key at all, then we are using the DEFAULT, so see if it has credentials
    jiraApi = apis["DEFAULT"];
  }
  return jiraApi;
}

Bot.prototype.run = function () {
  var self = this,
      verbose = self.config.verbose,
      jiraMentionPattern = "^\\s*\\[(("; //the pattern to use when watching for mentions of JIRA on Zendesk Tickets
  var apis = {};
  _.each(self.config.jira_urls, function (value, key, obj) {

    if (value.jira) {
      console.log("Creating API for:");
      console.log(key);
      console.log(value);
      apis[key] = new JiraApi(
          value.jira.protocol,
          value.jira.host,
          value.jira.port,
          value.jira.user,
          value.jira.password,
          value.jira.version,
          value.jira.strictSSL,
          value.jira.oauth
      );
    } else {
      apis[key] = "NONE";//put in a placeholder in the map for explicitly declared JIRA urls that don't have JIRA credentials so that we can know when to use the default
    }
  });
  var prjNames = "";
  _.each(self.config.projects, function (prj, index, list) {
    jiraMentionPattern += prj;
    prjNames += prj;
    if (index != list.length - 1) {
      jiraMentionPattern += "|";
      prjNames += "|";
    }
  });
  jiraMentionPattern += ")-\\d+)(\\+)?(?:(?=\\W)|$)\\]";
  if (verbose) {
    console.log("Pattern is: " + jiraMentionPattern);
  }
  console.log("User: " + self.config.zendesk.username);
  var zd = zendesk.createClient({
    username: self.config.zendesk.username,
    password: self.config.zendesk.password,
    remoteUri: self.config.zendesk.url
  });

  function processJiraIssues(startDate){

  }
  function processZendeskIssues(startDate) {
    zd.search.query("updated>" + startDate.toISOString(), function (err, statusList, body, responseList, resultList) {
      if (err) {
        console.log(err);
        return;
      }
      _.each(body, function (ticket, index, list) {
        console.log("Examining comments for " + ticket.id);
        zd.tickets.getComments(ticket.id, function (err, status, comments, responseList, resultList) {
          _.each(comments, function (commentMap, idx, cList) {
            _.each(commentMap["comments"], function (zdComment, i, cl) {
              var regexp = new RegExp(jiraMentionPattern, "g"), match, def;
              while (match = regexp.exec(zdComment.body)) {
                if (verbose) {
                  console.log("\tMatch: " + zdComment.id);
                }
                // PROJECT-XXXX is the first capturing group, e.g. ((PROJECT)-\d+)
                var jiraId = match[1].trim(),
                // PROJECT is the second capturing group
                    prjName = match[2];
                var jiraApi = getJiraApi(apis, prjName);
                //we've got a match in ZD on our pattern, now let's check JIRA
                if (jiraApi && jiraApi != "NONE") {
                  //console.log("Finding: " + jiraId);
                  jiraApi.findIssue(jiraId, function (error, issue) {
                    var requests = [];
                    (function (def, issue, prjName) {
                      requests.push(def.promise);
                      var alreadyAdded = false;
                      _.each(issue.fields.comment.comments, function (jiraComment, comIdx, comList) {
                        if (jiraComment.body == zdComment.body) {
                          alreadyAdded = true;
                        }
                      });
                      var req = {};
                      if (alreadyAdded == false) {
                        //fill the promise
                        req["key"] = issue.key;
                        req["toAdd"] = zdComment.body;
                        req["prj"] = prjName;
                      }
                      def.resolve(req);
                    })(q.defer(), issue, prjName);
                    //deal with the deferrals
                    if (requests.length > 0) {
                      q.all(requests).then(function (messages) {
                        _.forEach(messages, function (theRequest) {
                          if (theRequest.key) {
                            var cljJiraApi = getJiraApi(apis, theRequest.prj);
                            cljJiraApi.addComment(theRequest.key, theRequest.toAdd, function (commErr, commIssue) {
                              if (commErr) {
                                console.log("Error adding comment");
                                console.log(commErr);
                                return;
                              }
                              console.log("\tAdded comment to " + theRequest.key);
                            });
                          }
                        });
                      })
                    }
                  });
                }
              }
            });
          })
        });
      });
    });//end listRecent
  }

  var startDate = self.config.startDate;//TODO: put in checkpointing of the time so we can keep track of our last update time and not repeat unnecessary work
  setInterval(function(){
    console.log("Processing Issues: " + startDate);
    processZendeskIssues(startDate);//see if there are any new Zendesk Issues to deal with
    processJiraIssues(startDate);//see if there are any new JIRA issues to deal with
    startDate.setMilliseconds(startDate.getMilliseconds() + self.config.sleep); //TODO: is our logic right so that we don't miss any the next time around?
    console.log("Processed issues.  Sleeping");
  }, self.config.sleep);
};

exports = module.exports.Bot = Bot;
