export function freshSession(seed) {
  return {sessionId: crypto.randomUUID(), leads: seed(), messages: [], currentId: null};
}
export function removeLegacySession(storage) {
  try { storage.removeItem('pke-demo-v1'); } catch { /* Memory-only sessions also work with storage blocked. */ }
}
export function qualificationStatus(lead,complete) {
  if(complete)return 'Ready for Human Follow-Up';
  if(lead?.name&&lead?.phoneValid)return 'Contact Details Collected';
  if(lead?.product)return 'Exploring Requirements';
  return 'New Inquiry';
}
export function applyLead(state,details,complete) {
  if(!details||!['name','phone','city','product','quantity','intendedUse','businessType','notes'].some(k=>details[k]))return null;
  let lead=state.leads.find(item=>item.id===state.currentId);
  if(!lead){lead={id:crypto.randomUUID(),sample:false,status:'New Inquiry',activity:[]};state.leads.unshift(lead);state.currentId=lead.id;}
  Object.assign(lead,details);
  if(!['Handed to Staff','Closed','Follow-up Due'].includes(lead.status))lead.status=qualificationStatus(lead,complete);
  lead.updated=Date.now();return lead;
}
