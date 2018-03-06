const http = require('http');
const md5 = require('md5');
/**
 * 生成小白接口签名
 * 主要是生成sign
 */
function enryptData (params) {
    const OKAYAPI_APP_KEY = "4A6DEF3C767FE0CA0F758D2ABF7BB483";
    const OKAYAPI_APP_SECRECT = "f0pL6hfdgwUCkWuRLDBIOWqPewk7wjavJMfPky4bYaLeSMsVzItZKTm5r6Sw";

    params['app_key'] = OKAYAPI_APP_KEY;

    let sdic = Object.keys(params).sort();
    let paramsStrExceptSign = "";
    for (let ki in sdic) {                     
       paramsStrExceptSign += params[sdic[ki]];
    }
    // Todo: import md5
    let sign = md5(paramsStrExceptSign + OKAYAPI_APP_SECRECT).toUpperCase();
    params['sign'] = sign;

    return params;
}

/**
 * 根据文本内容，生成二维码 API
 * GET
 * API DOC http://api.okayapi.com/docs.php?service=Ext.QrCode.Png&detail=1&type=fold
 * request: {
 *  query: {
 *    textContent: 文本内容
 *  }
 * }
 */
exports.contentToQrcode = function (request, response) {
    let { textContent } = request.query;
    /**
     * 准备接口参数
     */
    let params = {
        'textContent': textContent
    };
    /**
     * 获取完整的请求参数
     */
    params = enryptData(params);
    const requestQrcodeAPI = 'http://api.okayapi.com/?s=Ext.QrCode.Png'; // 小白接口提供 转换二维码接口
    let requestURL = `${requestQrcodeAPI}&data=${params.textContent}&output=false&app_key=${params.app_key}&sign=${params.sign}`; // 正式请求接口
    http.get(requestURL, res => {
        let buffer = [],
            result = '';
        // listen data event.
        res.on('data', data => buffer.push(data));
        // listen data trans over event.
        res.on('end', () => {
            result = Buffer.concat(buffer).toString();
            console.log(`qrcode Object: ${JSON.parse(result)}`);
            response.status(200).send(JSON.parse(result));
        });
    }).on('error', err => {
        response.status(500).send({
            'err': err
        });
    });
};