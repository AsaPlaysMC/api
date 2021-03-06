const authorize = require('./lib/authorize.js');
const http = require('http');
const Router = require('./lib/superhero.js');

// Check for required environment variables
for (const env of [
  'DATABASE_URL', // Postgres DB URL (postgres://user:password@localhost/database)
  'S3_FILES_ACCESS_KEY_ID', // S3 API Access Key ID
  'S3_FILES_SECRET_KEY', // S3 API Secret Key
  'S3_FILES_BUCKET', // S3 API Bucket
      // Optional settings (Ignore if you won't use them)
  //'S3_FILES_ENDPOINT_URL', optional
  //'S3_LINKS_ACCESS_KEY_ID',
  //'S3_LINKS_SECRET_KEY',
  //'S3_LINKS_BUCKET',
  //'S3_LINKS_ENDPOINT_URL',
  'PORT'
]) {
  if (!process.env.hasOwnProperty(env)) {
    throw new Error(`missing required environment variable "${env}"`);
  }
}

// Create a router and apply routes
var router = new Router();
router.use(authorize);
//router.get('/shorten/polr', require('./routes/shorten/polr.js')); // GET /shorten/polr
router.post('/upload/pomf', require('./routes/upload/pomf.js')); // POST /upload/pomf
router.post('/users', require('./routes/users/create.js'));
router.get('/health', (req, res) => res.end(204, ''));

// Create server
var server = http.createServer(router._requestListener.bind(router));

// Start server
server.listen(process.env['PORT'], () => {
  console.log('Listening on ' + server.address().port);
});
