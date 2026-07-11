const fs = require('fs');
const html = fs.readFileSync('public/index.html', 'utf8');
const scriptStart = html.lastIndexOf('<script>')+8;
const script = html.slice(scriptStart, html.lastIndexOf('</script>'));
const lines = script.split('\n');

// Track backtick state
let inTpl = false;
for(let i=0; i<lines.length; i++){
  const l = lines[i];
  for(let j=0; j<l.length; j++){
    if(l[j]==='`') inTpl = !inTpl;
  }
  if(i>100 && i<165){
    process.stdout.write((i+1)+' '+(inTpl?'OPEN':'    ')+' '+l.substring(0,70)+'\n');
  }
}
console.log('\nTotal lines:', lines.length);
