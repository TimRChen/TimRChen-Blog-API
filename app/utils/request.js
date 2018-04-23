const http = require('http');
const https = require('https');

exports.requestHttp = function (url) {
    return new Promise(function (resolve, reject) {
        http.get(url, res => {
            let buffer = [], result = '';
            res.on('data', data => buffer.push(data));
            res.on('end', () => {
                result = Buffer.concat(buffer).toString('utf-8');
                resolve(result);
            });
        }).on('error', err => {
            reject(err);
        });
    });
};

exports.requestHttps = function (url) {
    return new Promise(function (resolve, reject) {
        https.get(url, res => {
            let buffer = [], result = '';
            res.on('data', data => buffer.push(data));
            res.on('end', () => {
                result = Buffer.concat(buffer).toString('utf-8');
                resolve(result);
            });
        }).on('error', err => {
            reject(err);
        });
    });
};