AWS.config.update({
    region: "ap-southeast-1",
    accessKeyId: "AKIA4SYAMGYHTRAFXOUY",
    secretAccessKey: "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"
  });
  
  const s3 = new AWS.S3();
  const bucketName = "uts-cloud";
  
  function getSignedUrl(bucket, key) {
    const params = {
      Bucket: bucket,
      Key: key,
      Expires: 3600,
    };
  
    return s3.getSignedUrl('getObject', params);
  }
  
  function loadImages() {
    const gallery = document.getElementById("gallery");
    gallery.innerHTML = "Loading images...";
  
    const params = {
      Bucket: bucketName,
      Prefix: "images/"
    };
  
    s3.listObjectsV2(params, function(err, data) {
      if (err) {
        console.error("Error listing objects:", err);
        gallery.innerHTML = "Failed to load images.";
        return;
      }
  
      gallery.innerHTML = "";
  
      const contents = data.Contents || [];
      if (contents.length === 0) {
        gallery.innerHTML = "No images found.";
        return;
      }
  
      contents.forEach(obj => {
        if (obj.Key.endsWith("/")) return;
  
        const signedUrl = getSignedUrl(bucketName, obj.Key);
        const img = document.createElement("img");
        img.src = signedUrl;
        img.alt = obj.Key;
        img.classList.add("gallery-image");
        gallery.appendChild(img);
      });
    });
  }
  
  window.onload = loadImages;
