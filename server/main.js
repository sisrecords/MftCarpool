const sql = require("mssql");
const port = 3000;

const express = require("express");
const session = require("express-session");
const nodemailer = require("nodemailer");
(async() => {

try {
  const server = express();
  setSession();
  const connectionsPool = await getConnectionsPool();
  server.get('/connect', (req, res) => {
    if(req.session.user == null){
      req.session.user = {name: 'Maor Edri'};
    }

    res.send("connected!");
  })

  server.get('/sendmail', async (req, res) => {

    //https://ethereal.email/ for creating test emails

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: "friedrich73@ethereal.email", // generated ethereal user
        pass: "qmuMEHjbq1muXzVvMd" // generated ethereal password
      }
    });

    // create reusable transporter object using the default SMTP transport
    // let transporter = nodemailer.createTransport({
    //   service: "gmail",
    //   auth: {
    //     user: "mail@gmail.com", // generated ethereal user
    //     pass: "password" // generated ethereal password
    //   }
    // });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: 'friedrich73@ethereal.email', // sender address
      to: "friedrich73@ethereal.email", // list of receivers
      subject: "Hello again ✔", // Subject line
      // text: "Hello world?", // plain text body
      html: '<b>Hello world123?</b><p>Click<a href="http://192.168.59.1:3001">Lets Go To Map</a></p>"' // html body
    });

    res.send("mail was sent!");
  })

//check
  async function getConnectionsPool(){
    const config = {
      user: "mftfullstackadmin",
      password: "Admin123",
      server: "mft-full-stack.database.windows.net",
      database: "MftFullStack",
      encrypt: true
    };
    const pool = await sql.connect(config);
    console.log("Connected")

    return pool;
  }
  
  const userConnectedMiddleware = (req, res, next) => {
    console.log(req.session.user);
    if(req.session.user != null){
      next();
    } else{
      res.status(500);
      res.send("error!");
    }
  };

  server.get('/getAllProjects', userConnectedMiddleware, (req, res)=>{
    res.send("hi!");
  });


  function setSession() {
    server.use(
      session({
        secret: "my-example-session",
        cookie: {
          maxAge: 10000000000000
        }
      })
      );
  }
  
  function setRoutes(){
    const authRoutes = require('./routes/auth');
    server.use("/auth", authRoutes);
  }
  
  server.listen(port, () => {
    console.log(`listening on port ${port}`);
  });
} catch (e) {
  console.log(e);
}

})()
