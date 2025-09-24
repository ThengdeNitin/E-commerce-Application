// import asyncHandler from "../middlewares/asyncHandler.js";
// import path from "path";
// import fs from "fs";
// import crypto from "crypto"; // to generate unique hash

// const uploadController = asyncHandler(async (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ message: "Please fill all the inputs." });
//   }

//   // Generate a unique 32-character hash
//   const uniqueHash = crypto.randomBytes(16).toString("hex");

//   // Get file extension
//   const ext = path.extname(req.file.originalname);

//   // New filename using hash
//   const newFileName = `${uniqueHash}${ext}`;

//   // Destination path
//   const newPath = path.join(req.file.destination, newFileName);

//   // Move/rename the uploaded file
//   fs.renameSync(req.file.path, newPath);

//   // Relative path for frontend
//   const imagePath = `/uploads/${newFileName}`;

//   res.status(201).json({
//     message: "Image uploaded successfully",
//     image: imagePath.replace(/\\/g, "/"), // fix windows backslashes
//   });
// });

// export { uploadController };
