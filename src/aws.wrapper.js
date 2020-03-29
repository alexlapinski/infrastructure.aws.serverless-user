const AWS = require('aws-sdk');

const getAWSInstance = () => {
    // TODO: read config to get Region

    AWS.config.update({ region: 'us-east-1' });

    return AWS;
};

const getSESInstance = () => {
    const aws = getAWSInstance();
    return new aws.SES({ apiVersion: '2010-12-01'});  
};

module.exports = {
    getAWSInstance,
    getSESInstance,
};