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

// ---------- Replace this with your actual backend URL ----------
const API_BASE_URL = "https://your-backend-service.onrender.com";

// ------------------ Appointment Form ------------------
const appointmentForm = document.getElementById("appointmentForm");
if (appointmentForm) {
  appointmentForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      name: appointmentForm.name.value,
      email: appointmentForm.email.value,
      phone: appointmentForm.phone.value,
      message: appointmentForm.message.value
    };

    try {
      const res = await fetch(`${API_BASE_URL}/appointment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      const result = await res.json();
      alert(result.message);

      if (result.success) appointmentForm.reset();
    } catch (err) {
      console.error(err);
      alert("⚠️ Error submitting appointment.");
    }
  });
}

// ------------------ Booking Form ------------------
const bookingForm = document.getElementById("bookingForm");
if (bookingForm) {
  bookingForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      treatment: bookingForm.treatment.value,
      name: bookingForm.name.value,
      email: bookingForm.email.value,
      phone: bookingForm.phone.value
    };

    try {
      const res = await fetch(`${API_BASE_URL}/book`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      const result = await res.json();
      alert(result.message);

      if (result.success) bookingForm.reset();
    } catch (err) {
      console.error(err);
      alert("⚠️ Error submitting booking.");
    }
  });
}

// ------------------ Reply Form (Admin) ------------------
const replyForm = document.getElementById("replyForm");
if (replyForm) {
  replyForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      email: replyForm.email.value,
      subject: replyForm.subject.value,
      message: replyForm.message.value
    };

    try {
      const res = await fetch(`${API_BASE_URL}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      const result = await res.json();
      alert(result.message);

      if (result.success) replyForm.reset();
    } catch (err) {
      console.error(err);
      alert("⚠️ Error sending reply.");
    }
  });
}

