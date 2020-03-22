const R = require('ramda');
const config = require('./config');
const fetcher = require('./page-fetcher');
const parser = require('./page-parser');

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

  return fetcher.getPage(url)
    .then(parser.extractNavigation(config.getBaseUrl()))
    .then(navigation => {
      printList(navigation);
      return navigation;
    })
    .then(navigation => {

      // TODO: Get latest page url

      console.log(JSON.stringify(navigation, null, 2));

      const getNavItemByText = text => R.find(R.pathEq(['link', 'text'], text))
      const distanceLearningNavItem = getNavItemByText('Distance Learning')(navigation);
      console.log(JSON.stringify(distanceLearningNavItem, null, 2))

      // Get Latest Day (Day X)
      const mostRecentText = R.reduce(
        (localMax, navItem) => R.max(localMax, R.path(['link','text'], navItem)),
        '',
        R.prop('children', distanceLearningNavItem)
      );

      const mostRecent = R.find(
        R.pathEq(['link', 'text'], mostRecentText),
        R.prop('children', distanceLearningNavItem)
      );

      console.log(JSON.stringify(mostRecent, null, 2));


    })
   .then((items) => {
      const response = {
        statusCode: 200,
        body: JSON.stringify(items),
      };
    
      callback(null, response);
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