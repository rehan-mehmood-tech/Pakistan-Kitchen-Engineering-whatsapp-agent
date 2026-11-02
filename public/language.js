// Shared by the server prompt and browser-generated demo messages.
export function conversationLanguage(messages) {
  for (const {role, content} of [...messages].reverse()) {
    if (role !== 'user' || typeof content !== 'string') continue;
    if (/[\u0600-\u06ff]/u.test(content)) return 'ur';
    if (/\b(yr|yaar|yar|mujh[eay]?|mujhay|chahiye|cha[h]?ye|chahie|kitna|kitne|kitni|kya|kia|btao|batao|bta|bata|krna|karna|krdo|kardo|aap|apko|aapko|mere|mera|meri|mjy|mje|hain|hai|ha|hn|hun|hoon|salam|assalamualaikum|walaikum|ji|jee|shukriya|nahi|nahin|nhi|ke|ki|ka|liye|leye|main|mein|mai|bhej|den|dein|deta|doon)\b/i.test(content)) return 'roman';
    if (/\b(i|we|you|need|want|please|could|would|what|how|which|tell|thanks|yes|no|hello|hi|my|is|are|the|for|quote|quotation|price|english)\b/i.test(content)) return 'en';
    // Names, quantities, phone numbers and product-only replies retain context.
  }
  return 'en';
}
export function demoMessage(kind,language,lead={}) {
  const {name='',product='kitchen equipment'}=lead;
  const text={
    captured:{en:'Your quotation inquiry is registered in this temporary demo dashboard. No real employee has been notified.',roman:'Shukriya! Aapki quotation inquiry is temporary demo dashboard mein register ho gayi hai. Kisi asal employee ko notification nahi bheja gaya.',ur:'شکریہ! آپ کی کوٹیشن کی درخواست اس عارضی ڈیمو ڈیش بورڈ میں درج ہو گئی ہے۔ کسی حقیقی ملازم کو اطلاع نہیں بھیجی گئی۔'},
    handoff:{en:'This inquiry is marked for sales staff review in the demo. Final prices and delivery need staff confirmation. No actual employee has been notified.',roman:'Demo mein yeh inquiry sales staff ke review ke liye mark ho gayi hai. Final price aur delivery staff confirm karega. Kisi asal employee ko notification nahi bheja gaya.',ur:'ڈیمو میں یہ درخواست سیلز ٹیم کے جائزے کے لیے نشان زد ہو گئی ہے۔ حتمی قیمت اور ڈیلیوری کی تصدیق ٹیم کرے گی۔ کسی حقیقی ملازم کو اطلاع نہیں بھیجی گئی۔'},
    followup:{en:`Hello ${name}, you asked about ${product}. Would you like any more help with your quotation or requirements?\n\nSimulation only — no WhatsApp message was sent.`,roman:`Assalamualaikum ${name}, aapne ${product} ke bare mein inquiry ki thi. Kya quotation ya requirements ke bare mein mazeed madad chahiye?\n\nYeh sirf simulation hai — koi WhatsApp message nahi bheja gaya.`,ur:`السلام علیکم ${name}، آپ نے ${product} کے بارے میں پوچھا تھا۔ کیا کوٹیشن یا اپنی ضروریات کے بارے میں مزید مدد چاہیے؟\n\nیہ صرف ڈیمو ہے — کوئی واٹس ایپ پیغام نہیں بھیجا گیا۔`}
  };
  return text[kind][language]||text[kind].en;
}
