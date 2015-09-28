# Zendesk JIRA On-Premise Integration

A Node based bot that monitors Zendesk and JIRA for certain structured comments on tickets and syncs the two.  Currently, it monitors
 Zendesk for comments starting with [JIRA_PROJECT-XXXX] (e.g. SOLR-4445) and Zendesk for JIRA comments starting with [ZD-XXXX] (e.g. ZD-502).

Designed to replace https://support.zendesk.com/hc/en-us/articles/203659916-Setting-up-and-using-Zendesk-for-JIRA-Server-OnPremise-, which is way too chatty for my needs.  
For instance, in our use of Zendesk, our support team often coordinate minutae with customers via the ticket, much of which does not need to be synced to JIRA.  
Vice-versa, many things on a JIRA are intended just for engineering and do not need to be synced with Zendesk and especially should not be communicated to customers.

This plugin differs from the On Premise Zendesk JIRA integration in that it only syncs comments that are explicitly marked for synchronization.  This is similar
to Zendesk's hosted JIRA integration (i.e. JIRA On Demand or whatever it is called) which gives finer grained control over synchronization.

# Usage


```javascript
git clone https://github.com/gsingers/zendesk-jira.git
cd zendesk-jira
npm install
```

Copy the example configuration file (`config-example.js`) to one of your own naming and edit with your values.

Save this to a file in the root of the project then run your bot with:

    node your-config-file, eg.: node config-foo




# Configuration

See `config-example.js` for details on configuration.  You will need both JIRA credentials and Zendesk credentials.  I recommend creating new users
for both of these roles over using personal credentials.  Also, be sure to lock down access to the configuration file, as of now it contains passwords.

Note, if you just want to try things out, set the debug flag in the config to true and it will just run the process once.  If it is false, the process
will repeat every `sleep` milliseconds.