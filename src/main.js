const R = require('ramda');
const config = require('./config');
const fetcher = require('./page-fetcher');
const parser = require('./page-parser');
const email = require('./email.service');
const emailFormatter = require('./email.formatter');
const moment = require('moment');

const levelToSpace = (level) => R.repeat(' ', 2 * level).join('');

const printListItem = (item, level = 0) => {
  
  if (item && item.link) {
    console.log(`${levelToSpace(level)}[${item.link.text}](${item.link.url})`);
  }

  if (item.children) {
    printList(item.children, level + 1);
  }
}

const printList = (list, level = 0) => list.forEach(item => printListItem(item, level));

const handler = (event, context) => {

  const url = `${config.getBaseUrl()}/Page/47195`;

  // TODO: Add 'TAP'  & debug logs between steps
  return fetcher.getPage(url)
    .then(parser.extractNavigation(config.getBaseUrl()))
    .then(fetcher.getLatestPageContent)
    .then(parser.extractLinks)
    .then((latestContentLinks) => {

      // TODO: Download files attached to links 

      return latestContentLinks;
    })
    .then(emailFormatter.formatEmail)
    .then(emailBody => email.send('ses@alexlapinski.name', getEmailSubject(Date.now()), emailBody))
    .catch(err => email.send('ses@alexlapinski.name', 'Error', err.message));

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};

const getEmailSubject = (date) => `Ethan's Distance Learning for ${moment(date).format('dddd MMMM Do')}`;



module.exports.handler = handler;

if (require.main === module) {
  handler(null, null)
    .then(() => console.log('Done'));
}