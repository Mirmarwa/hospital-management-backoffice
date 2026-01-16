// Animation compteur KPI
function animateValue(el, start, end, duration = 800) {
  let startTime = null;

  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    el.innerText = Math.floor(progress * (end - start) + start);
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

// Activer animation après renderDashboard
function animateKPIs() {
  animateValue(statPatients, 0, patients.length);
  animateValue(statDoctors, 0, doctors.length);
  animateValue(statAppointments, 0, appointments.length);
  animateValue(statPrescriptions, 0, prescriptions.length);
  animateValue(statServices, 0, services.length);
}
// Animation douce des cartes
document.querySelectorAll(".card").forEach(card => {
  card.addEventListener("mouseenter", () => {
    card.style.transform = "translateY(-6px)";
  });
  card.addEventListener("mouseleave", () => {
    card.style.transform = "translateY(0)";
  });
});
