const http = require('http'); // 1 - Import Node.js core module
const https = require('https');
const express = require("express");
const fs = require("fs");
const app = express();
const path = require("path");

//app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
//app.use(express.static(path.join(__dirname,'/src/assets')));
app.use('/assets/', express.static(path.join(__dirname,'/dist/assets'))); //http://localhost:5001/assets/timanhlogo.0e3ef396.png -> have no assets static, so need to mount to dist
app.use(express.static(path.join(__dirname,'dist/assets')));
app.use(express.static(__dirname, {index: 'index02.html'}));


app.listen(5001, () => {
    console.log("Application started and Listening on port 5001");
});

app.get("/", (req, res) => {
    res.render("index02.html");
});
