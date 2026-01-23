import { diskStorage } from "multer";
import { extname } from "path";
import { v4 as uuid } from "uuid";

export const productImageStorage = diskStorage({
  destination: "./uploads/products",
  filename: (req, file, cb) => {
    const uniqueName = uuid() + extname(file.originalname);
    cb(null, uniqueName);
  },
});
