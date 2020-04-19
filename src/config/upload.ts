import multer from 'multer';
import path from 'path';

const tpmFolder = path.resolve(__dirname, '..', '..', 'tmp');

export default {
  directory: tpmFolder,
  storage: multer.diskStorage({
    destination: tpmFolder,
    filename(request, file, callback) {
      const fileName = file.originalname;

      return callback(null, fileName);
    },
  }),
};
