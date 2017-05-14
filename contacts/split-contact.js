#!/bin/node
let fs = require('fs');

fs.readFile('contacts.vcf','utf8', (err,data)=>{
  if(err){
    console.error(err);
    return;
  }

  let current = [];
  let contacts = [];
  data.split('\n')
    .forEach(line=>{
      if(line==''){
        return;
      }
      if(line.indexOf('BEGIN')==0){
        contacts.push(current);
        current=[line];
      }else{
        current.push(line);
      }
    });
  contacts.push(current);
  contacts = contacts
    .filter(x=>x.length>0)
    .map((lines,i) => {
      let res = {};
      res.lines = lines;
      res.name = lines
        .map(x=>x.split('FN:'))
        .filter(x=>x.length==2)
        .map(x=>x[1])[0];
      //res.filename=i+'.vcf'
      return res;    
    })
  ;
  

  fs.mkdirSync('output');
  contacts.forEach((contact,i)=>{
    let filename = 'output/' + i + '.vcf';
    let content = contact.lines.join('\n');
    //content = content.replace('\r','');
    console.log('writing', contact.lines.length, contact.name);
    fs.writeFile(filename, content, err=>{
      if(err){
        console.error(err);
        return;
      }
      console.log('wrote to', filename);
    });
  });
});
