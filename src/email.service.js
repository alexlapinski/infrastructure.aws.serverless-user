const aws = require('./aws.wrapper');

const send = (to, subject, bodyHtml) => {
    const ses = aws.getSESInstance();

    // TODO: read config for source & reply email address
    const replyTo = 'ses@alexlapinski.name';
    const source = 'ses@alexlapinski.name';

    return ses.sendEmail({
        Destination: { ToAddresses: [to], },
        Message: { /* required */
            Body: { /* required */
                Html: {
                    Charset: 'UTF-8',
                    Data: bodyHtml,
                },
            },
            Subject: {
                Charset: 'UTF-8',
                Data: subject
            }
        },
        Source: source,
        ReplyToAddresses: [ replyTo ],
    }).promise();
};

module.exports = {
    send,
};