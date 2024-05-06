const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');

const session = require('express-session');
const FileStore = require('session-file-store')(session);
const cookieParser = require('cookie-parser');

const expressSanitizer = require('express-sanitizer');
const https = require("https");

const fs = require("fs");
const path = require("path");
const crypto = require('crypto');
const jwt = require("jsonwebtoken");
const cryptojs = require("crypto-js");

const secretKey = "temporary secret key";

const SHA256 = cryptojs.SHA256;

const sha256 = function(e){
  const req = e.toString();
  return crypto.createHmac('sha256', secretKey).update(req).digest('base64')
          .toString().replace(/[/]/g, '_');
}

const aes = {
  encryption : (data) => {
    const encryptedData = cryptojs.AES.encrypt(data.toString(), secretKey).toString();
    return encryptedData;
  },
  decryption : (data) => {
    const decryptedData = cryptojs.AES.decrypt(data.toString(), secretKey).toString(cryptojs.enc.Utf8);
    return decryptedData;
  }
}

const customHash = function(e){
  return e.slice(0, 2).toUpperCase()
}

// const a = aes.encryption(111);
// console.log(aes.decryption(a));


const app = express();

const options = {
  key: fs.readFileSync("./config/cert.key"),
  cert: fs.readFileSync("./config/cert.crt"),
};

app.use(cors({
  origin : 'http://localhost:3000',
  methods : ["GET", "POST"],
  credentials : true,
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.json());
app.use(express.urlencoded({ extended : true}));
app.use(expressSanitizer());
app.use(cookieParser());

app.use(session({
  name : "SID",
  secret : secretKey,
  resave : false,
  saveUninitialized : true,
  store : new FileStore(),
  cookie : {
    maxAge : 60*60*24*30,
    httpOnly : false,
    secure : true,
    sameSite : "None",
  }
}));

app.use((req,res,next)=>{
  console.log(req.path)
  next();
})

app.use(express.static(path.join(__dirname, '../client/build')));




app.post("/login", function (req, res) {
  try {
    const id = sha256(SHA256(req.body.id));
    const pss = sha256(req.body.pss);
    const Path = path.join(__dirname, 'database', "User", customHash(id), id, 'userInfo.json');
    if(!fs.existsSync(Path)){
      res.json({Err : 4001, ErrMessage : "Invalid Id", LoggedIn : false});
    }
    else {
      fs.readFile(Path, (err, readData) => {
        const data = JSON.parse(readData);
        const salt = data.salt;
        const name = data.name;

        if(err) {
          console.log(err);
          res.json({Err : true, ErrMessage : err, LoggedIn : false})
        }
        else if(data.saltedPassword !== sha256(`${pss}:${salt}`)){
          res.json({Err : 4002, ErrMessage : "Invalid Password", LoggedIn : false})
        }
        else {
          console.log(id);

          req.session.hashid = sha256(id);
          req.session.Loggedin = true;

          let token;

          if(req.body.tokeepLogin) {
            const payload = {id:sha256(id)};
            token = jwt.sign(payload, secretKey, {expiresIn:60*60*24});
            console.log("JWT generated");
          }

          res.json({
            Err : false, 
            ErrMessage : null, 
            Loggedin : true,
            token : req.body.tokeepLogin ? token : undefined,
            name : name,
          });
        }
      })
    }
  }
  catch (err) {
    console.log(err);
    res.json({Err : true, ErrMessage : err, LoggedIn : false});
  }
});



app.post("/login/session", (req, res) => {
  try {
    const id = sha256(req.body.id);
    const hashid = req.session.hashid;
    const token = req.headers.authorization;
    const loggedin = req.session.Loggedin && hashid === sha256(id).toString(); //sha 2번 SHA 1번
    
    res.json({Err : false, ErrMessage : null, LoggedIn : loggedin});
  }
  catch(err) {
    console.log(err);
    res.json({Err : true, ErrMessage : err, LoggedIn : false})
  }
});



app.post("/signup/toSignUp", function (req, res) {
  try {
    const id = sha256(SHA256(req.body.id)).toString(16); //1.SHA256 2.sha256
    const pss = sha256(req.body.pss).toString(16);
    const salt = crypto.randomBytes(64).toString('base64');
    const password = sha256(`${pss}:${salt}`).toString('base64');
    const name = req.body.name;

    const signUpPath = path.join(__dirname,'database', "User", customHash(id), id)
    
    if(!fs.existsSync(signUpPath)) {
      fs.mkdirSync(signUpPath,  { recursive : true });
    }
   
    fs.writeFile(path.join(signUpPath, `userInfo.json`), 
      JSON.stringify({
        name : name,
        saltedPassword : password,
        salt : salt,
      }), 
      (err_1) => {
        console.log(err_1 ? '\n\n'+err_1+'\n\n' : 'None');
        if(!err_1) {
            fs.mkdirSync(path.join(signUpPath, 'userData'))
            res.json({Err : false, ErrMessage : 'None', IsSignedUp : true});
        }
        else {
          console.log(err_1);
          res.json({Err : true, ErrMessage : err_1, IsSignedUp : false})
        }
      }
    )
  }
  catch (err) { 
    console.log(err);
    res.json({Err : true, ErrMessage : err, IsSignedUp : false});
  }
});


app.post("/signup/checkId", function(req, res){
  try {
    console.log(req.body.id)
    const id = sha256(req.body.id).toString(16);
    const dir = customHash(id);
    const isDuplicated = fs.existsSync(path.join(__dirname, "database", "User", dir, id));
    res.json({Err : false, ErrMessage : null, isNotDuplicated : !isDuplicated});
  }
  catch (err) {
    console.log(err);
    res.json({Err : true, ErrMessage : err, isDuplicated : null});
  }
});


app.post("/getBoard/:query/:page", (req, res) => {
  const board = req.params.query;
  const page = req.params.page === "null" ? 1 : req.params.page;
  fs.readdir(path.join(".", "database", "Contents", board), (err, files) => {
    const ret = [];
    const slicedBoard = files.slice((page-1)*5,page*5)
    try{
      if(!err){
        slicedBoard.forEach((e) => {
          const data = JSON.parse(fs.readFileSync(path.join(".", "database", "Contents", board, e)));
          const idx = data.header;
          idx.hash = encodeURIComponent(aes.encryption(e));
          idx.chatNumber = data.chat.length;
          ret.push(idx);
        });
        res.json({Err : false, ErrMessage : "None", contents : ret});
      }
      else res.json({Err : true, ErrMessage : err, contents : []});
    }
    catch(err){
      console.log(err);
      res.json({Err : true, ErrMessage : "None", contents : []});
    }
    

  })
});


app.post("/getMaxBoard/:query", (req,res) => {
  const board = req.params.query;
  fs.readFile(path.join(__dirname,"database","Contents","count.json"),(err,Data)=>{
    if(err){
      console.log(err);
      res.json({
        Err : true,
        ErrMessage : err,
        Reading : false
      })
      return;
    }
    const data = JSON.parse(Data)
    res.json({page : data[board]})
  })
});


app.post("/write/:board", (req, res) => {
  const board = req.params.board;
  const contents = req.body.contents;
  const name = req.body.name;
  const id = sha256(req.body.id)
  const date = new Date();
  const file = {
    header : {
      title : contents.title,
      date : date, 
      recommended : 0, 
      author : name,
    },
    content : contents.body, 
    chat : [],
  }

  fs.writeFile(path.join(__dirname, "database", "Contents", board, `${Number(date).toString(16)}&${sha256(JSON.stringify(file))}.json`), 
  JSON.stringify(file), 
  (err) => {
    if(!err){
      fs.readFile(path.join(__dirname,"database","Contents","count.json"),(err,Data)=>{
        if(err){
          console.log(err);
          res.json({Err : true, ErrMessage : err, Written : false });
          return;
        }
        const data = JSON.parse(Data);
        data[board] += 1;
        fs.writeFile(path.join(__dirname,"database","Contents","count.json"),JSON.stringify({...data}),(err)=>{
          if(err){
            console.log(err);
            res.json({Err : true, ErrMessage : err, Written : false });
            return;
          }
          else{
            res.json({
              Err : false,
              ErrMessage : null,
              Written : true
            })
            return;
          }
        })
      })
    }
    else {
      console.log(err);
      res.json({Err : true, ErrMessage : err, Written : false});
    }
  });

  // fs.writeFile(path.join(__dirname,"database","User",customHash(id),id,"userData"))
});


app.post("/get/:bQuery/:bId", (req, res) => {
  const board = req.params.bQuery;
  const bId = aes.decryption(req.params.bId);
  const Path = path.join(__dirname, 'database', 'Contents', board, bId);
  //console.log('board Id :', Path);
  if(!['free', 'quest', 'report'].includes(board) || !fs.existsSync(Path)){
    console.log("Invalid Board");
    res.json({Err:true, ErrMessage:"Invalid Board", Gotten : false});
    return;
  }
  fs.readFile(Path, (err, readData) => {
    if(!err){
      const data = JSON.parse(readData);
      //console.log(data);
      res.json({Err : false, ErrMessage:"None", Gotten:true,
        Board : data});
      return;
    }
    else {
      res.json({Err:true, ErrMessage:err, Gotten:false});
      console.log(err);
      return;
    }

  });
});



app.post("/write/chat/:board/:bId", (req, res) => {
  const board = req.params.board;
  const bId = aes.decryption(req.params.bId);
  const Path = path.join(__dirname, 'database', 'Contents', board, bId);
  const appendingChat = {
    author : req.body.author,
    content : req.body.chat,
    timestamp : new Date(),
  };
  fs.readFile(Path, (err, rData) => {
    if(!err){
      const data = JSON.parse(rData);
      appendingChat.hash = sha256(appendingChat);
      data.chat.push(appendingChat);
      console.log(appendingChat);
      fs.writeFile(Path,JSON.stringify(data), err => {
        if(!err) {
          res.json({Err : false, ErrMessage : "None", Written : true});
        }
        else {
          console.log(err);
          res.json({Err : true, Errmessage : err, Written : false});
        }
      })
    }
    else {
      console.log(err);
      res.json({Err : true, ErrMessage : err, Written : false});
    }

  })
})




app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

https.createServer(options, app).listen(8080, () => {
  console.log("HTTPS Server is listening");
})