import multer from 'multer';
import crypto from 'crypto';
import path from 'path';

const tpmFolder = path.resolve(__dirname, '..', '..', 'tmp');

export default {
  directory: tpmFolder,
  storage: multer.diskStorage({
    destination: tpmFolder,
    filename(request, file, callback) {
      const fileHash = crypto.randomBytes(10).toString('HEX');
      const fileName = `${fileHash}-${file.originalname}`;

      return callback(null, fileName);
    },
  }),
};
