// Add this script to fetch images from S3
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the Amazon Cognito credentials provider
    AWS.config.region = 'your-region'; // Region
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: 'your-identity-pool-id',
    });
    
    // Create S3 service object
    const s3 = new AWS.S3();
    
    // Set the bucket parameters
    const bucketParams = {
        Bucket: 'your-bucket-name',
    };
    
    // Call S3 to obtain a list of the objects in the bucket
    s3.listObjects(bucketParams, function(err, data) {
        if (err) {
            console.log("Error", err);
        } else {
            const galleryGrid = document.querySelector('.gallery-grid');
            galleryGrid.innerHTML = ''; // Clear existing placeholder cards
            
            data.Contents.forEach(function(object) {
                if (object.Key.match(/\.(jpg|jpeg|png|gif)$/i)) {
                    const imageUrl = `https://${bucketParams.Bucket}.s3.amazonaws.com/${object.Key}`;
                    
                    const card = document.createElement('div');
                    card.className = 'gallery-card';
                    card.innerHTML = `
                        <img src="${imageUrl}" alt="Gallery Image" class="card-image">
                        <div class="card-content">
                            <h3 class="card-title">${object.Key.split('.')[0]}</h3>
                            <p class="card-meta">Uploaded: ${object.LastModified.toLocaleDateString()}</p>
                        </div>
                    `;
                    
                    galleryGrid.appendChild(card);
                }
            });
        }
    });
});