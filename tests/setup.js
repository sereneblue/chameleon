const express = require('express');
const path = require('path');
const expressWs = require('express-ws');

module.exports = async () => {
  const app = express();
  expressWs(app);

  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, '/server'));
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });
  app.use(express.static(path.join(__dirname, '/server')));
  app.get('/', (req, res) => res.render('index'));
  app.get('/headers', (req, res) => res.send(req.headers));
  app.get('/referer', (req, res) => res.render('index'));
  app.get('/etag', (req, res) => {
    res.setHeader('Etag', Math.random().toString(36));
    res.send('OK');
  });
  app.ws('/echo', function(ws, req) {
    ws.on('message', function(msg) {
      ws.send(msg);
    });
  });

  global.__SERVER__ = app.listen(3000);
};
