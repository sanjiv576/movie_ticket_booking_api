
const multer = require('multer');

const uuid = require('uuid').v4;
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads');
    },
    filename: (req, file, cb) => {
        const fileExtension = path.extname(file.originalname.toLowerCase());

        cb(null, `${file.fieldname}${uuid()}${fileExtension}`);
    }
});

const fileFilter = (req, file, cb) => {
    // get file extension
    const fileExtension = path.extname(file.originalname.toLowerCase());

    // supports only png, jpeg and png
    if (!fileExtension.match(/png|jpeg|jpg/)) {
        return cb(new Error('only jpg, jpeg and png files are supported.'), false);
    }
    cb(null, true);
};


const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    // upto 4MB only
    limits: { fieldSize: 4 * 1024 * 1024 }
});

module.exports = upload;