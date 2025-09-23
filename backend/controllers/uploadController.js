// controllers/uploadController.js
export const uploadController = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Please fill all the inputs." });
  }

  const file = req.file;
  // Normalize path for frontend
  const filePath = `/uploads/${file.filename}`;

  res.status(201).json({
    message: "File uploaded successfully",
    image: filePath,
  });
};
