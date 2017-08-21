const jwt = require('jsonwebtoken');
const extend = require('extend');
const fs = require('fs');

module.exports = function (options) {

    let opts = extend({}, {
        pub_cert_file: 'rsa_public_key.pem',
        pri_cert_file: 'rsa_private_key.pem',
        query_name: 'token',
        data_name: 'data',
        //指定过期时间
        expiresIn: '1h',
        //用于从请求信息中获取登录凭证，用户名、密码...
        getCredentials: function () {
            return {};
        },
        //用于登录验证，根据用户名密码验证用户是否有效
        verifyIdentity: function () {
            return true;
        }
    }, options);

    //公钥
    // let pub_cert = fs.readFileSync(opts.pub_cert_file);
    let pub_cert = `-----BEGIN PUBLIC KEY-----
    MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDQzk1GNUtOEeoh7MxDmSNpC2AD
    cpKle/V72V/DIEQUtmJHSdZd4NlvSJacNly60RIgMTyKNtQoXntKshnx4gSZmpoq
    deyWGIncQfxF5NZefxHTDBNH1WxMX0oQlSn9odPMt72xBqyeiWDrsVuPJqDwaaLJ
    kgYriFf+iU9SujU9+wIDAQAB
    -----END PUBLIC KEY-----`;
    // //私钥
    // let pri_cert = fs.readFileSync(opts.pri_cert_file);
    let pri_cert = `-----BEGIN RSA PRIVATE KEY-----
    MIICXAIBAAKBgQDQzk1GNUtOEeoh7MxDmSNpC2ADcpKle/V72V/DIEQUtmJHSdZd
    4NlvSJacNly60RIgMTyKNtQoXntKshnx4gSZmpoqdeyWGIncQfxF5NZefxHTDBNH
    1WxMX0oQlSn9odPMt72xBqyeiWDrsVuPJqDwaaLJkgYriFf+iU9SujU9+wIDAQAB
    AoGBAICluqJ5D26IRxKjzK4RWenMYll9a7CdkP+/S+rypD+Gp0J40aSBdjXEKVcR
    f0xyp5JCA6S8ZzaAD8JTvPx0XpQP5fL7unkzTmEMFTnvSm2NKqbX4qDWXoKaYu36
    PW46OSo0orqs1RuUgZf0dpgiDwFEJzfl0D4vDHml3Rfhv8IhAkEA61i/2nX2HPQe
    RACRg/8WBIl8fdv1sdjjBqGOW3NPRfFjkm54FOr53QMB225Eo2Itovvy9R8zIUCQ
    oOySWZDZgwJBAOMhSr56DizC5N3ZlQeVOg0Z9QdnYwXLUyz6Xpyy4wJag7zBaWkn
    gB5q5R5GyLBd3p1Cs+NW9izsY26Jiq8veCkCQFMYzwTvyaqHd3hDSx30H24SrWYz
    GBlnnyFkQcOAf2kOxj2Zy8R3AypKOYmk8Y9OxxZZJ3vtPDxtc6OeZD5DqskCQEcy
    BVrlqZHQWatM69Efrr2ymEME3l5PmLftl0CpNk1jkA3X1rH2hsuCGGXALGJUWlaT
    NQ4bETmNs7FPfeBiEdkCQFCRzXuwmCfHgBqbPyh9bOrzsCtQQ4+QIYzLsp9vdNgd
    odaTvpps23mLASp6Z383PgY7nSItB6ywpdy2CF0aHdU=
    -----END RSA PRIVATE KEY-----`;

    return {
        _create: function (data) {
            let payload = {};
            payload[opts.data_name] = data;

            return jwt.sign(payload, pri_cert, {
                expiresIn: opts.expiresIn,
                algorithm: 'RS256',
                noTimestamp: true
            });
        },
        //第一次生成token
        generateToken: function (req) {
            let data = opts.verifyIdentity(opts.getCredentials(req));
            if (!data) return '';
            return this._create(data);
        },
        //刷新token
        refreshToken: function (req) {
            let payload = this.verify(req);
            if (payload) return this._create(payload[opts.data_name]);
            return '';
        },
        //从请求中获取token的字符串
        _getReqToken: function (req) {
            let token = '';

            //获取token
            if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
                token = req.headers.authorization.split(' ')[1];
            } else if (req.query && req.query[opts.query_name]) {
                token = req.query[opts.query_name];
            }

            return token;
        },
        //验证token并得到其中的payload
        verify: function (req) {
            let token = this._getReqToken(req);
            if (!token) return false;

            let payload = null;

            try {
                //验证token是否有效
                payload = jwt.verify(token, pub_cert, {algorithms: 'RS256'});
            } catch (err) {
                console.log(err);
            }

            return payload;
        },
        //token解码
        decode: function (token) {
            let decoded = null;

            try {
                decoded = jwt.decode(token, {complete: true, json: true});
            } catch (err) {
                console.log(err);
            }
            return decoded;
        },
        //获得身份信息
        getIdentity: function (req) {
            let payload = this.verify(req);
            return payload && payload[opts.data_name];
        }
    }
};