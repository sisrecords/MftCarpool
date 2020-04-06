const express = require('express');
const app = express();
const path = require('path');
const nodemailer = require('nodemailer');

const staticPath = path.join(__dirname, 'build');
const port = process.env.PORT || 3000;
app.use(express.static(staticPath));

const allowedExt = getAllowedExtensions();
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "mftcarpool@gmail.com", // generated ethereal user
        pass: "1q0p2w9o3e8i" // generated ethereal password
    },
    tls: { rejectUnauthorized: false }
});

app.get('/sendmail', async (req, res) => {
    // create reusable transporter object using the default SMTP transport
    try{
        const to = req.query.to;
        const message = req.query.message;
        
        
        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: 'mftcarpool@gmail.com', // sender address
            to: to, // list of receivers
            subject: "בדיקה", // Subject line
            // text: "Hello world?", // plain text body
            html: message // html body
        });
        
        res.send("mail was sent!");
    }
    catch(ex) {
        res.status(500).send('error in sending email');
    }
});

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