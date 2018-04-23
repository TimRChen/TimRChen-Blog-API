const superRequest = require('../utils/request');
const fs = require('fs');
let EXPIRES_DATE = require('../config/expires_date'); // 接口请求限制时间，当前为2小时可重新请求一次
let NEWS_DATA = require('../config/news_data'); // 暂存新闻数据
const shortUrlAPI = 'http://v.juhe.cn/toutiao/index?type=:newsType&key=:APPKEY';
const APPKEY = 'bf881b7e3a5f864df4964d1456f50899';
const newsTypeList = ['top', 'shehui', 'guonei', 'guoji', 'yule', 'tiyu', 'junshi', 'keji', 'caijing', 'shishang'];

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
 *   query: {
 *     type: top(头条，默认),shehui(社会),guonei(国内),guoji(国际),yule(娱乐)
 *           tiyu(体育),junshi(军事),keji(科技),caijing(财经),shishang(时尚)
 *   }
 * }
 */
exports.provideNewsList = function (request, response) {
    let currentTime = new Date().getTime(); // 获取当前时间
    let EXPIRES_DATE_BK = EXPIRES_DATE;
    const newsType = request.query.type;
    if (newsTypeList.indexOf(newsType.trim()) === -1) {
        response.status(404).send({'err': 'newsType error'});
    }
    const reqURL = shortUrlAPI.replace(':APPKEY', APPKEY).replace(':newsType', newsType);
    if (EXPIRES_DATE_BK.expires_date < currentTime) {
        superRequest.requestHttp(reqURL).then(result => {
            EXPIRES_DATE_BK.expires_date = new Date().getTime() + 1800000; // 半小时过期
            fs.writeFile('./app/config/expires_date.json', JSON.stringify(EXPIRES_DATE_BK), function (err) {
                if (err) {
                    console.log('error: ', err);
                }
                fs.writeFile('./app/config/news_data.json', result, function (err) {
                    if (err) {
                        console.log('error: ', err);
                    }
                    NEWS_DATA = result;
                    // 将最后结果返回
                    response.status(200).send(result);
                });
            });
        }).catch(error => {
            console.error(error);
            response.status(500).send({'err': err});
        });
    } else if (EXPIRES_DATE_BK.expires_date > currentTime) {
        response.status(200).send(NEWS_DATA);
    }
};
