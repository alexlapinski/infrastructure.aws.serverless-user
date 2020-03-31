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
        env: 'CBSD_BASE_URL',
    },
    send_email_enabled: {
        type: 'Boolean',
        default: true,
        env: 'ENABLE_SEND_EMAIL',
    }
});

module.exports = {
    getBaseUrl: () => config.get('base_url'),
    getStorageBucketName: () => config.get('storage_bucket_name'),
    isSendEmailEnabled: () => config.get('send_email_enabled'),
};