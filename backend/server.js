const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// -------------------- FILES --------------------
const appointmentsFile = path.join(__dirname, "appointments.json");
const bookingsFile = path.join(__dirname, "bookings.json");

// Create files if they don't exist
if (!fs.existsSync(appointmentsFile)) fs.writeFileSync(appointmentsFile, JSON.stringify([]));
if (!fs.existsSync(bookingsFile)) fs.writeFileSync(bookingsFile, JSON.stringify([]));

// -------------------- EMAIL --------------------
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Render env var
    pass: process.env.EMAIL_PASS  // Render env var (App Password)
  }
});

// -------------------- HELPERS --------------------
function saveJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}
function readJSON(file) {
  return JSON.parse(fs.readFileSync(file));
}

// -------------------- APPOINTMENTS --------------------
app.post("/appointment", (req, res) => {
  const { name, email, phone, message } = req.body;
  if (!name || !email || !phone) return res.json({ success: false, message: "⚠️ All fields required!" });

  const appointment = { id: Date.now(), name, email, phone, message, date: new Date().toISOString() };
  const data = readJSON(appointmentsFile);
  data.push(appointment);
  saveJSON(appointmentsFile, data);

  // Email to clinic
  const clinicMail = {
    from: process.env.EMAIL_USER,
    to: "receiveremail@gmail.com",
    subject: "📩 New Appointment Request",
    text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}\nDate: ${appointment.date}`
  };

  // Confirmation to patient
  const patientMail = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "✅ Appointment Request Received",
    text: `Hello ${name},\n\nWe have received your appointment request. Our team will contact you soon.\n\n- Sakthi Dental Clinic`
  };

  transporter.sendMail(clinicMail, err => err && console.error(err));
  transporter.sendMail(patientMail, err => {
    if (err) return res.json({ success: true, message: "Appointment saved, clinic notified, patient email failed." });
    res.json({ success: true, message: "✅ Appointment request submitted successfully!" });
  });
});

app.get("/appointment", (req, res) => {
  const data = readJSON(appointmentsFile);
  res.json({ success: true, appointments: data });
});

// -------------------- BOOKINGS --------------------
app.post("/book", (req, res) => {
  const { treatment, name, email, phone } = req.body;
  if (!treatment || !name || !email || !phone) return res.json({ success: false, message: "⚠️ All fields required!" });

  const booking = { id: Date.now(), treatment, name, email, phone, date: new Date().toISOString() };
  const data = readJSON(bookingsFile);
  data.push(booking);
  saveJSON(bookingsFile, data);

  const clinicMail = {
    from: process.env.EMAIL_USER,
    to: "receiveremail@gmail.com",
    subject: `📩 New Treatment Booking: ${treatment}`,
    text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nTreatment: ${treatment}\nDate: ${booking.date}`
  };

  const patientMail = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `✅ Booking Confirmation - Sakthi Dental Clinic`,
    text: `Hello ${name},\n\nYour booking is confirmed.\nTreatment: ${treatment}\nPhone: ${phone}\nDate: ${new Date(booking.date).toLocaleString()}\n\n- Sakthi Dental Clinic`
  };

  transporter.sendMail(clinicMail, err => err && console.error(err));
  transporter.sendMail(patientMail, err => {
    if (err) return res.json({ success: true, message: "Booking saved, clinic notified, patient email failed." });
    res.json({ success: true, message: "✅ Booking saved & emails sent successfully!" });
  });
});

app.get("/book", (req, res) => {
  const data = readJSON(bookingsFile);
  res.json({ success: true, bookings: data });
});

app.delete("/bookings/:id", (req, res) => {
  const id = parseInt(req.params.id);
  let data = readJSON(bookingsFile);
  const newData = data.filter(b => b.id !== id);
  if (data.length === newData.length) return res.status(404).json({ success: false, message: "Booking not found" });
  saveJSON(bookingsFile, newData);
  res.json({ success: true, message: "✅ Booking deleted successfully" });
});

// -------------------- REPLY EMAIL --------------------
app.post("/reply", (req, res) => {
  const { email, subject, message } = req.body;
  if (!email || !subject || !message) return res.json({ success: false, message: "⚠️ All fields required!" });

  const replyMail = { from: process.env.EMAIL_USER, to: email, subject, text: message };
  transporter.sendMail(replyMail, err => {
    if (err) return res.json({ success: false, message: "❌ Failed to send reply." });
    res.json({ success: true, message: "✅ Reply sent successfully!" });
  });
});

// -------------------- SERVER --------------------
app.get("/", (req, res) => res.send("🚀 Backend is running! Use /book, /appointment, /bookings, /reply APIs."));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
