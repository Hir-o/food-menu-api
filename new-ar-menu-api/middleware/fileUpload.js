const multer = require('multer');
const fs = require('fs');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      if (file.fieldname === 'glb_file'){ 
        cb(null, './uploads/glb-files');
      } else if (file.fieldname === 'image'){
        cb(null, './uploads/images');
      }
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
    }
  })

  const fileFilter = (req, file, cb) => {
    if (file.fieldname === 'glb_file' && path.extname(file.originalname) === '.glb') {
      cb(null, true);
    } else if (file.fieldname === 'image' && ['.png', '.jpg', '.jpeg'].includes(path.extname(file.originalname).toLocaleLowerCase())){
      cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only .glb files are allowed in glb_file property. Only .png/.jpg/.jpeg files are allowed in image property.!'), false);
    }
  }
  
  const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB file size limit
  });

  const deleteFile = (file) => {
    fs.unlink(`./${file.path}`, (err) => {
      if (err) {
        throw new Error("Failed to delete file");
      }
    });
  };

  module.exports.upload = upload;
  module.exports.deleteFile = deleteFile;