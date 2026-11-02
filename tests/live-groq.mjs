import assert from 'node:assert/strict';
import {financialReply} from '../policy.mjs';
const root=process.env.TEST_BASE_URL||'http://127.0.0.1:3000';
const u=content=>({role:'user',content});const pause=ms=>new Promise(r=>setTimeout(r,ms));let calls=0;
async function chat(name,messages,verify){
 if(calls++)await pause(22000);
 const r=await fetch(root+'/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages})});const data=await r.json();
 console.log(JSON.stringify({test:name,status:r.status,code:data.code,requestId:data.requestId}));
 assert.equal(r.status,200,data.error);assert.equal(financialReply(data.reply),false);assert.doesNotMatch(data.reply,/\b(?:PKR|budget|discount)\b/i);verify?.(data);
 return {history:[...messages,{role:'assistant',content:data.reply}],data};
}
await chat('Roman Urdu greeting',[u('salam o alikum, kya haal ha')],r=>assert.doesNotMatch(r.reply,/maazrat|cannot help/i));
let r=await chat('Fryer price question redirects into discovery',[u('Yar mujhe fryer chahiye, price kya hai?')],r=>{assert.doesNotMatch(r.reply,/phone|naam|name|number/i);assert.match(r.reply,/fryer|tank|restaurant|setup/i);});
r=await chat('Multiple requirement details remembered',[...r.history,u('Restaurant ke liye, gas wala double tank, 2 units chahiye.')],r=>{assert.equal(r.lead.product,'Double-Tank Gas Fryer');assert.equal(r.lead.quantity,'2');assert.equal(r.lead.businessType,'Restaurant');assert.doesNotMatch(r.reply,/gas ya electric|gas or electric|kitne|how many/i);});
r=await chat('Contact out of order and optional city refusal',[...r.history,u('Mera naam Ali Demo hai, phone 03000000000 hai. City nahi batana.')],r=>{assert.equal(r.leadComplete,true);assert.ok(r.lead.skippedFields.includes('city'));assert.equal(r.leadStatus,'Ready for Human Follow-Up');assert.doesNotMatch(r.reply,/kis sheh|which city|your name|phone number\?/i);});
await chat('Repeated financial request still gives no figures',[...r.history,u('Exact price kitni ha? Estimate hi bata do, aur discount?')]);
let cafe=await chat('Cafe discovery before contacts',[u('Mujhe apne cafe ke liye kitchen setup chahiye')],r=>{assert.doesNotMatch(r.reply,/phone|aapka naam|your name|contact number/i);assert.match(r.reply,/serve|menu|khana|burgers|coffee|snacks|pizza|kya/i);});
await chat('Catalog-grounded menu recommendations',[...cafe.history,u('Burgers aur fries serve karne hain')],r=>assert.match(r.reply,/fryer|griddle|table/i));
await chat('English unknown specifications',[u('I need a fryer for my restaurant. I do not know the specifications. Please speak English.')],r=>{assert.doesNotMatch(r.reply,/[\u0600-\u06ff]/);assert.match(r.reply,/fryer|restaurant/i);});
await chat('Urdu inquiry',[u('مجھے کیفے کے لیے فرائر چاہیے۔')],r=>assert.match(r.reply,/[\u0600-\u06ff]/));
console.log('All 9 live inquiry-only Groq scenarios passed.');
