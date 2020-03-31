const awsXRay = require('aws-xray-sdk');
const awsSdk = awsXRay.captureAWS(require('aws-sdk'));
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

  const ethansLearning = getAndSend(
    'Ethan',
    `${config.getBaseUrl()}/Page/47195`,
    parser.getWallaceLatestPageUrl,
  );
  
  const evasLearning = getAndSend(
      'Eva',
      `${config.getBaseUrl()}/Page/53778`,
      parser.getYurickLatestPageUrl,
  );
  
  return Promise.all([ethansLearning, evasLearning]);
};

const getAndSend = (name, url, latestPageSelector) =>
  fetcher.getPage(url)
    .then(parser.extractNavigation(config.getBaseUrl()))
    .then(latestPageSelector)
    .then(fetcher.getLatestPageContent)
    .then(parser.extractLinks)
    .then((latestContentLinks) => {

      // TODO: Download files attached to links 

      return latestContentLinks;
    })
    .then(emailFormatter.formatEmail)
    .then(emailBody => config.isSendEmailEnabled()
      ? email.send('ses@alexlapinski.name', getEmailSubject(name, Date.now()), emailBody)
      : Promise.resolve()
    )
    .catch(err => {
      console.log(`Exception: ${err.message}`);
      return config.isSendEmailEnabled()
        ? email.send('ses@alexlapinski.name', 'Error', err.message)
        : Promise.resolve();
    });
    // Use this code if you don't use the http event with the LAMBDA-PROXY integration
    // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });

const getEmailSubject = (name, date) => `${name}'s Distance Learning for ${moment(date).format('dddd MMMM Do')}`;



module.exports.handler = handler;

if (require.main === module) {
  handler(null, null)
    .then(() => console.log('Done'));
}