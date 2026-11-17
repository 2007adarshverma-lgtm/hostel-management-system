const STORAGE_KEY = "hostelEaseResidents_v1";
const COMPLAINT_KEY = "hostelEaseComplaints_v1";
const ROOM_CAPACITY = 40;
const seedResidents = [
  {id:"r1",name:"Aarav Sharma",roll:"CSE-024",room:"A-204",sharing:"Double",fee:5500,status:"Paid",email:"aarav@example.com"},
  {id:"r2",name:"Meera Verma",roll:"ECE-018",room:"B-108",sharing:"Triple",fee:4500,status:"Pending",email:"meera@example.com"},
  {id:"r3",name:"Rohan Gupta",roll:"CSE-031",room:"A-207",sharing:"Double",fee:5500,status:"Paid",email:"rohan@example.com"},
  {id:"r4",name:"Ananya Singh",roll:"ME-012",room:"C-302",sharing:"Four",fee:4000,status:"Pending",email:"ananya@example.com"},
  {id:"r5",name:"Kabir Khan",roll:"IT-009",room:"B-110",sharing:"Triple",fee:4500,status:"Paid",email:"kabir@example.com"}
];
const seedComplaints = [
  {id:"c1",name:"Meera Verma",room:"B-108",category:"Plumbing",description:"Washroom tap is leaking",status:"Open"},
  {id:"c2",name:"Rohan Gupta",room:"A-207",category:"Internet",description:"Wi-Fi connection is unstable",status:"Open"},
  {id:"c3",name:"Aarav Sharma",room:"A-204",category:"Electrical",description:"Study lamp repaired",status:"Resolved"}
];
let residents = load(STORAGE_KEY, seedResidents);
let complaints = load(COMPLAINT_KEY, seedComplaints);
const $ = id => document.getElementById(id);
function load(key, fallback){try{const value=localStorage.getItem(key);return value?JSON.parse(value):fallback.map(x=>({...x}));}catch{return fallback.map(x=>({...x}));}}
function save(){localStorage.setItem(STORAGE_KEY,JSON.stringify(residents));localStorage.setItem(COMPLAINT_KEY,JSON.stringify(complaints));}
function money(value){return "₹"+Number(value||0).toLocaleString("en-IN");}
function initials(name){return name.trim().split(/\s+/).slice(0,2).map(x=>x[0]).join("").toUpperCase();}
function toast(message){const el=$("toast");el.textContent=message;el.classList.add("show");clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove("show"),2400);}
function render(){
  const total=residents.length, occupied=new Set(residents.map(r=>r.room.toLowerCase())).size;
  const pending=residents.filter(r=>r.status==="Pending"), paid=residents.filter(r=>r.status==="Paid");
  const pendingAmount=pending.reduce((s,r)=>s+Number(r.fee),0), collected=paid.reduce((s,r)=>s+Number(r.fee),0);
  $("totalResidents").textContent=total;$("occupiedRooms").innerHTML=`${occupied} <em>/ ${ROOM_CAPACITY}</em>`;
  $("occupancyText").textContent=`${Math.round(occupied/ROOM_CAPACITY*100)}% occupancy rate`;
  $("pendingFees").textContent=money(pendingAmount);$("openComplaints").textContent=complaints.filter(c=>c.status==="Open").length;
  $("roomOccupancyPercent").textContent=`${Math.round(occupied/ROOM_CAPACITY*100)}%`;
  $("occupancyBar").style.width=`${Math.min(100,occupied/ROOM_CAPACITY*100)}%`;
  $("doubleCount").textContent=residents.filter(r=>r.sharing==="Double").length;
  $("tripleCount").textContent=residents.filter(r=>r.sharing==="Triple").length;
  $("fourCount").textContent=residents.filter(r=>r.sharing==="Four").length;
  $("collectedFees").textContent=money(collected);$("pendingAmount").textContent=money(pendingAmount);
  $("paidCount").textContent=paid.length;$("pendingCount").textContent=pending.length;
  renderResidents();renderComplaints();
}
function renderResidents(){
  const query=$("search").value.trim().toLowerCase(), filter=$("filterFee").value;
  const list=residents.filter(r=>(filter==="all"||r.status===filter)&&[r.name,r.roll,r.room,r.sharing].some(v=>String(v).toLowerCase().includes(query)));
  $("residentRows").innerHTML=list.map(r=>`<tr>
    <td><div class="resident-cell"><span class="resident-avatar">${initials(r.name)}</span><span>${escapeHTML(r.name)}<small>${escapeHTML(r.email||"No email added")}</small></span></div></td>
    <td>${escapeHTML(r.roll)}</td><td>${escapeHTML(r.room)}</td><td>${escapeHTML(r.sharing)} sharing</td>
    <td><b>${money(r.fee)}</b></td><td><span class="fee-status ${r.status}">${r.status}</span></td>
    <td><div class="actions"><button class="action-btn" data-edit="${r.id}">Edit</button><button class="action-btn delete" data-delete="${r.id}">Delete</button></div></td></tr>`).join("");
  $("emptyState").hidden=list.length!==0;$("showingCount").textContent=`Showing ${list.length} of ${residents.length} residents`;
}
function renderComplaints(){
  $("complaintList").innerHTML=complaints.slice().reverse().slice(0,5).map(c=>`<div class="complaint"><span class="issue-icon">☷</span><div class="complaint-info"><b>${escapeHTML(c.category)} · ${escapeHTML(c.room)}</b><small>${escapeHTML(c.name)} — ${escapeHTML(c.description)}</small></div><button class="issue-status ${c.status}" data-toggle-complaint="${c.id}" title="Click to change status">${c.status}</button></div>`).join("")||'<p class="muted">No complaints have been logged yet.</p>';
}
function escapeHTML(value){return String(value).replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));}
function openResident(resident){
  $("residentForm").reset();$("residentError").textContent="";$("residentId").value=resident?.id||"";
  $("residentModalTitle").textContent=resident?"Edit resident":"Add resident";
  $("residentName").value=resident?.name||"";$("residentRoll").value=resident?.roll||"";
  $("residentRoom").value=resident?.room||"";$("residentSharing").value=resident?.sharing||"Double";
  $("residentFee").value=resident?.fee??5000;$("residentStatus").value=resident?.status||"Paid";$("residentEmail").value=resident?.email||"";
  $("residentBackdrop").hidden=false;$("residentName").focus();
}
function closeModal(id){$(id).hidden=true;}
function exportCSV(){
  const rows=[["Name","Roll Number","Room","Sharing","Monthly Fee","Fee Status","Email"],...residents.map(r=>[r.name,r.roll,r.room,r.sharing,r.fee,r.status,r.email||""])];
  const csv=rows.map(row=>row.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(",")).join("\r\n");
  const blob=new Blob(["\uFEFF"+csv],{type:"text/csv;charset=utf-8;"}),url=URL.createObjectURL(blob),a=document.createElement("a");
  a.href=url;a.download="hostel-residents.csv";a.click();URL.revokeObjectURL(url);toast("Resident CSV exported");
}
["addResident","addResidentTop","quickResident","emptyAdd"].forEach(id=>$(id).addEventListener("click",()=>openResident()));
$("residentForm").addEventListener("submit",e=>{
  e.preventDefault();const id=$("residentId").value,roll=$("residentRoll").value.trim(),room=$("residentRoom").value.trim();
  const duplicate=residents.find(r=>r.roll.toLowerCase()===roll.toLowerCase()&&r.id!==id);
  if(duplicate){$("residentError").textContent="That roll number / ID is already registered.";return;}
  const roomConflict=residents.find(r=>r.room.toLowerCase()===room.toLowerCase()&&r.id!==id);
  if(roomConflict){$("residentError").textContent="That room number is already assigned. Use a different room number.";return;}
  const record={id:id||`r${Date.now()}`,name:$("residentName").value.trim(),roll,room,sharing:$("residentSharing").value,fee:Number($("residentFee").value),status:$("residentStatus").value,email:$("residentEmail").value.trim()};
  if(!record.name||!roll||!room||record.fee<0){$("residentError").textContent="Please complete all required fields with valid values.";return;}
  if(id)residents=residents.map(r=>r.id===id?record:r);else residents.push(record);
  save();render();closeModal("residentBackdrop");toast(id?"Resident updated":"Resident added successfully");
});
$("residentRows").addEventListener("click",e=>{
  const edit=e.target.closest("[data-edit]"),del=e.target.closest("[data-delete]");
  if(edit){const r=residents.find(x=>x.id===edit.dataset.edit);if(r)openResident(r);}
  if(del){const r=residents.find(x=>x.id===del.dataset.delete);if(r&&confirm(`Delete ${r.name}'s record?`)){residents=residents.filter(x=>x.id!==r.id);save();render();toast("Resident record deleted");}}
});
$("search").addEventListener("input",renderResidents);$("filterFee").addEventListener("change",renderResidents);
$("exportCsv").addEventListener("click",exportCSV);$("quickExport").addEventListener("click",exportCSV);
$("addComplaint").addEventListener("click",()=>{$("complaintForm").reset();$("complaintError").textContent="";$("complaintBackdrop").hidden=false;});
$("quickComplaint").addEventListener("click",()=>$("addComplaint").click());
$("complaintForm").addEventListener("submit",e=>{
  e.preventDefault();const complaint={id:`c${Date.now()}`,name:$("complaintResident").value.trim(),room:$("complaintRoom").value.trim(),category:$("complaintCategory").value,description:$("complaintDescription").value.trim(),status:"Open"};
  if(!complaint.name||!complaint.room||!complaint.description){$("complaintError").textContent="Please complete all fields.";return;}
  complaints.push(complaint);save();render();closeModal("complaintBackdrop");toast("Complaint logged successfully");
});
$("complaintList").addEventListener("click",e=>{const btn=e.target.closest("[data-toggle-complaint]");if(!btn)return;const c=complaints.find(x=>x.id===btn.dataset.toggleComplaint);if(c){c.status=c.status==="Open"?"Resolved":"Open";save();render();toast(`Complaint marked ${c.status.toLowerCase()}`);}});
$("tipExport")?.addEventListener("click",exportCSV);
document.querySelectorAll("[data-close]").forEach(btn=>btn.addEventListener("click",()=>closeModal(btn.dataset.close)));
document.querySelectorAll(".backdrop").forEach(backdrop=>backdrop.addEventListener("click",e=>{if(e.target===backdrop)closeModal(backdrop.id);}));
document.addEventListener("keydown",e=>{if(e.key==="Escape")document.querySelectorAll(".backdrop").forEach(b=>b.hidden=true);});
$("menuToggle").addEventListener("click",()=>$("sidebar").classList.toggle("open"));
document.querySelectorAll(".nav-link").forEach(link=>link.addEventListener("click",()=>$("sidebar").classList.remove("open")));
render();
