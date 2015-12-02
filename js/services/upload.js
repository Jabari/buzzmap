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

var root = __dirname.replace("/routes","");
// var fileName = 'SampleVideo_1080x720_1mb.mp4';
// var fileName = 'SampleVideo_1080x720_2mb.mp4';
// var fileName = 'SampleVideo_1080x720_5mb.mp4';
var fileName = 'SampleVideo_1080x720_10mb.mp4';
var filePath = root + '/public/'+ fileName;
console.log("File name - ",fileName);
console.log("=============================================");


// var read = fs.createReadStream(filePath);
// var compress = zlib.createGzip();
// var key = randomNumber(); 
// var upload = s3Stream.upload({
//   "Bucket": S3_BUCKET,
//   "Key": fileName
// });
 
// // Optional configuration 
// upload.maxPartSize(20971520); // 20 MB 
// upload.concurrentParts(2);
 
// // Handle errors. 
// upload.on('error', function (error) {
//   console.log(error);
// });
 
//  Handle progress. Example details object:
//    { ETag: '"f9ef956c83756a80ad62f54ae5e7d34b"',
//      PartNumber: 5,
//      receivedSize: 29671068,
//      uploadedSize: 29671068 }

// upload.on('part', function (details) {
//   console.log(details);
// });
 
// /* Handle upload completion. Example details object:
//    { Location: 'https://bucketName.s3.amazonaws.com/filename.ext',
//      Bucket: 'bucketName',
//      Key: 'filename.ext',
//      ETag: '"bf2acbedf84207d696c8da7dbb205b9f-5"' }
// */
// upload.on('uploaded', function (details) {
//   console.log(details);
// });
 
// // Pipe the incoming filestream through compression, and up to S3. 
// read.pipe(compress).pipe(upload);


// console.log("================= S3 ===============");
// var s3 = require('s3');

// var client = s3.createClient({
//   maxAsyncS3: 20,     // this is the default
//   s3RetryCount: 3,    // this is the default
//   s3RetryDelay: 1000, // this is the default
//   multipartUploadThreshold: 20971520, // this is the default (20 MB)
//   multipartUploadSize: 15728640, // this is the default (15 MB)
//   s3Options: {
//     accessKeyId: AWS_ACCESS_KEY,
//     secretAccessKey: AWS_SECRET_KEY,
//     // any other options are passed to new AWS.S3()
//     // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Config.html#constructor-property
//   },
// });

// var params = {
//   localFile: filePath,
//   s3Params: {
//     Bucket: S3_BUCKET,
//     Key: fileName,
//     // other options supported by putObject, except Body and ContentLength.
//     // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObject-property
//   },
// };
// var uploader = client.uploadFile(params);
// uploader.on('error', function(err) {
//   console.error("unable to upload:", err.stack);
// });
// uploader.on('progress', function() {
//   // console.log("progress", uploader.progressMd5Amount, uploader.progressAmount, uploader.progressTotal);
//   console.log("Uploaded :: " + parseInt((uploader.progressAmount * 100) / uploader.progressTotal)+'%');
// });
// uploader.on('end', function() {
//   console.log("done uploading");
// });

// Signed URL for S3 Upload
// Create a signed URL that the browser can use to make a PUT request to S3
router.get('/s3_signed_url', function(req, res) {
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

module.exports = router;
