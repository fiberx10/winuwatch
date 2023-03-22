

const cloudinary = require('cloudinary').v2;
// Configuration
cloudinary.config({
    cloud_name: "dqeb5aris",
    api_key: "831769652658741",
    api_secret: "SIxePU8cFnwbgKKhRRR9OONeuAg"
});
const res = cloudinary.uploader.upload('https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg', {public_id: "olympic_flag"})

res.then((data) => {
    console.log(data);
    console.log(data.secure_url);
}).catch((err) => {
    console.log(err);
});


// Generate
const url = cloudinary.url("olympic_flag", {
    width: 100,
    height: 150,
    Crop: 'fill'
});



// The output url
console.log(url);