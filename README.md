# s3client

s3client a small component for node.js that is supposed
to simplify uploading files to AWS S3 buckets.

# Installation

You can get this module by running `npm install s3client`.

# Usage

The module exposes a single object that represents a
connection to a single bucket.

```javascript
let S3Client = require('s3client');

let my_bucket_connection = new S3Client({
  host: 'i-use-aws.com',
  signerUrl: '/this-is-where-i-sign',
  bucket: 'please.put.my.stuff.there'
});
```

It only has one function, `add`. It should be used
like this:

````javascript
my_bucket_connection.add({
  name: "that_is_its_new_name.jpg",
  file: someFileObject,
  contentType: "application/octet-stream",
  error: (err) => console.log("Uh oh, an error occurred", err),
  complete: (res) => console.log("We're done here", res),
  progress: (percent) => console.log("We're at", percent, "%"),
});
```

Some words about the parameters:

- name: the filename/path under which the file should be saved on the bucket.
- file: an object. I advise to use a Readable Stream (created through e.g.
  `fs.createReadStream(filename)`) instead of, say, a Buffer, as this will
  enable multipart upload.
- contentType: the content type should be one of the [commonly used MIME types](http://www.freeformatter.com/mime-types-list.html).
- error: a function that will get a request object to do its' magic on.
  It is triggered when an error occurs.
- complete: a function that will also get a request object and is
  triggered iff everything worked well and the file is uploaded.
- progress: a function that will be triggered whenever we get status updates.
  It will get a floating point representation of the percentage (from 0 to 1).
