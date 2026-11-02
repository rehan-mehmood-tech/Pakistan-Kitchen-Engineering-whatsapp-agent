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
    captured:{en:'Your equipment requirements are noted in this temporary demo. A human representative handles the next steps; no real notification was sent.',roman:'Aapki equipment ki requirement demo mein note ho gayi hai. Agle steps human representative handle karega; koi asal notification nahi bheja gaya.',ur:'آپ کی ضروریات اس عارضی ڈیمو میں نوٹ ہو گئی ہیں۔ اگلے مراحل انسانی نمائندہ سنبھالے گا؛ کوئی حقیقی اطلاع نہیں بھیجی گئی۔'},
    handoff:{en:'This demo inquiry is marked for human follow-up. No real employee has been notified.',roman:'Demo mein yeh inquiry human follow-up ke liye mark ho gayi hai. Kisi asal employee ko notification nahi bheja gaya.',ur:'ڈیمو میں یہ درخواست انسانی نمائندے کے جائزے کے لیے نشان زد ہو گئی ہے۔ کسی حقیقی ملازم کو اطلاع نہیں بھیجی گئی۔'},
    followup:{en:`Hello ${name}, you asked about ${product}. Have your equipment requirements changed, or would you like any more help?\n\nSimulation only — no WhatsApp message was sent.`,roman:`Assalamualaikum ${name}, aapne ${product} ke bare mein poocha tha. Kya requirements mein koi tabdeeli hai ya mazeed madad chahiye?\n\nYeh sirf simulation hai — koi WhatsApp message nahi bheja gaya.`,ur:`السلام علیکم ${name}، آپ نے ${product} کے بارے میں پوچھا تھا۔ کیا ضروریات میں کوئی تبدیلی ہے یا مزید مدد چاہیے؟\n\nیہ صرف ڈیمو ہے — کوئی واٹس ایپ پیغام نہیں بھیجا گیا۔`}

  };
  return text[kind][language]||text[kind].en;
}
