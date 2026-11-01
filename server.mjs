import http from 'node:http';
import {completeChat,DEFAULT_MODEL} from './ai.mjs';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
export const catalog = [ ['Single Basket Gas Deep Fryer',48000,'Fryers'],['Double Basket Gas Deep Fryer',85000,'Fryers'],['Commercial Stainless Steel Work Table',35000,'Preparation'],['Two-Burner Commercial Gas Range',65000,'Cooking'],['Four-Burner Commercial Gas Range',125000,'Cooking'],['Commercial Shawarma Machine',95000,'Cooking'],['Commercial Griddle / Hot Plate',55000,'Cooking'],['Commercial Dough Mixer',145000,'Preparation'],['Stainless Steel Exhaust Hood',75000,'Ventilation'],['Commercial Pizza Oven',180000,'Cooking'],['Stainless Steel Sink Unit',42000,'Cleaning'],['Commercial Food Warmer',58000,'Holding'] ].map(([name,price,category],i)=>({id:`PKE-${i+1}`,name,price,category,description:`Sample ${name.toLowerCase()} for commercial kitchens.`,useCase:'Restaurant and commercial kitchen operations',availability:'To be confirmed',quotationRequired:true}));
const limits=new Map();
function json(res,status,data){res.writeHead(status,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify(data));}
const server=http.createServer(async(req,res)=>{try{
 const url=new URL(req.url,'http://localhost');
 if(url.pathname==='/api/config')return json(res,200,{configured:!!process.env.GROQ_API_KEY});
 if(url.pathname==='/api/catalog')return json(res,200,catalog);
 if(url.pathname==='/api/chat'&&req.method==='POST'){
  const ip=req.socket.remoteAddress; const now=Date.now(); const record=limits.get(ip)||{time:now,count:0};if(now-record.time>60000){record.time=now;record.count=0;} limits.set(ip,record);if(++record.count>15)return json(res,429,{error:'Please wait a minute before sending more messages.'});
  if(!process.env.GROQ_API_KEY)return json(res,503,{error:'Live AI is not configured yet. Add GROQ_API_KEY to the server environment. You can still explore the dashboard and sample leads.'});
  let raw='';for await(const chunk of req){raw+=chunk;if(raw.length>30000)return json(res,413,{error:'Conversation is too long. Please reset the demo.'});}
  let body;try{body=JSON.parse(raw);}catch{return json(res,400,{error:'Invalid request.'});}
  if(!body||!Array.isArray(body.messages)||!body.messages.length||body.messages.length>30||body.messages.some(m=>!m||!['user','assistant'].includes(m.role)||typeof m.content!=='string'||m.content.length>2000))return json(res,400,{error:'Please keep messages under 2,000 characters and reset after 30 messages.'});
  try{
   const result=await completeChat({catalog,messages:body.messages,apiKey:process.env.GROQ_API_KEY,model:process.env.GROQ_MODEL?.trim()||DEFAULT_MODEL});
   return json(res,200,result);
  }catch(error){return json(res,error.status||502,{error:error.message||'Could not get an AI response. Please retry.',code:error.code||'GROQ_UNAVAILABLE'});}

 }
 if(req.method!=='GET')return json(res,405,{error:'Method not allowed'});
 const files={'/':'index.html','/app.js':'app.js','/language.js':'language.js','/style.css':'style.css'};const file=files[url.pathname];if(!file)return json(res,404,{error:'Not found'});
 res.writeHead(200,{'Content-Type':file.endsWith('.css')?'text/css':file.endsWith('.js')?'text/javascript':'text/html','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer','Content-Security-Policy':"default-src 'self'; style-src 'self'; script-src 'self'; connect-src 'self'; img-src 'self' data:; frame-ancestors 'none'"});res.end(await readFile(fileURLToPath(new URL(`./public/${file}`,import.meta.url))));
}catch{json(res,500,{error:'Something went wrong. Please try again.'});}});
server.listen(process.env.PORT||3000,'0.0.0.0',()=>console.log(`PKE demo listening on port ${process.env.PORT||3000}`));
