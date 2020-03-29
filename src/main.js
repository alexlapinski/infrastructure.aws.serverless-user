const R = require('ramda');
const config = require('./config');
const fetcher = require('./page-fetcher');
const parser = require('./page-parser');
const email = require('./email.service');

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

const handler = (event, context, callback) => {

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
   .then((items) => email.send('contact@alexlapinski.name', 'Success', JSON.stringify(items, null, 2)))
    .then(items => {
      const response = {
        statusCode: 200,
        body: JSON.stringify({
          links: items,
          // # TODO ADD PAGE TEXT: text: 
        })
      };
    
      callback(null, response);
    })
    .catch(err => {
      // TODO: SEnd Email via SNS

      return email.send('contact@alexlapinski.name', 'Error', err.message);
    });

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};




module.exports.handler = handler;

if (require.main === module) {
  handler(null, null, (_, res) => {
    console.log(JSON.stringify(res, null, 2));
  }).then(() => console.log('Done'));
}