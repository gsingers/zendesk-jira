var bot = require('./lib/bot');


var config = {
  bot_name: "ZD-JIRABot",//
  jira_urls: {//NOTE: we can only comment on authenticated issues
    "DEFAULT": {
      url: "XXXXXXXXX", jira: {
        user: 'username',
        password: 'password',
        host: 'foo.myhost.com',
        protocol: 'https',
        port: 443,
        version: '2',
        strictSSL: true
      }
    }
  },
  zendesk:{
    username: "zd-user",
    password: "XXXXXXXXX",
    url: "https://XXXXXX.zendesk.com/api/v2"
  },
  projects: ["FOO"], //The list of projects to watch for in Zendesk comments
  verbose: true,
  debug: true, // if true, it only runs once, else, the system runs at an interval of sleep time length until the program is exited
  run_jira: true,//if true, add comments from JIRA to Zendesk
  run_zendesk: false, //if true, add comments from Zendesk to JIRA

  //Only look for issues after this time.
  //this value is only used for initial bootstrapping.  Once running, the
  //system sleeps for the configured time and then looks for new issues
  //since it last ran
  startDate: new Date("2015-09-27T16:00:00Z"),
  sleep: 60*1000 //time in milliseconds to sleep between checking activity
};

//DO NOT EDIT BELOW HERE
var slackbot = new slackbot.Bot(config);
slackbot.run();
