var express = require('express');
var router = express.Router();
var AWS = require('aws-sdk');
var zlib = require('zlib');
var fs = require('fs');

// AWS KEYS
var AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY_ID;
var AWS_SECRET_KEY = process.env.AWS_SECRET_ACCESS_KEY;
var S3_BUCKET = process.env.S3_BUCKET_NAME;

// AWS Config 
AWS.config.update({accessKeyId: AWS_ACCESS_KEY, secretAccessKey: AWS_SECRET_KEY});
AWS.config.region = 'us-west-2';

var s3Client = new AWS.S3();
var s3Stream = require('s3-upload-stream')(new AWS.S3());

// Random number
var crypto = require('crypto');
function randomNumber() {
  var current_date = (new Date()).valueOf().toString();
  var random_number = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
  var hash = crypto.createHash('sha1').update(current_date + random_number).digest('hex');
  return hash;
}

/* GET home page. */
router.get('/', function(req, res, next) {
  	res.render('home', { title: 'Express' });
});

/* GET Upload page. */
router.get('/upload', function(req, res, next) {
  	res.render('upload');
});

/* GET Upload page. */
router.post('/submit_form', function(req, res, next) {
  	res.status(200).send({message: 'Success!!!'});
});

// Signed URL for S3 UPLOAD
// Create a signed URL that the browser can use to make a PUT request to S3
// DON'T FORGET TO SECURE THIS ENDPOINT WITH APPROPRIATE AUTHENTICATION/AUTHORIZATION MECHANISM
router.get('/s3_signed_url', function(req, res) {
	res.header('Access-Control-Allow-Origin', '*'); 
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

	var s3_params = {
	    Bucket: S3_BUCKET,
	    Key: req.query.file_name,
	    Expires: 60,
	    ContentType: req.query.file_type,
	    ACL: 'public-read'
	};
	s3Client.getSignedUrl('putObject', s3_params, function(err, data){
	    if (err) {
	        console.log(err);
	    } else {
	        var return_data = {
	            signed_request: data,
	            url: 'https://'+S3_BUCKET+'.s3.amazonaws.com/'+req.query.file_name
	        };
	        res.write(JSON.stringify(return_data));
	        res.end();
	    }
	});
});

// S3 Signed URL for UPLOAD
// DON'T FORGET TO SECURE THIS ENDPOINT WITH APPROPRIATE AUTHENTICATION/AUTHORIZATION MECHANISM
router.get('/s3signing', function(req, res) {
	res.header('Access-Control-Allow-Origin', '*'); 
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    
	var fileName = req.body.file_name;
  if (req.body.fileName) { fileName = req.body.fileName };
  if (!fileName) {
    return res.status(404).send({message: 'File name not found.'});
  };

  var expiration = new Date(new Date().getTime() + 1000 * 60 * 60 * 2).toISOString();

  var policy = { 
    "expiration": expiration,
    "conditions": [
        {"bucket": S3_BUCKET},
        {"key": fileName},
        {"acl": 'public-read'},
        ["starts-with", "$Content-Type", ""],
        ["content-length-range", 0, 524288000]
    ]};
 
  policyBase64 = new Buffer(JSON.stringify(policy), 'utf8').toString('base64');
  signature = crypto.createHmac('sha1', secret).update(policyBase64).digest('base64');
  res.json({bucket: S3_BUCKET, awsKey: AWS_ACCESS_KEY, policy: policyBase64, signature: signature});
});

module.exports = router;
