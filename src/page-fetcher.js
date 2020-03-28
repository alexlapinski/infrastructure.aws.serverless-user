const axios = require('axios');
const R = require('ramda');

const getPage = (url) => 
    axios(url)
        .then(R.prop('data'))
        .then(R.trim);

const getLatestPageContent = navigation => {

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

    console.log('# Found most recent distance learning page:');
    console.log(JSON.stringify(mostRecent, null, 2));

    const latestHomeworkUrl = mostRecent.link.url;

    return getPage(latestHomeworkUrl);
};

module.exports = {
    getPage,
    getLatestPageContent,
};
