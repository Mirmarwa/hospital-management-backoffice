fetch("data/fakeData.json").then(r=>r.json()).then(d=>{
 patients=d.patients;
 doctors=d.doctors;
 appointments=d.appointments;
 prescriptions=d.prescriptions;
 services=d.services;
 renderAll();
});


/* LOAD DATA */
fetch("data/fakeData.json")
.then(r=>r.json())
.then(d=>{
 patients=d.patients;
 doctors=d.doctors;
 appointments=d.appointments;
 renderAll();
});

/* AUTH */
function login(){
 if(username.value==="admin" && password.value==="admin"){
  loginPage.classList.add("d-none");
  appPage.classList.remove("d-none");
 }
 else loginError.innerText="Login incorrect";
}
function logout(){location.reload();}

/* NAV */
function show(id){
 ["dashboard","patients","doctors","appointments"].forEach(p=>{
  document.getElementById(p).classList.add("d-none");
 });
 document.getElementById(id).classList.remove("d-none");
}

/* PATIENTS */
function savePatient(e){
 e.preventDefault();
 patients.push({
  id:Date.now(),
  name:pName.value,
  age:Math.floor(Math.random()*60)+20,
  service:pService.value
 });
 renderAll();
 e.target.reset();
}
function renderPatients(){
 patientsTable.innerHTML=patients.map(p=>
  `<tr><td>${p.name}</td><td>${p.age}</td><td>${p.service}</td></tr>`
 ).join("");
 aPatient.innerHTML=patients.map(p=>`<option value="${p.id}">${p.name}</option>`).join("");
}

/* DOCTORS */
function saveDoctor(e){
 e.preventDefault();
 doctors.push({id:Date.now(),name:dName.value,specialty:dSpec.value});
 renderAll(); e.target.reset();
}
function renderDoctors(){
 doctorsTable.innerHTML=doctors.map(d=>
  `<tr><td>${d.name}</td><td>${d.specialty}</td></tr>`
 ).join("");
 aDoctor.innerHTML=doctors.map(d=>`<option value="${d.id}">${d.name}</option>`).join("");
}

/* APPOINTMENTS */
function saveAppointment(e){
 e.preventDefault();
 appointments.push({
  patientId:aPatient.value,
  doctorId:aDoctor.value,
  date:aDate.value
 });
 renderAll(); e.target.reset();
}
function renderAppointments(){
 appointmentsTable.innerHTML=appointments.map(a=>
  `<tr><td>${a.date}</td></tr>`
 ).join("");
}

/* DASHBOARD */
function renderDashboard(){
 statPatients.innerText=patients.length;
 statDoctors.innerText=doctors.length;
 statAppointments.innerText=appointments.length;

 new Chart(patientsByService,{
  type:"bar",
  data:{labels:[...new Set(patients.map(p=>p.service))],
   datasets:[{data:Object.values(patients.reduce((a,p)=>(a[p.service]=(a[p.service]||0)+1,a),{}))}]
  }
 });

 new Chart(doctorsBySpecialty,{
  type:"pie",
  data:{labels:[...new Set(doctors.map(d=>d.specialty))],
   datasets:[{data:Object.values(doctors.reduce((a,d)=>(a[d.specialty]=(a[d.specialty]||0)+1,a),{}))}]
  }
 });

 new Chart(appointmentsByDay,{
  type:"line",
  data:{labels:appointments.map(a=>a.date),
   datasets:[{data:appointments.map((_,i)=>i+1)}]}
 });

 new Chart(appointmentsByDoctor,{
  type:"doughnut",
  data:{labels:doctors.map(d=>d.name),
   datasets:[{data:doctors.map(d=>appointments.filter(a=>a.doctorId==d.id).length)}]}
 });

 new Chart(ageDistribution,{
  type:"bar",
  data:{labels:patients.map(p=>p.name),
   datasets:[{data:patients.map(p=>p.age)}]}
 });
}
/* EXPORT CSV */
function exportPatientsCSV(){
 let csv="Nom,Age,Service\n";
 patients.forEach(p=>{
  csv+=`${p.name},${p.age},${p.service}\n`;
 });

 let blob=new Blob([csv],{type:"text/csv"});
 let a=document.createElement("a");
 a.href=URL.createObjectURL(blob);
 a.download="patients.csv";
 a.click();
}

/* EXPORT PDF */
function exportAppointmentsPDF(){
 const { jsPDF } = window.jspdf;
 const pdf=new jsPDF();
 pdf.text("Liste des Rendez-vous",10,10);

 appointments.forEach((a,i)=>{
  pdf.text(`${i+1}. Date: ${a.date}`,10,20+i*10);
 });

 pdf.save("rendezvous.pdf");
}


/* PRESCRIPTIONS */
function savePrescription(e){
 e.preventDefault();
 prescriptions.push({
  id:Date.now(),
  patientId:prPatient.value,
  doctorId:prDoctor.value,
  medications:prMeds.value,
  date:prDate.value
 });
 renderPrescriptions();
 e.target.reset();
}
function renderPrescriptions(){
 prescriptionsTable.innerHTML=prescriptions.map(p=>
  `<tr><td>${p.medications}</td><td>${p.date}</td></tr>`
 ).join("");
 prPatient.innerHTML=patients.map(p=>`<option value="${p.id}">${p.name}</option>`).join("");
 prDoctor.innerHTML=doctors.map(d=>`<option value="${d.id}">${d.name}</option>`).join("");
}

/* SERVICES */
function saveService(e){
 e.preventDefault();
 services.push({id:Date.now(),name:sName.value,beds:sBeds.value});
 renderServices();
 e.target.reset();
}
function renderServices(){
 servicesTable.innerHTML=services.map(s=>
  `<tr><td>${s.name}</td><td>${s.beds}</td></tr>`
 ).join("");
}

/* UPDATE GLOBAL */
function renderAll(){
 renderPatients();
 renderDoctors();
 renderAppointments();
 renderPrescriptions();
 renderServices();
 renderDashboard();
}
