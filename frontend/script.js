/* ===================== NAVBAR TOGGLE ===================== */
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");
if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });
}

/* ===================== TESTIMONIAL SLIDER ===================== */
const testimonials = document.querySelectorAll(".testimonial-slider blockquote");
const prevBtn = document.querySelector(".testimonial-slider .prev");
const nextBtn = document.querySelector(".testimonial-slider .next");
const dotsContainer = document.querySelector(".testimonial-slider .dots");

let index = 0;

if (dotsContainer && testimonials.length > 0) {
  testimonials.forEach((_, i) => {
    const dot = document.createElement("span");
    dot.classList.add("dot");
    if (i === 0) dot.classList.add("active");
    dot.addEventListener("click", () => {
      index = i;
      showTestimonial(index);
      resetInterval();
    });
    dotsContainer.appendChild(dot);
  });
}

function showTestimonial(i) {
  testimonials.forEach((t, idx) => t.classList.toggle("active", idx === i));
  document.querySelectorAll(".dot").forEach((d, idx) => d.classList.toggle("active", idx === i));
}

function nextTestimonial() { index = (index + 1) % testimonials.length; showTestimonial(index); }
function prevTestimonial() { index = (index - 1 + testimonials.length) % testimonials.length; showTestimonial(index); }

if (nextBtn) nextBtn.addEventListener("click", () => { nextTestimonial(); resetInterval(); });
if (prevBtn) prevBtn.addEventListener("click", () => { prevTestimonial(); resetInterval(); });

let interval = setInterval(nextTestimonial, 5000);
function resetInterval() { clearInterval(interval); interval = setInterval(nextTestimonial, 5000); }

/* ===================== API BASE URL ===================== */
// Use relative path for Render deployment
const API_BASE = ""; // empty string means same origin (Render URL)

// ===================== APPOINTMENT FORM =====================
const appointmentForm = document.getElementById("appointmentForm");
if (appointmentForm) {
  appointmentForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = {
      name: document.getElementById("appointmentName").value.trim(),
      email: document.getElementById("appointmentEmail").value.trim(),
      phone: document.getElementById("appointmentPhone").value.trim(),
      message: document.getElementById("appointmentMessage").value.trim()
    };

    try {
      const res = await fetch(`${API_BASE}/appointment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      alert(result.message);
      if(result.success) appointmentForm.reset();
    } catch (err) {
      console.error(err);
      alert("⚠ Error submitting appointment.");
    }
  });
}

/* ===================== TREATMENT BOOKING FORM ===================== */
const treatmentForm = document.getElementById("treatmentForm");
if (treatmentForm) {
  treatmentForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const treatment = document.getElementById("treatmentName").value.trim();
    const name = document.getElementById("treatmentCustomerName").value.trim();
    const email = document.getElementById("treatmentEmail").value.trim();
    const phone = document.getElementById("treatmentPhone").value.trim();

    if (!treatment || !name || !email || !phone) {
      alert("⚠ All fields are required!");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/book`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ treatment, name, email, phone })
      });
      const data = await res.json();
      alert(data.message);
      if (data.success) treatmentForm.reset();
    } catch (err) {
      console.error(err);
      alert("⚠ Something went wrong. Try again.");
    }
  });
}

/* ===================== CONTACT FORM ===================== */
const contactForm = document.getElementById("contactForm");
if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const name = document.getElementById("contactName").value.trim();
    const email = document.getElementById("contactEmail").value.trim();
    const phone = document.getElementById("contactPhone").value.trim();
    if (!name || !email || !phone) return alert("⚠ Please fill out all required fields.");
    if (!/^[^ ]+@[^ ]+\.[a-z]{2,3}$/.test(email)) return alert("⚠ Invalid email.");
    if (!/^[0-9]{10}$/.test(phone)) return alert("⚠ Invalid phone.");
    alert("✅ Thank you! Your message has been submitted.");
    contactForm.reset();
  });
}

/* ===================== ADMIN BOOKINGS TABLE & REPLY ===================== */
// Similar changes: replace all `http://localhost:5000/...` with `${API_BASE}/...`
// This ensures the frontend fetches API from same Render deployment
