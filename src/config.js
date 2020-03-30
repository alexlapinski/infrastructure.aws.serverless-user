const convict = require('convict');
const dotenv = require('dotenv');

dotenv.config();

const config = convict({
    storage_bucket_name: {
        type: 'String',
        default: undefined,
        env: 'STORAGE_BUCKET_NAME'
    },
    base_url: {
        type: 'String',
        default: 'https://www.cbsd.org',
    }
});

module.exports = {
    getBaseUrl: () => config.get('base_url'),
    getStorageBucketName: () => config.get('storage_bucket_name'),
};