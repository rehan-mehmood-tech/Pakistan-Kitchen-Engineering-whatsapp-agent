import {questionField} from './leads.mjs';
// Defense in depth: financial output must not reach the customer, even after a prompt override.
export function financialReply(text) {
 if(/^\s*\d{4,}(?:[,.]\d+)*\s*$/.test(text)||/\b\d{1,3}(?:,\d{3})+(?:\.\d{2})?\b/.test(text))return true;
 if(/\b(?:PKR|USD|GBP|EUR|rupees|Rs\.?|budget|discounts?|payment\s*terms|cheaper|cheapest|expensive|affordable|sasta|sasti|saste|mehnga|mehngi|economical|afford)\b|[₨$€£]|بجٹ|روپے|رعایت|ادائیگی|سستا|مہنگا|خرچ/i.test(text))return true;
 if(/\b(?:hazaar|hazar|lakh|lac|crore|paise|paisa)\b|\b\d[\d,.]*\s*k\b|how much.{0,25}(?:spend|pay)|kitna.{0,20}kharch/i.test(text))return true;
 if(/\b(?:\d[\d,.]*|one|two|three|four|five|six|seven|eight|nine|ten|fifty|eighty)\s*(?:thousand|hundred|lakh|lac|crore|hazaar|hazar)|ہزار|لاکھ|کروڑ/i.test(text))return true;
 // A bare price/cost amount is also forbidden; numeric equipment quantities alone are fine.
 return text.split(/[.!؟۔\n]/u).some(sentence=>/(?:\bprice\b|\bcost\b|قیمت|قیمتیں)/i.test(sentence)&&/\d/.test(sentence));
}

export function redundantQuestion(text,lead){
 if(!/[?؟]|\b(?:share|provide|tell me|bata|batayein)\b|بتا دیں|بتائیں/i.test(text))return null;
 const field=questionField(text);if(!field)return null;
 if(field==='address')return field;
 if(lead?.skippedFields?.includes(field))return field;
 if(field==='intendedUse'&&lead?.intendedUse===lead?.businessType&&/serve|menu|kya.*(?:ban|pak)|کیا.*(?:بن|پک|سرو)/i.test(text))return null;
 if(field==='phone')return lead?.phoneValid?field:null;
 return lead?.[field]?field:null;
}
// Keep only complete AI-generated sentences that pass policy. Never synthesize a fallback reply.
export function safeReplySentences(text){
 const parts=text.match(/[^.!؟۔\n]+(?:[.!؟۔]|$)/gu)||[];
 const safe=parts.map(s=>s.trim()).filter(s=>s&&!financialReply(s)).join(' ').trim();
 return safe.length>=25&&safe.split(/\s+/).length>=5&&!financialReply(safe)?safe:null;
}
