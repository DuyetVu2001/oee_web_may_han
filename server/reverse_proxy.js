const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
var cors = require('cors')
var app = express()

app.use(cors())


const logger = (req, res, next) => {
    next();
}
app.use('/', createProxyMiddleware({
    followRedirects: true,
    secure: false,
    preserveHeaderKeyCase: true,
    router: req => {
        return req.headers.urlproxy || req.query.urlproxy
    }
}));
const PORT = Number(process.argv[2]) || 5010;
console.log('running on', PORT)
app.listen(PORT);
