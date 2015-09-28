# Zendesk JIRA On-Premise Integration

A Node based bot that monitors Zendesk and JIRA for certain structured comments on tickets and syncs the two. 

Designed to replace https://support.zendesk.com/hc/en-us/articles/203659916-Setting-up-and-using-Zendesk-for-JIRA-Server-OnPremise-, which is way too chatty for my needs.  
For instance, in our use of Zendesk, our support team often coordinate minutae with customers via the ticket, much of which does not need to be synced to JIRA.  
Vice-versa, many things on a JIRA are intended just for engineering and do not need to be synced with Zendesk and especially should not be communicated to customers.

This plugin differs from the On Premise Zendesk JIRA integration in that it only syncs comments that are explicitly marked for synchronization.  This is similar
to Zendesk's hosted JIRA integration (i.e. JIRA On Demand or whatever it is called)

# Usage


```javascript
git clone https://github.com/gsingers/zendesk-jira.git
cd zendesk-jira
npm install
```

Copy the example configuration file (`config-example.js`) to one of your own naming and edit with your values.

Save this to a file in the root of the project then run your bot with:

    node your-config-file, eg.: node config-foo




# Running