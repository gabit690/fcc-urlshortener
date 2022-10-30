require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const dns = require('dns');

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
      if (!urls.includes(req.body.url)) {
        urls.push(req.body.url);
      }
      res.json({
        original_url: req.body.url,
        short_url: urls.indexOf(req.body.url) + 1
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
