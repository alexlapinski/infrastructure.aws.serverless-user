const handlebars = require('handlebars');
const config = require('./config');


const formatEmail = (links) => {

    let text = "";

    links.forEach(link => {
        text += `<a href="${config.getBaseUrl()}""${link.url}">${link.text}</a>`;
        text += '<br/>';
        text += `<pre><code>${JSON.stringify(link, null, 2)}</code></pre>`;
    });

    return text;
};

module.exports = {
    formatEmail,
};