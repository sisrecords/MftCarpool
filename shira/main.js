const express = require('express');
const app = express();
const path = require('path');
const staticPath = path.join(__dirname, 'build');
const port = process.env.PORT || 3000;
app.use(express.static(staticPath));

const allowedExt = getAllowedExtensions();

app.get("*", (req, res) => {
    if (allowedExt.filter(ext => req.url.indexOf(ext) > 0).length > 0) {
      res.sendFile(path.resolve(`build/${req.url}`));
    } else {
      res.sendFile(path.resolve("build/index.html"));
    }
  });

app.listen(port, () => {
   console.log(`Server is up on port ${port}!`);
});

function getAllowedExtensions() {
    return [
      ".js",
      ".ico",
      ".css",
      ".png",
      ".jpg",
      ".woff2",
      ".woff",
      ".ttf",
      ".svg"
    ];
  }