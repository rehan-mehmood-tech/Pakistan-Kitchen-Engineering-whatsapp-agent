export function freshSession(seed) {
  return {sessionId: crypto.randomUUID(), leads: seed(), messages: [], currentId: null};
}
export function removeLegacySession(storage) {
  try { storage.removeItem('pke-demo-v1'); } catch { /* Memory-only sessions also work with storage blocked. */ }
}
export function applyLead(state, details, complete, quotationRequested) {
  if (!details || !Object.keys(details).some(k => ['name','phone','city','product','quantity','budget','notes'].includes(k) && details[k])) return null;
  let lead = state.leads.find(item => item.id === state.currentId);
  if (!lead) {
    lead = {id: crypto.randomUUID(), sample: false, status: 'New Inquiry', activity: []};
    state.leads.unshift(lead);
    state.currentId = lead.id;
  }
  Object.assign(lead, details);
  if (!['Handed to Staff','Closed','Follow-up Due'].includes(lead.status)) {
    lead.status = complete ? (quotationRequested ? 'Quotation Requested' : 'Qualified') : 'New Inquiry';
  }
  lead.updated = Date.now();
  return lead;
}
