var express = require('express'),
app = express(),
path = require('path'),
bodyParser = require('body-parser'),
mongoose = require('mongoose'),
config = require('./config'),
sha1 = require('./sha1.js'),
chalk = require('chalk'),
// grab the url model
Url = require('./models/url');

mongoose.connect('mongodb://' + config.db.host + '/' + config.db.name);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname));

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, 'Views/index.html'));
});

app.post('/api/shorten', function(req, res){
  var longUrl = req.body.url,
      shortUrl = '',
      hash = '';

  // check if url already exists in database
  Url.findOne({long_url: longUrl}, function (err, doc){
    if (doc){
      hash = sha1.encode(doc.long_url);
      shortUrl = config.webhost + hash;
      // the document exists, so we return it without creating a new entry
      res.send({'shortUrl': shortUrl});
    } else {
      // since it doesn't exist, create it:
      hash = sha1.encode(longUrl);
      shortUrl = config.webhost + hash;

      var newUrl = Url({
        long_url: longUrl,
        short_url: shortUrl
      });

      // save the new link
      newUrl.save(function(err) {
        err ? (console.log(chalk.red(err))) : (res.send({'shortUrl': shortUrl}));
      });
    }

  });

});

app.get('/:hash', function(req, res){

  var shaId = req.params.hash,
      shortUrl = config.webhost + shaId;

  // check if url already exists in database
  Url.findOne({short_url: shortUrl}, function (err, doc){
    doc ? // Fix url for correct format
      (doc.long_url.indexOf('http') !== -1 ? (res.redirect(doc.long_url),
      console.log(chalk.green('HTTP(s) Check passed'))) : (res.redirect('http://'+doc.long_url),
      console.log(chalk.green('HTTP(s) error fixed')))) : (res.redirect(config.webhost));
  });

});

var server = app.listen(3000, function(){
  console.log(chalk.blue('listening on port 3000'));
});
