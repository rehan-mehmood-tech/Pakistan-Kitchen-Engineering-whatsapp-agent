import assert from 'node:assert/strict';
const root=process.env.TEST_BASE_URL||'http://127.0.0.1:3000';
const pause=ms=>new Promise(r=>setTimeout(r,ms));
const user=content=>({role:'user',content});let count=0;
async function chat(name,messages,verify){
 if(count++)await pause(22000);
 const r=await fetch(root+'/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages})});const data=await r.json();
 console.log(JSON.stringify({test:name,status:r.status,code:data.code,requestId:data.requestId}));
 assert.equal(r.status,200,`${name}: ${data.error||''}`);assert.equal(typeof data.reply,'string');verify(data);
 return [...messages,{role:'assistant',content:data.reply}];
}
const roman=r=>{assert.doesNotMatch(r.reply,/[\u0600-\u06ff]/);assert.match(r.reply,/\b(aap|ji|ka|ki|kya|hai|hain|ha|hun|chahiye|bilkul|main|mein|kaise|madad)\b/i);};
const greeting=r=>assert.doesNotMatch(r.reply,/maazrat|sorry|cannot|can't|only help/i);
await chat('English hello',[user('hello')],r=>{greeting(r);assert.match(r.reply,/hello|hi|welcome/i);});
await chat('Roman Urdu salam',[user('salam o alikum')],r=>{roman(r);greeting(r);});
await chat('Roman Urdu rapport',[user('aoa, kya haal ha')],r=>{roman(r);greeting(r);});
await chat('Roman Urdu language preference',[user('yr urdu ma baat kr lae jaesa ma kr rha hu')],r=>{roman(r);greeting(r);});
await chat('Urdu equipment inquiry',[user('مجھے ریسٹورنٹ کے لیے فرائر چاہیے۔')],r=>assert.match(r.reply,/[\u0600-\u06ff]/));
const history=await chat('Roman Urdu sample pricing',[user('Double basket gas fryer ki sample price kya hai?')],r=>{roman(r);assert.match(r.reply,/85,?000/);assert.equal(r.lead.product,'Double Basket Gas Deep Fryer');assert.equal(r.leadComplete,false);});
await chat('Switch to English with context',[...history,user('Please reply in English. What price did you just mention?')],r=>{assert.match(r.reply,/85,?000/);assert.doesNotMatch(r.reply,/[\u0600-\u06ff]/);});
await chat('Roman Urdu quotation details',[...history,user('Mera naam Ahmed Demo hai, phone 03000000000 hai, city Lahore hai, quantity 2 hai. Quotation chahiye.')],r=>{roman(r);assert.equal(r.lead.name,'Ahmed Demo');assert.equal(r.lead.city,'Lahore');assert.equal(r.lead.quantity,'2');assert.equal(r.leadComplete,true);assert.equal(r.quotationRequested,true);});
await chat('Off-topic scope',[user('Pakistan ka prime minister kon ha?')],r=>{roman(r);assert.match(r.reply,/kitchen|equipment|inquir|products/i);assert.doesNotMatch(r.reply,/shehbaz|shahbaz|sharif|imran|nawaz/i);});
console.log('All 9 live Groq scenarios passed. No AI fixtures or scripted fallbacks used.');
