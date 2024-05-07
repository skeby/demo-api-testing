const express = require("express");
const path = require("path");
const util = require("util");
const router = express.Router();
const PORT = process.env.PORT || 5002;
const fs = require("fs");
const HOST =
  process.env.NODE_ENV === "production"
    ? "https://demo-api-testing.onrender.com"
    : `http://localhost:${PORT}`;

router.post("/", async (req, res) => {
  try {
    let cname = req.body.name;
    const file = req.files.file;
    const fileName = file.name;
    const size = file.data.length;
    const extension = path.extname(fileName);

    const allowedExtensions = /png|jpeg|jpg|gif|xls|xlsx/;

    if (!allowedExtensions.test(extension)) throw "Unsupported extension!";
    if (size > 5000000) throw "File must be less than 5MB";

    const md5 = file.md5;
    const URL = md5 + extension;
    const dir = "./fileuploads/";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    await util.promisify(file.mv)(dir + URL);
    res.status(201);

    if (cname) {
      res.sendData({
        name: cname,
        success: true,
        message: "File uploaded successfully!",
        url: `${HOST}/fileuploads/` + URL,
      });
    } else {
      res.sendData({
        success: true,
        message: "File uploaded successfully!",
        url: `${HOST}/fileuploads/` + URL,
      });
    }
  } catch (err) {
    console.log(err);
    if (
      err === "Unsupported extension!" ||
      err === "File must be less than 5MB"
    ) {
      res.status(400).sendData({
        success: false,
        message: err,
      });
    } else {
      res.status(500).sendData({
        success: false,
        message: err,
      });
    }
  }
});

module.exports = router;
