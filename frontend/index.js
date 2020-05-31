const path = require('path');
const express = require('express');
const app = express();
const compression = require('compression');
const port = process.env.PORT || 4000;
const host = process.env.HOST || 'localhost';

app.use(compression());
app.use(express.static(path.join(__dirname, 'build'), {maxAge: '31557600'}));
app.get('*', async function(req, res) {
  res.set('Cache-Control', 'public, max-age=31557600');
});

app.listen(port, host, function() {
  console.log('Application run in port ' + port);
});
