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
};

/**
 * Get the URL of the latest page for assignments for Mrs. Yurick
 */
const getYurickLatestPageUrl = (navigation) => {
    const getNavItemByText = text => R.find(R.pathEq(['link', 'text'], text))
    const distanceLearningNavItem = getNavItemByText('Distance Learning')(navigation);

    // Get Latest Week
    const mostRecentGroupNavItem = R.reduce(
        (localMax, navItem) => R.maxBy(R.path(['link', 'text']), localMax, navItem),
        {link:{ text: ''}},
        R.filter(
            R.pathSatisfies(R.startsWith('Distance Learning'), ['link', 'text']),
            R.prop('children', distanceLearningNavItem),
        ),
    );
    
    const mostRecentText = R.reduce(
        (localMax, navItem) => R.max(localMax, R.path(['link','text'], navItem)),
        '',
        R.filter(
            // TODO: Fix this so that only pages with the format 3-2-2020 show up 
            R.pathSatisfies(R.match(/\d+-\d+-\d+/), ['link', 'text']),
            R.prop('children', mostRecentGroupNavItem),
        ),
      );


    const mostRecent = R.find(
      R.pathEq(['link', 'text'], mostRecentText),
      R.prop('children', mostRecentGroupNavItem)
    );

    console.log('[Yurick]# Found most recent distance learning page:');
    console.log(JSON.stringify(mostRecent, null, 2));
    // TODO: Update this to account for eva's nested level

    return mostRecent.link.url;
};

/**
 * Get the URL of the latest page for assignments for Mrs. Wallace
 */
const getWallaceLatestPageUrl = (navigation) => {
    const getNavItemByText = text => R.find(R.pathEq(['link', 'text'], text))
    const distanceLearningNavItem = getNavItemByText('Distance Learning')(navigation);

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

    console.log('[Wallace]# Found most recent distance learning page:');
    console.log(JSON.stringify(mostRecent, null, 2));

    return mostRecent.link.url;
};

module.exports = {
    extractNavigation: R.curry(extractNavigation),
    getYurickLatestPageUrl,
    getWallaceLatestPageUrl,
    extractPageText,
    extractLinks,
}