var bot = require('./lib/bot');


var config = {
  bot_name: "ZD-JIRABot",//
  showIssueDetails: true,
  showDetailsByDefault: true,
  token: 'XXXXXXXXXXXXXXXXXX',
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
  projects: ["FOO"],
  post: true,
  verbose: true,
  link_separator: ", ",
  command: "/jira",
  command_token: "XXXXXXXXXXXXXXXX",

  sleep: 1000 //time in milliseconds to sleep between checking activity
};

//DO NOT EDIT BELOW HERE
var slackbot = new slackbot.Bot(config);
slackbot.run();
