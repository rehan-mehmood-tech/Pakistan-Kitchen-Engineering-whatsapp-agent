export const USER_LIMIT=2000;
export const ASSISTANT_LIMIT=8000;
export class RequestError extends Error { constructor(code,message){super(message);this.code=code;this.status=400;} }
export function prepareHistory(messages) {
  if(!Array.isArray(messages)||!messages.length||messages.length>100)throw new RequestError('HISTORY_LIMIT','This conversation is too long. Please reset the demo to start a fresh inquiry. Your current messages remain visible.');
  for(const m of messages)if(!m||!['user','assistant'].includes(m.role)||typeof m.content!=='string'||!m.content.trim()||m.content.length>(m.role==='user'?USER_LIMIT:ASSISTANT_LIMIT))throw new RequestError('INVALID_MESSAGE','Please use messages under 2,000 characters. Assistant history must be under 8,000 characters.');
  if(messages.at(-1).role!=='user')throw new RequestError('INVALID_MESSAGE','Please send a customer message before requesting a reply.');
  let size=messages.filter(m=>m.role==='user').reduce((n,m)=>n+m.content.length,0);
  if(size>16000)throw new RequestError('HISTORY_LIMIT','Your customer requirements exceed this demo’s conversation limit. Please copy any details you need and reset the demo. No customer messages were silently removed.');
  const selected=new Set(messages.map((m,i)=>m.role==='user'?i:-1));let assistants=0;
  for(let i=messages.length-1;i>=0;i--){const m=messages[i];if(m.role==='assistant'&&assistants<6&&size+m.content.length<=24000){selected.add(i);size+=m.content.length;assistants++;}}
  const recent=messages.filter((_,i)=>selected.has(i)).map(({role,content})=>({role,content}));
  const omitted=messages.length-recent.length;
  return {messages:recent,contextNotice:omitted?'Older assistant replies were omitted from the AI context. All customer messages and requirements are retained.':''};
}
