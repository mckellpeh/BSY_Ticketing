// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
apiKey: "AIzaSyAmghtrQg1UEAAxcDX4QwkeT9EdTX5lY0M",
authDomain: "bsy-ticketing-custom.firebaseapp.com",
projectId: "bsy-ticketing-custom",
storageBucket: "bsy-ticketing-custom.firebasestorage.app",
messagingSenderId: "1040741179293",
appId: "1:1040741179293:web:432685e69c8489aae81974",
measurementId: "G-19W80QSBH2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// 📦 QR Scanner setup
const html5QrCode = new Html5Qrcode("reader");

const qrConfig = {
  fps: 10,
  qrbox: 250
};

function showStatus(message, success = true) {
  const statusDiv = document.getElementById("status");
  statusDiv.innerText = message;
  statusDiv.style.color = success ? "green" : "red";
}

function checkInTicket(qrText) {
  const ticketID = qrText.trim();

  db.collection("attendees").doc(ticketID).get().then((doc) => {
    if (!doc.exists) {
      showStatus("❌ Ticket not found", false);
    } else if (doc.data().checkedIn === true) {
      showStatus("⚠️ Already checked in", false);
    } else {
      db.collection("attendees").doc(ticketID).update({
        checkedIn: true,
        checkInTime: new Date()
      }).then(() => {
        showStatus(`✅ ${doc.data().name} checked in successfully`);
      });
    }
  }).catch((error) => {
    showStatus("⚠️ Error checking in", false);
    console.error(error);
  });
}

// 🟢 Start camera
html5QrCode.start(
  { facingMode: "environment" },
  qrConfig,
  (decodedText, decodedResult) => {
    html5QrCode.stop(); // stop after one scan
    checkInTicket(decodedText);
    setTimeout(() => {
      html5QrCode.start({ facingMode: "environment" }, qrConfig, (text) => {
        html5QrCode.stop();
        checkInTicket(text);
      });
    }, 3000); // resume after delay
  },
  (errorMessage) => {
    // console.warn(errorMessage); // Optional: show camera errors
  }
);
