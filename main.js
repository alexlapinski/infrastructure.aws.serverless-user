const config = require('./config');
const fetcher = require('./page-fetcher');
const parser = require('./page-parser');

const handler = (event, context, callback) => {

  const url = 'https://www.cbsd.org/Page/47195';

  return fetcher.getIndexPage(url)
    .then(parser.extractNavigation)
    .then(indexPage => {

      console.log(JSON.stringify(indexPage, null, 2));

      const response = {
        statusCode: 200,
        body: JSON.stringify({
          message: 'Go Serverless v1.0! Your function executed successfully!',
          input: event,
        }),
      };
    
      callback(null, response);

    })

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};




module.exports.handler

if (require.main === module) {
  handler(null, null, (_, res) => {
    console.log(JSON.stringify(res, null, 2));
  }).then(() => console.log('Done'));
}