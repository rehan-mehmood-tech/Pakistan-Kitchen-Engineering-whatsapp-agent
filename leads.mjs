import {qualificationStatus} from './public/session.js';
const scalarFields=['name','phone','city','product','specificType','category','quantity','intendedUse','businessType','preferences','notes'];
const cities=[['Lahore','لاہور'],['Faisalabad','فیصل آباد'],['Gujranwala','گوجرانوالہ'],['Islamabad','اسلام آباد'],['Rawalpindi','راولپنڈی'],['Karachi','کراچی'],['Multan','ملتان'],['Peshawar','پشاور'],['Quetta','کوئٹہ'],['Sialkot','سیالکوٹ']];
const uncertain=/pata\s*nahi|maloom\s*nahi|not sure|don.?t know|not decided|decide nahi|نہیں معلوم|پتہ نہیں/i;
const refusal=/prefer not|rather not|won.?t (?:share|provide)|don.?t (?:want|wish)|nahi (?:batana|dena)|share nahi|نہیں بتانا|نہیں دینا/i;
const financial=/\b(?:budget|price|cost|discount|payment|PKR|rupees|Rs\.?|lakh|lac)\b|بجٹ|قیمت|روپے|ادائیگی|رعایت/i;
export function validPhone(value){return /^(?:\+?92|0)3\d{9}$/.test(String(value).replace(/[\s()-]/g,''));}
function clean(value){return value?.split(/[,;،\n]|\b(?:hai|hain|aur|and|phone|city|quantity|please|mujhe|I\s+(?:need|want))\b|(?:ہے|ہیں|اور|فون|شہر)/i)[0].trim().replace(/[.!؟۔]+$/u,'').trim();}
function usableName(value){return value&&value.length<=80&&/^[\p{L} .'-]+$/u.test(value)&&!uncertain.test(value)&&!refusal.test(value)&&!/\b(hello|salam|aoa|fryer|chahiye|need|quotation|restaurant|cafe|gas|electric|no|skip)\b/i.test(value);}
export function questionField(previous){
 const question=previous.split(/[.!?؟۔\n]/u).map(s=>s.trim()).filter(Boolean).at(-1)||'';
 if(/address|street|house|GPS|پتہ|گلی/i.test(question))return 'address';
 if(/phone|contact number|whatsapp.*number|mobile|فون|رابطہ نمبر/i.test(question))return 'phone';
 if(/your name|aapka naam|apka naam|apna naam|naam.*bata|نام/i.test(question))return 'name';
 if(/city|sheh[ae]r|location|شہر|علاقہ/i.test(question))return 'city';
 if(/how many|kitn[ei]|quantity|units|تعداد|کتنے/i.test(question))return 'quantity';
 if(/gas|electric|fuel|گیس|الیکٹرک/i.test(question))return 'preferences';
 if(/(?:what|which|kis|kauns[ai]|kons[ai]).*(?:equipment|type)/i.test(question))return 'specificType';
 if(/restaurant|cafe|use|business|serve|menu|استعمال|ریسٹورنٹ|کیفے/i.test(question))return 'intendedUse';
 if(/single|double|tank|type|specification|سائز|ٹینک/i.test(question))return 'specificType';
 return null;
}
function findProducts(text,catalog,current){
 let source=text;
 if(current.some(name=>/fryer/i.test(name))&&!/fryer|فرائر/i.test(source)&&/gas|electric|single|double|tank|basket|countertop|گیس|ڈبل|سنگل|الیکٹرک/i.test(source))source+=' fryer';
 const aliases=[
  ['Single-Tank Gas Fryer',/single.?tank.*fryer|single.?basket.*fryer|سنگل.*فرائر/i],
  ['Double-Tank Gas Fryer',/double.?tank.*fryer|double.?basket.*fryer|ڈبل.*فرائر/i],
  ['Electric Deep Fryer',/electric.*fryer|الیکٹرک.*فرائر/i],['Countertop Fryer',/countertop.*fryer/i],
  ['Commercial Gas Range',/gas\s*range|(?:[24]|two|four)[ -]?burner|گیس رینج/i],
  ['Industrial Cooking Burner',/industrial.*burner/i],['Commercial Griddle',/griddle|گرڈل/i],['Hot Plate',/hot\s*plate|ہاٹ پلیٹ/i],
  ['Shawarma Machine',/shawarma|شوارما/i],['Commercial Baking Oven',/baking\s*oven|بیکنگ اوون/i],
  ['Pizza Oven',/pizza\s*oven|پیزا.*اوون/i],['Convection Oven',/convection\s*oven|کنویکشن/i],['Dough Mixer',/dough\s*mixer|ڈو مکسر/i],
  ['Commercial Refrigerator',/commercial\s*refrigerator|(?<!display\s)fridge|فریج/i],['Commercial Freezer',/freezer|فریزر/i],
  ['Stainless Steel Chiller',/chiller|چلر/i],['Display Refrigerator',/display\s*(?:refrigerator|fridge)|ڈسپلے.*فریج/i],
  ['Vegetable Cutter',/vegetable\s*cutter|سبزی.*کٹر/i],['Meat Mincer',/meat\s*mincer|قیمہ/i],
  ['Stainless Steel Preparation Table',/prep(?:aration)?\s*table|پریپریشن ٹیبل/i],['Commercial Sink',/sink|سنک/i],
  ['Stainless Steel Work Table',/work\s*table|ورک ٹیبل/i],['Exhaust Hood',/exhaust\s*hood|ایگزاسٹ/i],
  ['Kitchen Ventilation Equipment',/ventilation|وینٹیلیشن/i],['Commercial Food Warmer',/food\s*warmer|فوڈ وارمر/i]
 ];
 let found=catalog.filter(p=>source.toLowerCase().includes(p.name.toLowerCase())).map(p=>p.name);
 for(const [name,pattern]of aliases)if(pattern.test(source)&&catalog.some(p=>p.name===name))found.push(name);
 if(/electric|الیکٹرک/i.test(source)&&/fryer|فرائر/i.test(source))found=found.filter(n=>!/(?:Single|Double)-Tank Gas Fryer/.test(n));
 if(found.includes('Display Refrigerator'))found=found.filter(n=>n!=='Commercial Refrigerator');
 if(!found.length&&/fryer|فرائر/i.test(source))found=['Commercial fryer — type to confirm'];
 if(!found.length&&/kitchen\s*setup|complete\s*setup|کچن.*سیٹ اپ/i.test(source))found=['Commercial kitchen setup'];
 return [...new Set(found)];
}
export function extractLead(messages,catalog){
 const lead={};let products=[];const skipped=new Set();
 for(let i=0;i<messages.length;i++){
  if(messages[i].role!=='user')continue;
  const text=messages[i].content.replace(/[۰-۹٠-٩]/g,c=>String('۰۱۲۳۴۵۶۷۸۹'.includes(c)?'۰۱۲۳۴۵۶۷۸۹'.indexOf(c):'٠١٢٣٤٥٦٧٨٩'.indexOf(c)));
  const previous=messages[i-1]?.role==='assistant'?messages[i-1].content:'';const field=questionField(previous);
  const declines=uncertain.test(text)||refusal.test(text)||/^\s*(?:skip|no thanks|نہیں)\s*[.!۔]?$/i.test(text);
  if(declines&&field)skipped.add(field);
  if(declines&&/city|sheh[ae]r|شہر/i.test(text))skipped.add('city');
  if(declines&&/specification|tank|type|specs|تفصیل|ٹینک/i.test(text))skipped.add('specificType');
  if(/exact address|street|house|GPS|پورا پتہ/i.test(text)&&refusal.test(text))skipped.add('address');
  const explicitName=text.match(/(?:my name is|name\s*:|mera(?:\s+demo)?\s+naam(?:\s+hai)?|naam\s*[:=]|میرا نام|نام\s*[:：])\s*([^,;،\n]+)/iu);
  let name=clean(explicitName?.[1]);
  if(!name&&field==='name'&&!declines&&!/[?؟\d]/.test(text)&&!cities.some(([en,ur])=>text.includes(en)||text.includes(ur)))name=clean(text);
  if(usableName(name)){lead.name=name;skipped.delete('name');}
  const phone=text.match(/(?:phone(?: number)?|mobile|whatsapp(?: number)?|فون نمبر|فون)\s*(?:is|hai|[:=])?\s*([+\d][\d\s()-]{3,20})/iu);
  const contactText=text.split(/[,;،\n]|\.(?=\s)/).filter(part=>!financial.test(part)).join(' ');
  const rawPhone=phone?.[1]||contactText.match(/(?:\+?92|0)3[\d\s()-]{8,16}\d/)?.[0];
  if(rawPhone){lead.phone=rawPhone.trim();skipped.delete('phone');}
  else if(field==='phone'&&/^[+\d\s()-]{5,20}$/.test(text.trim()))lead.phone=text.trim();
  const city=text.match(/(?:\bcity\s*(?:is|hai|[:=])?|sheh[ae]r\s*(?:hai|[:=])?|شہر\s*[:：]?)\s+([^,;،\n]+)/iu);
  let location=clean(city?.[1]);
  if(!location&&field==='city'&&!declines&&!/[?؟\d]/.test(text))location=clean(text);
  const known=cities.find(([en,ur])=>new RegExp(`\\b${en}\\b`,'i').test(text)||text.includes(ur));
  if(!location&&known)location=known[0];
  if(location&&location.length<=80&&/^[\p{L} .'-]+$/u.test(location)&&!refusal.test(location)&&!uncertain.test(location)&&(!declines||city||known)){lead.city=location;skipped.delete('city');}
  const factText=text.split(/[,;،\n]|[.!؟۔](?=\s|$)/u).filter(part=>!uncertain.test(part)&&!refusal.test(part)).join(' ');
  const business=[['Restaurant',/restaurant|ریسٹورنٹ/i],['Cafe',/caf[eé]|کیفے/i],['Bakery',/bakery|بیکری/i],['Fast-food setup',/fast.?food|فاسٹ فوڈ/i],['Catering',/catering|کیٹرنگ/i],['Hotel',/hotel|ہوٹل/i]].find(([,p])=>p.test(factText));
  if(business){lead.businessType=business[0];lead.intendedUse=business[0];skipped.delete('intendedUse');}
  const foods=[['burgers',/burger|برگر/i],['fries',/fries|فرائز/i],['pizza',/pizza|پیزا/i],['coffee',/coffee|کافی/i],['snacks',/snacks|اسنیکس/i],['baking',/baking|بیکنگ/i]].filter(([,p])=>p.test(factText)).map(([n])=>n);
  if(foods.length){lead.intendedUse=[lead.businessType,...foods].filter(Boolean).join('; ');skipped.delete('intendedUse');}
  if(field==='intendedUse'&&!business&&!foods.length&&!declines&&!financial.test(text)&&text.length<=180)lead.intendedUse=text.trim();
  const found=findProducts(factText,catalog,products);
  if(found.length){
   const changing=/instead|actually|change|switch|rather|not .*want|nahi|nahin|bajaye|badal|بدل|نہیں/i.test(text);
   if(found.length===1&&found[0]==='Commercial fryer — type to confirm'&&products.some(n=>/fryer/i.test(n)&&!n.includes('type to confirm')))found.splice(0,1,...products.filter(n=>/fryer/i.test(n)));
   const fryer=found.some(n=>/fryer/i.test(n));
   if(fryer)products=products.filter(n=>!/fryer/i.test(n));
   else if(changing)products=[];
   products=[...new Set([...products,...found])];
   lead.product=products.join('; ');lead.products=products;
   lead.category=[...new Set(products.map(n=>catalog.find(p=>p.name===n)?.category||(/fryer/i.test(n)?'Commercial Fryers':'Kitchen Setup')))].join('; ');
   skipped.delete('specificType');
   lead.specificType=products.filter(n=>!n.includes('type to confirm')&&n!=='Commercial kitchen setup').join('; ');
  }
  if(/gas|گیس/i.test(factText)&&!/gas.*(?:nahi|not)|(?:not|no)\s*gas/i.test(text)){lead.preferences='Gas';skipped.delete('preferences');}
  if(/electric|الیکٹرک/i.test(factText)){lead.preferences='Electric';skipped.delete('preferences');}
  const quantities=[...text.matchAll(/\b(\d{1,3})\s*(units?|pieces?|fryers?|ovens?|griddles?|double[ -]?(?:basket|tank)|single[ -]?(?:basket|tank)|عدد)/gi)];
  const quantity=text.match(/(?:quantity|qty|تعداد)\s*(?:is|hai|[:=])?\s*(\d{1,3})\b/i);
  if(quantity&&+quantity[1]>0){lead.quantity=quantity[1];skipped.delete('quantity');}
  else if(quantities.length)lead.quantity=quantities.length>1?quantities.map(m=>`${m[1]} ${m[2]}`).join('; '):quantities[0][1];
  else if(field==='quantity'&&!declines){const words={one:'1',two:'2',three:'3',four:'4',ek:'1',do:'2',teen:'3',char:'4','ایک':'1','دو':'2','تین':'3','چار':'4'};if(/^\d{1,3}$/.test(text.trim())&&+text>0)lead.quantity=text.trim();else if(words[text.trim().toLowerCase()])lead.quantity=words[text.trim().toLowerCase()];}
  const notes=text.match(/(?:requirements?|notes?|preferences?|timeframe|area)\s*:\s*([^\n]+)/i);
  if(notes){const safe=notes[1].split(/[,;،]|[.!۔](?=\s)/).filter(s=>!financial.test(s)).join('; ').trim();if(safe)lead.notes=safe;}
 }
 const validated=Object.fromEntries(scalarFields.filter(k=>typeof lead[k]==='string'&&lead[k].length<=500&&lead[k].trim()).map(k=>[k,lead[k]]));
 if(products.length)validated.products=products;
 if(skipped.size)validated.skippedFields=[...skipped];
 const phoneValid=!!validated.phone&&validPhone(validated.phone);
 const complete=!!(validated.name&&validated.product&&phoneValid);
 const output=Object.keys(validated).length?{...validated,phoneValid}:null;
 return {lead:output,leadComplete:complete,leadStatus:qualificationStatus(output,complete),warnings:validated.phone&&!phoneValid?['Please check the contact number. Use fictional demo contact details.']:[]};
}
