const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

app.use('/graphql', createProxyMiddleware({
  target: 'https://20.82.234.39.sslip.io',
  changeOrigin: true,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization'
  }
}));

app.listen(3001, () => console.log('Proxy running on 3001'));