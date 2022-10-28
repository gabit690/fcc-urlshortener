require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const dns = require('dns');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

const urls = [];

app.post('/api/shorturl', (req, res) => {
  console.log("MAIN");
  let url = req.body.url.replace(/\/*$/, '');
  let validUrl = url.replace(/^[^.]+\./, '');
  dns.lookup(validUrl, (err, address, family) => {
    if (err) {
      res.json({ error: 'invalid url' })
    }
    else {
      if (!urls.includes(url)) {
        urls.push(url);
      }
      res.json({
        original_url: url,
        short_url: urls.indexOf(url) + 1
      });
    }
  });
});

app.get('/api/shorturl/:id', (req, res) => {
  const externarlUrl = urls[req.params.id - 1];
  res.redirect(externarlUrl);
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
