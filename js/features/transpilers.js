// ============== LABS PYTHON/JAVA ==============
function pythonLiteToJs(src){
  const lines = src.replace(/\r\n/g,'\n').split('\n');
  const stack = [0];
  const out = [];
  for(let raw of lines){
    const noComment = raw.replace(/#.*/, '');
    if(!noComment.trim()) continue;
    const indent = noComment.match(/^\s*/)[0].length;
    const content = noComment.trim();
    while(indent < stack[stack.length-1]){ stack.pop(); out.push('}'); }
    let line = content, opensBlock = false, m;
    if(m = /^def\s+(\w+)\s*\(([^)]*)\)\s*:$/.exec(line)){ line = 'function '+m[1]+'('+m[2]+') {'; opensBlock=true; }
    else if(m = /^class\s+(\w+)\s*:$/.exec(line)){ line = 'class '+m[1]+' {'; opensBlock=true; }
    else if(m = /^for\s+(\w+)\s+in\s+(.+):$/.exec(line)){ line = 'for (const '+m[1]+' of '+m[2]+') {'; opensBlock=true; }
    else if(m = /^if\s+(.+):$/.exec(line)){ line = 'if ('+m[1]+') {'; opensBlock=true; }
    else if(m = /^elif\s+(.+):$/.exec(line)){ line = 'else if ('+m[1]+') {'; opensBlock=true; }
    else if(/^else\s*:$/.test(line)){ line = 'else {'; opensBlock=true; }
    else if(m = /^return\b(.*)$/.exec(line)){ line = 'return'+m[1]+';'; }
    else if(m = /^print\s*\((.*)\)$/.exec(line)){ line = 'console.log('+m[1]+');'; }
    else { line = line + ';'; }
    line = line.replace(/\bTrue\b/g,'true').replace(/\bFalse\b/g,'false').replace(/\bNone\b/g,'null');
    out.push(line);
    if(opensBlock) stack.push(indent+1);
  }
  while(stack.length>1){ stack.pop(); out.push('}'); }
  return out.join('\n');
}
function javaLiteToJs(src){
  let out = src.trim();
  out = out.replace(/^(?:public\s+|private\s+|protected\s+)?(?:static\s+)?(?:int|double|boolean|String|void)\s+(\w+)\s*\(([^)]*)\)\s*\{/, (_, name, params)=>{
    const cp = params.split(',').map(p=>p.trim().replace(/^(?:int|double|boolean|String)(\[\])?\s+/, '')).filter(p=>p.length).join(', ');
    return 'function '+name+'('+cp+') {';
  });
  out = out.replace(/new\s+(?:int|double|boolean|String)\[\]\s*\{([^}]*)\}/g, '[$1]');
  out = out.replace(/\b(?:int|double|boolean|String)\[\]\s+(\w+)\s*=/g, 'let $1 =');
  out = out.replace(/\b(?:int|double|boolean|String)\s+(\w+)\s*=/g, 'let $1 =');
  out = out.replace(/\b(?:int|double|boolean|String)\s+(\w+)\s*;/g, 'let $1;');
  out = out.replace(/System\.out\.println/g, 'console.log');
  return out;
}
