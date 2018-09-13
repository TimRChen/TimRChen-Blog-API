const FeedParser = require('feedparser');
const httpRequest = require('request');
const apiHost = 'http://api.timrchen.site:1200';

/**
 * 获取RSS订阅内容
 * POST
 * request {
 *     rssURI: '/zhihu/hotlist'
 * }
 */
exports.getContent = function (request, response) {
    const { rssURI } = request.body;
    const rssURL = `${apiHost}${rssURI}`;
    let req = httpRequest.get(rssURL);
    let feedparser = new FeedParser();
    req.on('error', error => {
        console.error(new Error(`Error by RSS Request Server: ${error}`))
        response.status(500).send('rss server return bad status');
    });
    req.on('response',  function (res) {
        var stream = this; // `this` is `req`, which is a stream
        res.statusCode !== 200 ? this.emit('error', new Error('Bad status code')) : stream.pipe(feedparser);
    });
    feedparser.on('error', error => console.error(new Error(`Error by feedparser: ${error}`)));
    let data = [];
    feedparser.on('data', chunk => data.push(chunk));
    feedparser.on('end', () => response.status(200).send(JSON.stringify(data)));
};
