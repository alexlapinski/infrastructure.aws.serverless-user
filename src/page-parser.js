const R = require('ramda');
const cheerio = require('cheerio');

const extractNavigation = (baseUrl, pageContent) => {
    const $ = cheerio.load(pageContent);

    const parseAnchor = (anchor) =>
        ({
            text: $(anchor).text().trim(),
            url: `${baseUrl}${$(anchor).attr('href')}`,
        });

    const parseListItem = (item) => {
        const $item = $(item);
        const anchorTag = $item.children('a').first();
        const subList = $item.children('ul').children('li');

        return ({
            link: anchorTag.length == 1
                ? parseAnchor(anchorTag)
                : undefined,
            children: subList.length == 0 
                ? [] 
                : parseList(subList),
        })
    };

    const parseList = (list) =>
        $(list).toArray().map(parseListItem);

    return  parseList($('ul.page-navigation > li'));
};

const extractPageText = (pageContent) => {
    const $ = cheerio.load(pageContent);

    return $('.ui-article').text().trim();
};

const extractLinks = (pageContent) => {
    const $ = cheerio.load(pageContent);

    return $('[role=main] a[href]')
        .toArray()
        .map((element) => {
            return {
                text: $(element).text(),
                url: $(element).attr('href'),
            };
        });
}

module.exports = {
    extractNavigation: R.curry(extractNavigation),
    extractPageText,
    extractLinks,
}