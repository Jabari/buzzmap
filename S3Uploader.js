var s3Uploader = (function () {
 
    var signingURI = "http://52.27.180.252/s3signing";
 
    function upload(mediaFile) {
 
        var deferred = $.Deferred(),
            ft = new FileTransfer(),
            options = new FileUploadOptions();
        var fileName = mediaFile.name;
        var fullPath = mediaFile.fullPath;
 
        options.fileKey = "file";
        options.fileName = fileName;
        options.mimeType = mediaFile.type; // File type i.e. video/mp4, video/3gpp, video/quicktime etc.
        options.chunkedMode = false;
 
        $.ajax({url: signingURI, data: {"fileName": fileName}, dataType: "json", type: "POST"})
            .done(function (data) {
                options.params = {
                    "key": fileName,
                    "AWSAccessKeyId": data.awsKey,
                    "acl": "public-read",
                    "policy": data.policy,
                    "signature": data.signature,
                    "Content-Type": mediaFile.type
                };
 
                ft.upload(fullPath, "https://" + data.bucket + ".s3.amazonaws.com/",
                    function (e) {
                        deferred.resolve(e);
                    },
                    function (e) {
                        alert("Upload failed");
                        deferred.reject(e);
                    }, options);
                ft.onprogress = function(progressEvent) {
                    var percentLoaded = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                    console.log(percentLoaded)
                }
            })
            .fail(function (error) {
                console.log(JSON.stringify(error));
            });
        return deferred.promise();
    }
    return {
        upload: upload
    }
}());