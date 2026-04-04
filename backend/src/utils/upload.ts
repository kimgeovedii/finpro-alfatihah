import multer from "multer";
import path from "path";

export class Upload {
  private static storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, "../../uploads"));
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "-" + file.originalname);
    },
  });

  public static get middleware() {
    return multer({ storage: Upload.storage });
  }
}
