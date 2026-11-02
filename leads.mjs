const fields = ['name','phone','city','product','quantity','budget','notes'];
const cities = [['Lahore','لاہور'],['Faisalabad','فیصل آباد'],['Gujranwala','گوجرانوالہ'],['Islamabad','اسلام آباد'],['Rawalpindi','راولپنڈی'],['Karachi','کراچی'],['Multan','ملتان'],['Peshawar','پشاور'],['Quetta','کوئٹہ'],['Sialkot','سیالکوٹ']];
export function validPhone(value) { return /^(?:\+?92|0)3\d{9}$/.test(String(value).replace(/[\s()-]/g,'')); }
function clean(value) {
  return value?.split(/[,;،\n]|\b(?:hai|hain|aur|and|phone|city|quantity|budget|please|mujhe|I\s+(?:need|want))\b|(?:ہے|ہیں|اور|فون|شہر)/i)[0].trim().replace(/[.!؟۔]+$/u,'').trim();
}
function usableName(value) { return value && value.length<=80 && /^[\p{L} .'-]+$/u.test(value) && !/\b(hello|salam|aoa|fryer|chahiye|need|quotation|restaurant)\b/i.test(value); }
function matchProduct(text, catalog) {
  if(/electric|الیکٹرک/i.test(text)&&/fryer|فرائر/i.test(text))return 'Electric fryer — availability and specifications to confirm';
  const exact = catalog.find(p => text.toLowerCase().includes(p.name.toLowerCase()));
  if (exact) return exact.name;
  const tests = [
    [/double\s*(?:basket)?[^.!؟۔]{0,24}fryer|ڈبل.*فرائر/i, 'Double Basket Gas Deep Fryer'],
    [/single\s*(?:basket)?[^.!؟۔]{0,24}fryer|سنگل.*فرائر/i, 'Single Basket Gas Deep Fryer'],
    [/four.?burner|4.?burner|چار.*برنر/i, 'Four-Burner Commercial Gas Range'],
    [/two.?burner|2.?burner|دو.*برنر/i, 'Two-Burner Commercial Gas Range'],
    [/shawarma|شوارما/i, 'Commercial Shawarma Machine'], [/pizza\s*oven|پیزا.*اوون/i, 'Commercial Pizza Oven'],
    [/dough\s*mixer|ڈو مکسر/i, 'Commercial Dough Mixer'], [/exhaust\s*hood|ایگزاسٹ/i, 'Stainless Steel Exhaust Hood'],
    [/work\s*table|ورک ٹیبل/i, 'Commercial Stainless Steel Work Table'], [/sink|سنک/i, 'Stainless Steel Sink Unit'],
    [/food\s*warmer|فوڈ وارمر/i, 'Commercial Food Warmer'], [/griddle|hot\s*plate|گرڈل/i, 'Commercial Griddle / Hot Plate']
  ];
  for (const [pattern,name] of tests) if (pattern.test(text) && catalog.some(p=>p.name===name)) return name;
  if (/fryer|فرائر/i.test(text)) return 'Commercial fryer — basket type to confirm';
}
export function extractLead(messages, catalog) {
  const lead = {}; let quotationRequested = false;
  for (let i=0;i<messages.length;i++) {
    const message=messages[i]; if(message.role!=='user')continue;
    const text=message.content.replace(/[۰-۹٠-٩]/g,c=>String('۰۱۲۳۴۵۶۷۸۹'.includes(c)?'۰۱۲۳۴۵۶۷۸۹'.indexOf(c):'٠١٢٣٤٥٦٧٨٩'.indexOf(c))); const previous=messages[i-1]?.role==='assistant'?messages[i-1].content:'';
    quotationRequested ||= /quot(?:e|ation)|کوٹیشن/i.test(text);
    const explicitName=text.match(/(?:my name is|name\s*:|mera(?:\s+demo)?\s+naam(?:\s+hai)?|naam\s*[:=]|میرا نام|نام\s*[:：])\s*([^,;\n]+)/iu);
    let name=clean(explicitName?.[1]);
    if(!name && /(?:your name|aapka naam|apka naam|آپ کا نام)/i.test(previous) && !/[?؟]/.test(text))name=clean(text);
    if(usableName(name))lead.name=name;
    const phone=text.match(/(?:phone(?: number)?|mobile|فون نمبر|فون)\s*(?:is|hai|[:=])?\s*([+\d][\d\s()-]{3,20})/iu);
    const rawPhone=phone?.[1]||text.match(/(?:\+?92|0)3[\d\s()-]{8,16}\d/)?.[0];
    if(rawPhone)lead.phone=rawPhone.trim();
    else if(/(?:phone number|mobile number|aapka number|فون نمبر)/i.test(previous) && /^[+\d\s()-]{5,20}$/.test(text.trim()))lead.phone=text.trim();
    const city=text.match(/(?:city\s*(?:is|hai|[:=])?|sheh[ae]r\s*(?:hai|[:=])?|شہر\s*[:：]?)\s+([^,;\n]+)/iu);
    if(city){const value=clean(city[1]);if(value&&value.length<=80&&/^[\p{L} .'-]+$/u.test(value))lead.city=value;}
    else if(/(?:which city|what city|your city|kis sheh[ae]r|آپ کا شہر|کس شہر)/i.test(previous) && !/[?؟\d]/.test(text)){const value=clean(text);if(value&&value.length<=80&&/^[\p{L} .'-]+$/u.test(value))lead.city=value;}
    if(!city){const known=cities.find(([english,urdu])=>new RegExp(`\\b${english}\\b`,'i').test(text)||text.includes(urdu));if(known)lead.city=known[0];}
    const product=matchProduct(/basket|باسکٹ/i.test(text)&&/fryer|فرائر/i.test(lead.product||'')&&!/fryer|فرائر/i.test(text)?text+' fryer':text,catalog);if(product)lead.product=product;
    const quantity=text.match(/(?:quantity|qty|تعداد)\s*(?:is|hai|[:=])?\s*(\d{1,3})\b/i)||text.match(/\b(\d{1,3})\s*(?:units?|pieces?|fryers?|double\s*basket|single\s*basket|عدد)/i);
    if(quantity&&Number(quantity[1])>0)lead.quantity=quantity[1];
    else if(/(?:how many|kitn[ei]|quantity|کتنے|تعداد)/i.test(previous)&&/^\d{1,3}$/.test(text.trim())&&Number(text)>0)lead.quantity=text.trim();
    const numberWords={'one':'1','two':'2','three':'3','four':'4','ek':'1','do':'2','teen':'3','char':'4','ایک':'1','دو':'2','تین':'3','چار':'4'};
    if(/how many|kitn[ei]|quantity|کتنے|تعداد/i.test(previous)&&numberWords[text.trim().toLowerCase()])lead.quantity=numberWords[text.trim().toLowerCase()];
    const budget=text.match(/(?:budget|بجٹ)\s*(?:is|hai|[:=])?\s*((?:PKR|Rs\.?|روپے)?\s*[\d,]+(?:\s*(?:lakh|lac|k))?)/i);if(budget)lead.budget=budget[1].trim();
    const notes=text.match(/(?:requirements?|notes?)\s*:\s*([^\n]+)/i);if(notes)lead.notes=notes[1].trim();
  }
  // Enforce size and field types independently of the response generator.
  const validated=Object.fromEntries(fields.filter(k=>typeof lead[k]==='string'&&lead[k].length<=500&&lead[k].trim()).map(k=>[k,lead[k]]));
  const phoneValid=validated.phone?validPhone(validated.phone):false;
  const complete=!!(validated.name&&validated.city&&validated.product&&phoneValid);
  return {lead:Object.keys(validated).length?{...validated,phoneValid}:null,leadComplete:complete,quotationRequested,warnings:validated.phone&&!phoneValid?['Please check the phone number. Use a fictional Pakistani mobile number such as 03000000000.']:[]};
}
