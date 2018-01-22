const http = require('http');
const fs = require('fs');
const EXPIRES_DATE = require('../config/expires_date'); // 接口请求限制时间，当前为2小时可重新请求一次
const NEWS_DATA = require('../config/news_data'); // 暂存新闻数据
const shortUrlAPI = 'http://v.juhe.cn/toutiao/index?type=:newsType&key=:APPKEY';
const APPKEY = 'bf881b7e3a5f864df4964d1456f50899';
const newsType = {
    top: 'top',
    shehui: 'shehui',
    guonei: 'guonei',
    guoji: 'guoji',
    yule: 'yule',
    tiyu: 'tiyu',
    junshi: 'junshi',
    keji: 'keji',
    caijing: 'caijing',
    shishang: 'shishang'
};

// let NEWS_DATA = [{
//     "uniquekey": "6c4caa0c3ba6e05e2a272892af43c00e",
//     "title": "杨幂的发际线再也回不去了么？网友吐槽像半秃",
//     "date": "2017-01-05 11:03",
//     "category": "yule",
//     "author_name": "腾讯娱乐",
//     "url": "http://mini.eastday.com/mobile/170105110355287.html?qid=juheshuju",
//     "thumbnail_pic_s": "http://03.imgmini.eastday.com/mobile/20170105/20170105110355_806f4ed3fe71d04fa452783d6736a02b_1_mwpm_03200403.jpeg",
//     "thumbnail_pic_s02": "http://03.imgmini.eastday.com/mobile/20170105/20170105110355_806f4ed3fe71d04fa452783d6736a02b_2_mwpm_03200403.jpeg",
//     "thumbnail_pic_s03": "http://03.imgmini.eastday.com/mobile/20170105/20170105110355_806f4ed3fe71d04fa452783d6736a02b_3_mwpm_03200403.jpeg"
// }];

/**
 * 新闻 API
 * GET/POST
 * API DOC https://www.juhe.cn/docs/api/id/235
 * request: {
 *   params: {
 *     type: top(头条，默认),shehui(社会),guonei(国内),guoji(国际),yule(娱乐),tiyu(体育)junshi(军事),keji(科技),caijing(财经),shishang(时尚)
 *     key: APPKEY
 *   }
 * }
 */
exports.provideNewsList = function (request, response) {
    // 获取当前时间
    let currentTime = new Date().getTime();
    let EXPIRES_DATE_BK = EXPIRES_DATE;
    let reqURL = shortUrlAPI.replace(':APPKEY', APPKEY).replace(':newsType', newsType.top);
    if (EXPIRES_DATE_BK.expires_date < currentTime) {
        http.get(reqURL, res => {
            let buffer = [],
                result = "";
            // 监听 data 事件
            res.on('data', data => {
                buffer.push(data);
            });
            // 监听 数据传输完成事件
            res.on('end', () => {
                EXPIRES_DATE_BK.expires_date = new Date().getTime() + 7200000; // 两个小时过期
                fs.writeFile('./app/config/expires_date.json', JSON.stringify(EXPIRES_DATE_BK), function () {
                    result = Buffer.concat(buffer).toString('utf-8');
                    console.log(result);
                    fs.writeFile('./app/config/news_data.json', result, function () {
                        // 将最后结果返回
                        response.status(200).send(result);
                    });
                });
            });
        }).on('error', err => {
            response.status(500).send({
                'err': err
            });
        });
    } else {
        response.status(200).send(NEWS_DATA);
    }
};
