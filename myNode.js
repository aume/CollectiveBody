/******************
// collectiveBodyApp.js
// 2020
// miles.thorogood at UBC.ca
// for the 2020 Living Things Festival
*******************/


const express = require('express');
const path = require('path');
const fs = require('fs');
const csv = require('csv-parser');
// app.use(express.static('public'));

// set up the app
var app = express();
app.use(express.json());
//app.use(express.static(path.join(__dirname, './')));
app.use(express.static('public'))
// set entry html
app.get('/', function(req, res) {
    res.sendFile(path.join('/index.html'));
});



/********
//
// receive a save command and append preset to file
//
********/

app.get('/presets/fetch', function(req, res) {
  fs.readFile("public/data/presets.json", "utf8", function(err, data){
    if(err) throw err;
    //if(data=null) data = "[]" ;
    res.send(JSON.parse(data));
  });
});

app.put('/presets/save', function(request, response) {
  fs.writeFile('public/data/presets.json', JSON.stringify(request.body), function (err) {
  if (err) throw err;
    console.log('Saved!');
  });
  response.send('done') ;
});

app.get('/preferences/fetch', function(req, res) {

  // build the video and file list
  let stuff = {'sizes':['120','240','384','512','720','1080']};
  stuff['path'] = 'vids/' ;
  stuff['parts'] = {} ;
  fs.createReadStream('public/data/cb_video_list.csv')
    .pipe(csv())
    .on('data', (row) => {
      //let speed = row['Speed'] ;
      let part =  row['Part'] ;
      let file = row['File'] ;
      //if(!stuff[speed]) stuff[speed]={};
      if(!stuff['parts'][part]) stuff['parts'][part]=[];
      stuff['parts'][part].push(file);
      console.log(row);
    })
    .on('end', () => {
      console.log('CSV file successfully processed', stuff);
      res.send(JSON.stringify(stuff));
    });
});

// viewed at http://localhost:8082
app.listen(8082);
