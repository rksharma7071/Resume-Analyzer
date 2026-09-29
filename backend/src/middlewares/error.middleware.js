import multer from "multer";

const errorHandler = (err, req, res, next) => {
  const send = (status, message) => res.status(status).json({ success: false, message });

  if (err instanceof multer.MulterError) {
    return send(400, err.code === "LIMIT_FILE_SIZE" ? "Resume must be 3 MB or smaller." : err.message);
  }
  if (err.name === "CastError") return send(400, "Invalid ID.");
  if (err.code === 11000) return send(409, "An account with this email already exists.");
  if (err.expose) return send(err.status, err.message);

  console.error(err);
  return send(500, "Internal server error.");
};

export default errorHandler;