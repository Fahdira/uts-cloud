const { S3Client, GetObjectCommand, ListObjectsV2Command } = window.AwsClientS3;

// 👇 Replace with your actual IAM credentials and region
const s3 = new S3Client({
  region: "ap-southeast-1",
  credentials: {
    accessKeyId: "AKIA4SYAMGYHTRAFXOUY",         // 🔁 Replace this
    secretAccessKey: "JTqKkFTJvj5o/tndgPBYB+ekQTrlVyPFEcCWrzw5", // 🔁 Replace this
  },
});

const bucketName = "uts-cloud"; // 🔁 Replace with your bucket name

async function getSignedUrl(bucket, key) {
  const { getSignedUrl } = window.AwsClientS3;

  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  return await getSignedUrl(s3, command, { expiresIn: 3600 }); // 1 hour
}

async function loadImages() {
  const gallery = document.getElementById("gallery");
  gallery.innerHTML = "Loading images...";

  try {
    const data = await s3.send(
      new ListObjectsV2Command({
        Bucket: bucketName,
        Prefix: "images/", // adjust to match your folder inside the bucket
      })
    );

    gallery.innerHTML = "";

    if (!data.Contents || data.Contents.length === 0) {
      gallery.innerHTML = "No images found.";
      return;
    }

    for (const obj of data.Contents) {
      if (obj.Key.endsWith("/")) continue;

      const signedUrl = await getSignedUrl(bucketName, obj.Key);

      const img = document.createElement("img");
      img.src = signedUrl;
      img.alt = obj.Key;
      img.classList.add("gallery-image");

      gallery.appendChild(img);
    }
  } catch (err) {
    console.error("Error loading images:", err);
    gallery.innerHTML = "Failed to load images.";
  }
}

// Auto-load on page load
window.onload = loadImages;
