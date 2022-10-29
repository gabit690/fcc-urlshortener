require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const dns = require('dns');
const { url } = require('inspector');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${__dirname}/public`));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

const urls = [];

app.post('/api/shorturl', (req, res) => {
  let url = new URL(req.body.url);
  dns.lookup(url.hostname, (err, address, family) => {
    if (err) {
      res.json({ error: 'invalid url' })
    }
    else {
      if (!urls.includes(url.origin)) {
        urls.push(url.origin);
      }
      res.json({
        original_url: url.origin,
        short_url: urls.indexOf(url.origin) + 1
      });
    }
  });
});

app.get('/api/shorturl/:id', (req, res) => {
  const externarlUrl = urls[req.params.id - 1];
  res.redirect(externarlUrl);
});

app.get('/urls', (req, res) => {
  res.json({
    links: urls
  });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
