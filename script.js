
// --- ELEMENTLAR ---
const overlay = document.getElementById("formOverlay");
const form = document.getElementById("registerForm");
const nameInput = document.getElementById("name");
const phoneInput = document.getElementById("phone");
const submitBtn = document.getElementById("submitBtn1");

// --- 2ta tugma uchun event qo'shamiz ---
document.querySelectorAll("#openFormBtn, #openFormBtn1").forEach((btn) => {
  btn.addEventListener("click", () => {
    overlay.style.display = "flex";
  });
});

// --- Modalni yopish ---
overlay.addEventListener("click", (e) => {
  if (e.target === overlay) {
    overlay.style.display = "none";
    form.reset();
    clearAllErrors();
  }
});

// --- Xatoliklar bilan ishlash ---
function showError(input, message) {
  clearError(input);
  const span = input.parentElement.nextElementSibling;
  if (span) span.textContent = message;
  input.classList.add("error-input");
}

function clearError(input) {
  const span = input.parentElement.nextElementSibling;
  if (span) span.textContent = "";
  input.classList.remove("error-input");
}

function clearAllErrors() {
  document.querySelectorAll(".error-text, .error-text1").forEach((e) => (e.textContent = ""));
  document.querySelectorAll(".error-input").forEach((e) => e.classList.remove("error-input"));
}

// --- Telefon formatlash ---
phoneInput.addEventListener("input", (e) => {
  let v = e.target.value.replace(/\D/g, "").slice(0, 9);
  let f = "";
  if (v.length > 0) f = v.slice(0, 2);
  if (v.length > 2) f += " " + v.slice(2, 5);
  if (v.length > 5) f += " " + v.slice(5, 7);
  if (v.length > 7) f += " " + v.slice(7, 9);
  e.target.value = f;
});

// --- Telegram va Google Sheet ---
const BOT_TOKEN = "8310381708:AAFMlkMv59XwlDJ3nGuxI4qypoX3a1HCB-w"; // o'zingnikini yoz
const CHAT_ID = "-1002609658773";   // o'zingnikini yoz
const SHEET_URL = "https://script.google.com/macros/s/AKfycbzAuoMO_y7SUTk0pIw7wm598Lji6WuRPjb71ggw3G1erCO6uYIAM7HEEDxkp59bjgT53w/exec";

// --- Forma yuborish ---
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearAllErrors();

  const name = nameInput.value.trim();
  const phone = phoneInput.value.replace(/\D/g, "");

  // --- Validatsiya ---
  if (!name) return showError(nameInput, "Iltimos, ismingizni kiriting");
  if (!phone) return showError(phoneInput, "Telefon raqamini kiriting");
  if (phone.length !== 9)
    return showError(phoneInput, "Raqam 9 ta sondan iborat bo‘lishi kerak");

  const formattedPhone = `+998${phone}`;
  const text = `👤 Ism: ${name}\n📞 Tel: ${formattedPhone}`;

  submitBtn.textContent = "Yuborilmoqda...";
  submitBtn.disabled = true;

  try {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: CHAT_ID, text }),
    });

    // Google Sheets uchun
    fetch(SHEET_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone: formattedPhone }),
    });

    submitBtn.textContent = "Tabriklayman ✅";
    submitBtn.classList.add("success");

    setTimeout(() => {
      form.reset();
      submitBtn.textContent = "RO‘YXATDAN O‘TISH";
      submitBtn.disabled = false;
      window.location.href = "telegram.html";
      overlay.style.display = "none";
    }, 700);
  } catch (err) {
    alert("Xatolik yuz berdi: " + err.message);
    submitBtn.textContent = "RO‘YXATDAN O‘TISH";
    submitBtn.disabled = false;
  }
});


// --- TIMER ---
const timerDisplay = document.getElementById("timer");
let timeLeft = 2 * 60;

function updateTimer() {
  const min = Math.floor(timeLeft / 60);
  const sec = timeLeft % 60;
  timerDisplay.textContent = `${min} :${sec < 10 ? " 0" : " "}${sec}`;
  if (timeLeft > 0) timeLeft--;
  else {
    clearInterval(timerInterval);
    timerDisplay.textContent = "Tugadi";
  }
}
const timerInterval = setInterval(updateTimer, 1000);

// Telegram script ~~~~~~~~~~~~~~~~~~~~~~~~~~


