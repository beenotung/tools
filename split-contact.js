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
      res.filename = lines
        .map(x=>x.split('FN:'))
        .filter(x=>x.length==2)
        .map(x=>x[1])
        [0]
        +'.vcf'
      res.filename=i+'.vcf'
      return res;    
    })
  ;
  

  fs.mkdirSync('output');
  contacts.forEach(contact=>{
    let filename = 'output/' + contact.filename;
    let content = contact.lines.join('\r\n');
    fs.writeFile(filename, content, err=>{
      if(err){
        console.error(err);
        return;
      }
      console.log('wrote to', filename);
    });
  });
});
