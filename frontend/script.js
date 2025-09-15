/* ===================== CONFIG ===================== */
const API_BASE_URL = "https://your-backend-service.onrender.com"; // Replace with your Render backend URL

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

/* ===================== APPOINTMENT FORM ===================== */
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
      const res = await fetch(`${API_BASE_URL}/book`, {
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

/* ===================== ADMIN BOOKINGS TABLE ===================== */
const bookingsTable = document.querySelector("#bookingsTable tbody");

async function loadBookings() {
  if (!bookingsTable) return;

  try {
    const res = await fetch(`${API_BASE_URL}/book`);
    const data = await res.json();
    bookingsTable.innerHTML = "";

    if (!data.success || !data.bookings || data.bookings.length === 0) {
      bookingsTable.innerHTML = `<tr><td colspan="7">⚠ No bookings found</td></tr>`;
      return;
    }

    data.bookings.forEach(b => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${b.id}</td>
        <td>${b.treatment || "-"}</td>
        <td>${b.name}</td>
        <td>${b.email}</td>
        <td>${b.phone}</td>
        <td>${new Date(b.date).toLocaleString()}</td>
        <td><button class="delete-btn" data-id="${b.id}">❌ Delete</button></td>
      `;

      row.addEventListener("click", () => {
        const replyEmail = document.getElementById("replyEmail");
        const replySubject = document.getElementById("replySubject");
        if (replyEmail && replySubject) {
          replyEmail.value = b.email;
          replySubject.focus();
        }
      });

      bookingsTable.appendChild(row);
    });

    // Attach delete functionality
    document.querySelectorAll(".delete-btn").forEach(btn => {
      btn.addEventListener("click", async (e) => {
        e.stopPropagation();
        const id = btn.getAttribute("data-id");
        if (confirm("Delete this booking?")) {
          await fetch(`${API_BASE_URL}/bookings/${id}`, { method: "DELETE" });
          loadBookings();
        }
      });
    });
  } catch (err) {
    console.error(err);
    bookingsTable.innerHTML = `<tr><td colspan="7">⚠ Error loading bookings</td></tr>`;
  }
}

if (bookingsTable) loadBookings();

/* ===================== ADMIN REPLY FORM ===================== */
const replyForm = document.getElementById("replyForm");
if (replyForm) {
  replyForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = {
      email: document.getElementById("replyEmail").value.trim(),
      subject: document.getElementById("replySubject").value.trim(),
      message: document.getElementById("replyMessage").value.trim()
    };

    if (!data.email || !data.subject || !data.message) {
      alert("⚠ All fields are required!");
      return;
    }

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
      alert("⚠ Failed to send reply.");
    }
  });
}
