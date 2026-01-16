/***********************
 * GLOBALS
 ***********************/
let charts = {};
let patients = [];
let doctors = [];
let appointments = [];
let prescriptions = [];
let services = [];

/***********************
 * STORAGE
 ***********************/
function saveToStorage(){
  localStorage.setItem("patients", JSON.stringify(patients));
  localStorage.setItem("doctors", JSON.stringify(doctors));
  localStorage.setItem("appointments", JSON.stringify(appointments));
  localStorage.setItem("prescriptions", JSON.stringify(prescriptions));
  localStorage.setItem("services", JSON.stringify(services));
}

function loadFromStorage(){
  patients = JSON.parse(localStorage.getItem("patients")) || [];
  doctors = JSON.parse(localStorage.getItem("doctors")) || [];
  appointments = JSON.parse(localStorage.getItem("appointments")) || [];
  prescriptions = JSON.parse(localStorage.getItem("prescriptions")) || [];
  services = JSON.parse(localStorage.getItem("services")) || [];
}

/***********************
 * INIT DATA
 ***********************/
loadFromStorage();

if (patients.length === 0) {
  fetch("data/fakeData.json")
    .then(res => res.json())
    .then(data => {
      patients = data.patients || [];
      doctors = data.doctors || [];
      appointments = data.appointments || [];
      prescriptions = data.prescriptions || [];
      services = data.services || [];
      saveToStorage();
      renderAll();
    });
} else {
  renderAll();
}

/***********************
 * AUTH
 ***********************/
if(localStorage.getItem("loggedIn")==="true"){
  loginPage.classList.add("d-none");
  appPage.classList.remove("d-none");
}

function login(){
  if(username.value==="admin" && password.value==="admin"){
    localStorage.setItem("loggedIn","true");
    loginPage.classList.add("d-none");
    appPage.classList.remove("d-none");
  } else {
    loginError.innerText="Login incorrect";
  }
}

function logout(){
  localStorage.removeItem("loggedIn");
  location.reload();
}

/***********************
 * NAV
 ***********************/
function show(id) {
  const sections = [
    "dashboard",
    "patients",
    "doctors",
    "appointments",
    "prescriptions",
    "services"
  ];

  sections.forEach(section => {
    document.getElementById(section).classList.add("d-none");
  });

  document.getElementById(id).classList.remove("d-none");

  // Sidebar active state
  document.querySelectorAll(".sidebar button")
    .forEach(btn => btn.classList.remove("active"));

  document.getElementById("btn-" + id)?.classList.add("active");

  // Fix Chart.js resize
  if (id === "dashboard") {
    setTimeout(() => {
      Object.values(charts).forEach(chart => {
        if (chart) chart.resize();
      });
    }, 100);
  }
}



/***********************
 * PATIENTS CRUD
 ***********************/
function savePatient(e){
  e.preventDefault();
  const id = patientId.value;

  const patient = {
    id: id ? Number(id) : Date.now(),
    name: pName.value,
    age: Number(pAge.value),
    service: pService.value
  };

  if(id){
    patients = patients.map(p => p.id === Number(id) ? patient : p);
  } else {
    patients.push(patient);
  }

  saveToStorage();
  renderAll();
  e.target.reset();
  patientId.value="";
}

function editPatient(id){
  const p = patients.find(p=>p.id===id);
  patientId.value=p.id;
  pName.value=p.name;
  pAge.value=p.age;
  pService.value=p.service;
}

function deletePatient(id){
  if(confirm("Supprimer ce patient ?")){
    patients = patients.filter(p=>p.id!==id);
    saveToStorage();
    renderAll();
  }
}

function renderPatients(){
  patientsTable.innerHTML = patients.map(p=>`
    <tr>
      <td>${p.name}</td>
      <td>${p.age}</td>
      <td>${p.service}</td>
      <td>
        <button class="btn btn-warning btn-sm" onclick="editPatient(${p.id})">Edit</button>
        <button class="btn btn-danger btn-sm" onclick="deletePatient(${p.id})">Delete</button>
      </td>
    </tr>
  `).join("");
}

/***********************
 * DOCTORS CRUD
 ***********************/
function saveDoctor(e){
  e.preventDefault();
  const id = doctorId.value;

  const doctor = {
    id: id ? Number(id) : Date.now(),
    name: dName.value,
    specialty: dSpec.value
  };

  if(id){
    doctors = doctors.map(d=>d.id===Number(id)?doctor:d);
  } else {
    doctors.push(doctor);
  }

  saveToStorage();
  renderAll();
  e.target.reset();
  doctorId.value="";
}

function editDoctor(id){
  const d = doctors.find(d=>d.id===id);
  doctorId.value=d.id;
  dName.value=d.name;
  dSpec.value=d.specialty;
}

function deleteDoctor(id){
  if(confirm("Supprimer ce médecin ?")){
    doctors = doctors.filter(d=>d.id!==id);
    saveToStorage();
    renderAll();
  }
}

function renderDoctors(){
  doctorsTable.innerHTML = doctors.map(d=>`
    <tr>
      <td>${d.name}</td>
      <td>${d.specialty}</td>
      <td>
        <button class="btn btn-warning btn-sm" onclick="editDoctor(${d.id})">Edit</button>
        <button class="btn btn-danger btn-sm" onclick="deleteDoctor(${d.id})">Delete</button>
      </td>
    </tr>
  `).join("");

  aDoctor.innerHTML = doctors.map(d=>`<option value="${d.id}">${d.name}</option>`).join("");
}

/***********************
 * APPOINTMENTS CRUD
 ***********************/
function saveAppointment(e){
  e.preventDefault();
  const id = appointmentId.value;

  const appointment = {
    id: id ? Number(id) : Date.now(),
    patientId: aPatient.value,
    doctorId: aDoctor.value,
    date: aDate.value
  };

  if(id){
    appointments = appointments.map(a => a.id === Number(id) ? appointment : a);
  } else {
    appointments.push(appointment);
  }

  saveToStorage();
  renderAll();
  e.target.reset();
  appointmentId.value="";
}

function editAppointment(id){
  const a = appointments.find(a=>a.id===id);
  appointmentId.value=a.id;
  aPatient.value=a.patientId;
  aDoctor.value=a.doctorId;
  aDate.value=a.date;
}

function deleteAppointment(id){
  if(confirm("Supprimer ce rendez-vous ?")){
    appointments = appointments.filter(a=>a.id!==id);
    saveToStorage();
    renderAll();
  }
}

function renderAppointments(){
  appointmentsTable.innerHTML = appointments.map(a=>`
    <tr>
      <td>${a.date}</td>
      <td>
        <button class="btn btn-warning btn-sm" onclick="editAppointment(${a.id})">Edit</button>
        <button class="btn btn-danger btn-sm" onclick="deleteAppointment(${a.id})">Delete</button>
      </td>
    </tr>
  `).join("");

  aPatient.innerHTML = patients.map(p=>`<option value="${p.id}">${p.name}</option>`).join("");
  aDoctor.innerHTML = doctors.map(d=>`<option value="${d.id}">${d.name}</option>`).join("");
}

/***********************
 * PRESCRIPTIONS CRUD
 ***********************/
function savePrescription(e){
  e.preventDefault();
  const id = prescriptionId.value;

  const prescription = {
    id: id ? Number(id) : Date.now(),
    patientId: prPatient.value,
    doctorId: prDoctor.value,
    medications: prMeds.value,
    date: prDate.value
  };

  if(id){
    prescriptions = prescriptions.map(p=>p.id===Number(id)?prescription:p);
  } else {
    prescriptions.push(prescription);
  }

  saveToStorage();
  renderAll();
  e.target.reset();
  prescriptionId.value="";
}

function editPrescription(id){
  const p = prescriptions.find(p=>p.id===id);
  prescriptionId.value=p.id;
  prPatient.value=p.patientId;
  prDoctor.value=p.doctorId;
  prMeds.value=p.medications;
  prDate.value=p.date;
}

function deletePrescription(id){
  if(confirm("Supprimer cette prescription ?")){
    prescriptions = prescriptions.filter(p=>p.id!==id);
    saveToStorage();
    renderAll();
  }
}

function renderPrescriptions(){
  prescriptionsTable.innerHTML = prescriptions.map(p=>`
    <tr>
      <td>${p.medications}</td>
      <td>${p.date}</td>
      <td>
        <button class="btn btn-warning btn-sm" onclick="editPrescription(${p.id})">Edit</button>
        <button class="btn btn-danger btn-sm" onclick="deletePrescription(${p.id})">Delete</button>
      </td>
    </tr>
  `).join("");

  prPatient.innerHTML = patients.map(p=>`<option value="${p.id}">${p.name}</option>`).join("");
  prDoctor.innerHTML = doctors.map(d=>`<option value="${d.id}">${d.name}</option>`).join("");
}

/***********************
 * SERVICES CRUD
 ***********************/
function saveService(e){
  e.preventDefault();
  const id = serviceId.value;

  const service = {
    id: id ? Number(id) : Date.now(),
    name: sName.value,
    beds: Number(sBeds.value)
  };

  if(id){
    services = services.map(s=>s.id===Number(id)?service:s);
  } else {
    services.push(service);
  }

  saveToStorage();
  renderAll();
  e.target.reset();
  serviceId.value="";
}

function editService(id){
  const s = services.find(s=>s.id===id);
  serviceId.value=s.id;
  sName.value=s.name;
  sBeds.value=s.beds;
}

function deleteService(id){
  if(confirm("Supprimer ce service ?")){
    services = services.filter(s=>s.id!==id);
    saveToStorage();
    renderAll();
  }
}

function renderServices(){
  servicesTable.innerHTML = services.map(s=>`
    <tr>
      <td>${s.name}</td>
      <td>${s.beds}</td>
      <td>
        <button class="btn btn-warning btn-sm" onclick="editService(${s.id})">Edit</button>
        <button class="btn btn-danger btn-sm" onclick="deleteService(${s.id})">Delete</button>
      </td>
    </tr>
  `).join("");
}

/***********************
 * DASHBOARD (5 CHARTS)
 ***********************/
function renderDashboard(){

  // ===== KPI =====
  statPatients.innerText = patients.length;
  statDoctors.innerText = doctors.length;
  statAppointments.innerText = appointments.length;
  statPrescriptions.innerText = prescriptions.length;
  statServices.innerText = services.length;

  /* ================= BAR : Patients par service ================= */
  const serviceData = patients.reduce((acc, p) => {
    const service = p.service && p.service.trim() !== "" ? p.service : "Autre";
    acc[service] = (acc[service] || 0) + 1;
    return acc;
  }, {});

  charts.patientsByService?.destroy();
  charts.patientsByService = new Chart(patientsByService, {
    type: "bar",
    data: {
      labels: Object.keys(serviceData),
      datasets: [{
        label: "Patients",
        data: Object.values(serviceData),
        backgroundColor: "#2563eb"
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });

  /* ================= PIE : Médecins par spécialité ================= */
  const specData = doctors.reduce((acc, d) => {
    const spec = d.specialty && d.specialty.trim() !== "" ? d.specialty : "Autre";
    acc[spec] = (acc[spec] || 0) + 1;
    return acc;
  }, {});

  charts.doctorsBySpecialty?.destroy();
  charts.doctorsBySpecialty = new Chart(doctorsBySpecialty, {
    type: "pie",
    data: {
      labels: Object.keys(specData),
      datasets: [{
        data: Object.values(specData)
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });

  /* ================= LINE : Rendez-vous par date ================= */
  charts.appointmentsByDay?.destroy();
  charts.appointmentsByDay = new Chart(appointmentsByDay, {
    type: "line",
    data: {
      labels: appointments.map(a => a.date),
      datasets: [{
        label: "Rendez-vous",
        data: appointments.map((_, i) => i + 1),
        borderColor: "#16a34a",
        tension: 0.3,
        fill: false
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });

  /* ================= DOUGHNUT : Rendez-vous par médecin ================= */
  charts.appointmentsByDoctor?.destroy();
  charts.appointmentsByDoctor = new Chart(appointmentsByDoctor, {
    type: "doughnut",
    data: {
      labels: doctors.map(d => d.name),
      datasets: [{
        data: doctors.map(d =>
          appointments.filter(a => Number(a.doctorId) === d.id).length
        )
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });

  /* ================= SCATTER : Répartition des âges ================= */
  charts.ageDistribution?.destroy();
  charts.ageDistribution = new Chart(ageDistribution, {
    type: "scatter",
    data: {
      datasets: [{
        label: "Âge des patients",
        data: patients.map((p, i) => ({ x: i + 1, y: p.age })),
        backgroundColor: "#ef4444"
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { title: { display: true, text: "Patient" } },
        y: { title: { display: true, text: "Âge" } }
      }
    }
  });
}


/***********************
 * GLOBAL RENDER
 ***********************/
function renderAll(){
  renderPatients();
  renderDoctors();
  renderAppointments();
  renderPrescriptions();
  renderServices();
  renderDashboard();
}
