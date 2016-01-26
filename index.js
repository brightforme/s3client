'use strict'

let popsicle  = require('popsicle');

var S3Client = module.exports = function(config) {
    this.host = config.host;
    this.signerUrl = config.signerUrl;
    this.bucket = config.bucket;
}

S3Client.prototype._upload = function(signed_url, public_url, id, config) {
  const type = config.contentType || "application/octet-stream"
      ,  self = this
      , req = popsicle.request({
        url: signed_url,
        method: 'PUT',
        headers: {
          'content-type': type,
          'x-amz-acl': 'public-read',
          'content-length': config.filesize
        },
        body: config.file,
      })
      ;

  req.then(res => {
    if(res.status == 200) config.complete(id, public_url);
    else config.error(res);
  });
  req.catch(err => config.error(err));
  req.progress(() => {
    if(config.progress) config.progress(Math.round(req.uploaded));
  });
}

// adds a file. Only important function for the end user
S3Client.prototype.add = function(config) {
  const self = this
      ;

  let object_name = config.name
    , send = {
    endpoint: "files/",
    method: 'post',
    headers: {
      "Content-Type": 'application/json',
    },
  };

  send.url = this.signerUrl;
  send.payload = {
    bucket: this.bucket,
    path: object_name,
    mime_type: config.contentType
  };

  popsicle.request(send).then(function(res) {
      if (res.code >= 400) { config.error(res); return; }
      const result = res.body.s3
          , public_url = result.url.split("?")[0]
          ;

      self._upload(result.url, public_url, res.body.id, config);
  })
}
