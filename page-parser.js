const cheerio = require('cheerio');

const extractNavigation = (pageContent) => {
    const $ = cheerio.load(pageContent);

    const parseAnchor = (anchor) =>
        ({
            text: $(anchor).text(),
            url: $(anchor).attr('href'),
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

    const rawNav = $('ul.page-navigation > li');

    const nav = parseList(rawNav);

    return nav;
};

module.exports = {
    extractNavigation,
}