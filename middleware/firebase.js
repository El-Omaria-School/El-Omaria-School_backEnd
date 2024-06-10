const express = require("express");
const { uploadSingle } = require("./Multer");
const {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} = require("firebase/storage");
const { signInWithEmailAndPassword } = require("firebase/auth");
const { auth } = require("../fireBase.config");

const app = express();

const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return next();
    }

    const storageFB = getStorage();
    const file = {
      mimetype: req.file.mimetype,
      buffer: req.file.buffer,
    };

    await signInWithEmailAndPassword(
      auth,
      process.env.FIREBASE_USER,
      process.env.FIREBASE_AUTH
    );

    const dateTime = Date.now();
    const fileName = `images/${dateTime}-${Math.random()
      .toString(36)
      .substring(7)}`;
    const storageRef = ref(storageFB, fileName);
    const metadata = {
      contentType: file.mimetype,
    };

    await uploadBytesResumable(storageRef, file.buffer, metadata);
    const imageUrl = await getDownloadURL(storageRef);

    req.body.image = imageUrl;
    next();
  } catch (err) {
    res.status(500).json({
      status: "failed",
      message: "Image upload failed. Please try again later.",
    });
  }
};

const deleteImages = async (images) => {
  try {
    const storageFB = getStorage();
    await signInWithEmailAndPassword(
      auth,
      process.env.FIREBASE_USER,
      process.env.FIREBASE_AUTH
    );

    await Promise.all(
      images.map(async (image) => {
        const storageRef = ref(storageFB, image);
        try {
          await deleteObject(storageRef);
        } catch (error) {
          if (error.code === "storage/object-not-found") {
            console.log(`Image not found: ${image}`);
          } else {
            console.log(`Error deleting ${image}:`, error.message);
          }
        }
      })
    );
  } catch (err) {
    console.log("Error in deleting image from Firebase", err.message);
  }
};

app.post("/upload", uploadSingle, uploadImage);


module.exports = {
  uploadImage,
  deleteImages,
};
