import multer from "multer";
import { httpError } from "../utils/httpError.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 3 * 1024 * 1024, files: 1 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") return cb(null, true);
    cb(httpError(400, "Only PDF files are allowed."));
  },
});

export default upload;