const sql = require("mssql");
const port = 3000;

const express = require("express");
const session = require("express-session");
const nodemailer = require("nodemailer");
(async() => {

  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "mftcarpool@gmail.com", // generated ethereal user
        pass: "1q0p2w9o3e8i" // generated ethereal password
    },
    tls: { rejectUnauthorized: false }
});


try {
  const server = express();
  setSession();
  setRoutes();
  const connectionsPool = await getConnectionsPool();
  server.get('/connect', (req, res) => {
    if(req.session.user == null){
      req.session.user = {name: 'Maor Edri'};
    }

    res.send("connected!");
  })

  server.get('/sendmail', async (req, res) => {
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
    // const authRoutes = require('./routes/auth');
    // server.use("/auth", authRoutes);
    const ridesRoutes = require('./routes/rides');
    server.use("/rides", ridesRoutes);
  }
  
  server.listen(port, () => {
    console.log(`listening on port ${port}`);
  });
} catch (e) {
  console.log(e);
}

})()
