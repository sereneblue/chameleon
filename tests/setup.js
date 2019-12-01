const express = require('express');
const path = require('path');

module.exports = async () => {
  const app = express();

  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, '/server'));
  app.get('/', (req, res) => res.render('index'));
  app.get('/headers', (req, res) => res.send(req.headers));
  app.get('/referer', (req, res) => res.render('index'));
  app.get('/etag', (req, res) => {
    res.setHeader('Etag', Math.random().toString(36));
    res.send('OK');
  });

  global.__SERVER1__ = app.listen(3000);
  global.__SERVER2__ = app.listen(3001);
};
