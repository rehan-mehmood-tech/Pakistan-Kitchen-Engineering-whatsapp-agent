import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {completeChat,DEFAULT_MODEL} from './ai.mjs';
import {prepareHistory} from './history.mjs';
import {catalog} from './catalog.mjs';
export {catalog};
function json(res,status,data){res.writeHead(status,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify(data));}
export function createApp({chat=completeChat,apiKey=process.env.GROQ_API_KEY,model=process.env.GROQ_MODEL?.trim()||DEFAULT_MODEL,logger=entry=>console.warn(JSON.stringify(entry))}={}) {
 const limits=new Map();
 return http.createServer(async(req,res)=>{
  const requestId=/^[a-f0-9-]{36}$/i.test(req.headers['x-request-id']||'')?req.headers['x-request-id']:crypto.randomUUID();
  const started=Date.now();res.setHeader('X-Request-ID',requestId);
  try {
   const url=new URL(req.url,'http://localhost');
   if(url.pathname==='/api/config')return json(res,200,{configured:!!apiKey});
   if(url.pathname==='/api/catalog')return json(res,200,catalog);
   if(url.pathname==='/api/chat'&&req.method==='POST'){
    const ip=req.socket.remoteAddress;const now=Date.now();let record=limits.get(ip);
    if(!record||now-record.time>60000){record={time:now,count:0};limits.set(ip,record);}
    // Discard expired throttle entries; no conversation or customer state is stored.
    if(limits.size>1000)for(const [key,value] of limits)if(now-value.time>60000)limits.delete(key);
    if(++record.count>15)return json(res,429,{error:'Please wait a minute before sending more messages.',code:'DEMO_RATE_LIMIT',requestId});
    if(!apiKey)return json(res,503,{error:'Live AI is not configured yet. Add GROQ_API_KEY to the server environment. You can still explore the dashboard and sample leads.',code:'AI_NOT_CONFIGURED',requestId});
    const chunks=[];let bytes=0;
    for await(const chunk of req){bytes+=chunk.length;if(bytes>200000)return json(res,413,{error:'This conversation is too large. Please copy important details and reset the demo.',code:'REQUEST_TOO_LARGE',requestId});chunks.push(chunk);}
    let body;try{body=JSON.parse(Buffer.concat(chunks).toString('utf8'));}catch{return json(res,400,{error:'Please send a valid chat request.',code:'INVALID_JSON',requestId});}
    prepareHistory(body?.messages);
    const result=await chat({catalog,messages:body.messages,apiKey,model,requestId,logger});
    return json(res,200,result);
   }
   if(req.method!=='GET')return json(res,405,{error:'Method not allowed',requestId});
   const files={'/':'index.html','/app.js':'app.js','/language.js':'language.js','/session.js':'session.js','/style.css':'style.css'};
   const file=files[url.pathname];if(!file)return json(res,404,{error:'Not found',requestId});
   res.writeHead(200,{'Content-Type':file.endsWith('.css')?'text/css':file.endsWith('.js')?'text/javascript':'text/html','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer','Cache-Control':'no-cache','Content-Security-Policy':"default-src 'self'; style-src 'self'; script-src 'self'; connect-src 'self'; img-src 'self' data:; frame-ancestors 'none'"});
   res.end(await readFile(fileURLToPath(new URL(`./public/${file}`,import.meta.url))));
  }catch(error){
   const known=Number.isInteger(error.status)&&error.status>=400&&error.status<=504;
   if(!known)logger({requestId,model,phase:'request',category:'INTERNAL_ERROR',attempt:0,providerStatus:null,durationMs:Date.now()-started});
   return json(res,known?error.status:500,{error:known?error.message:'Something went wrong. Please retry.',code:known?error.code:'INTERNAL_ERROR',requestId});
  }
 });
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===process.argv[1])createApp().listen(process.env.PORT||3000,'0.0.0.0',()=>console.log(`PKE demo listening on port ${process.env.PORT||3000}`));
