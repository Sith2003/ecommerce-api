const multer = require('multer')
const fs = require('fs')
const path = require('path')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`
    cb(null, fileName)
    req.on('aborted', () => {
      const fullPath = path.join('uploads', fileName)
      fs.unlinkSync(fullPath)
    })
  }
})

const fileFilter = (req, file, cb) => {
    const extension = ['.png', '.jpg', '.jpeg'].indexOf(path.extname(file.originalname).toLowerCase()) >= 0;
    const mimeType = ['image/png', 'image/jpg', 'image/jpeg'].indexOf(file.mimetype) >= 0;
    if (extension && mimeType) { 
        cb(null, true) 
    } else {
        cb(new Error('Invalid file type. Only picture files with the extensions PNG and JPG are allowed!'), false) // Reject the file
    }
}

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024  // 10 MB
  },
  fileFilter
})

module.exports = { upload }