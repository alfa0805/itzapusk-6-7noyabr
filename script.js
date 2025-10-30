// --- Timer ---
const timerDisplay = document.getElementById("timer");
let timeLeft = 2 * 60;
function updateTimer() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timerDisplay.textContent = `${minutes} :${seconds < 10 ? " 0" : " "}${seconds}`;
  if (timeLeft > 0) timeLeft--;
  else {
    clearInterval(timerInterval);
    timerDisplay.textContent = "Tugadi";
  }
}
const timerInterval = setInterval(updateTimer, 1000);

// --- Elementlar ---
const openBtn = document.getElementById("openFormBtn");
const overlay = document.getElementById("formOverlay");
const form = document.getElementById("registerForm");
const submitBtn = document.getElementById("submitBtn");
const phoneInput = document.getElementById("phone");

// --- Telegram ma'lumotlari ---
const BOT_TOKEN = "8310381708:AAFMlkMv59XwlDJ3nGuxI4qypoX3a1HCB-w";
const CHAT_ID = "-1002609658773";
const SHEET_URL =
  "https://script.google.com/macros/s/AKfycbzAuoMO_y7SUTk0pIw7wm598Lji6WuRPjb71ggw3G1erCO6uYIAM7HEEDxkp59bjgT53w/exec";

// --- Modal boshqaruvi ---
openBtn.addEventListener("click", () => (overlay.style.display = "flex"));
overlay.addEventListener("click", (e) => {
  if (e.target === overlay) overlay.style.display = "none";
});

// --- Xatolik funksiyalari ---
function showError(input, message) {
  clearError(input);
  const error = document.createElement("p");
  error.classList.add("error-text");
  error.textContent = message;
  input.parentElement.insertAdjacentElement("afterend", error);
  input.classList.add("error-input");
}
function clearError(input) {
  const err = input.parentElement.parentElement.querySelector(".error-text");
  if (err) err.remove();
  input.classList.remove("error-input");
}

// --- Telefon formatlash ---
phoneInput.addEventListener("input", (e) => {
  let value = e.target.value.replace(/\D/g, "");
  if (value.length > 9) value = value.slice(0, 9);

  let formatted = "";
  if (value.length > 0) formatted = value.slice(0, 2);
  if (value.length > 2) formatted += " " + value.slice(2, 5);
  if (value.length > 5) formatted += " " + value.slice(5, 7);
  if (value.length > 7) formatted += " " + value.slice(7, 9);

  e.target.value = formatted;
});

// --- Forma yuborish ---
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nameInput = document.getElementById("name");
  clearError(nameInput);
  clearError(phoneInput);

  // Ism
  if (!nameInput.value.trim()) {
    showError(nameInput, "Iltimos, ismingizni kiriting");
    return;
  }

  // Telefon
  const phoneValue = phoneInput.value.replace(/\D/g, "");
  if (!phoneValue) {
    showError(phoneInput, "Iltimos, telefon raqamingizni kiriting");
    return;
  }
  if (phoneValue.length !== 9) {
    showError(phoneInput, "Telefon raqami 9 ta raqamdan iborat bo‘lishi kerak");
    return;
  }

  // Jo‘natish
  submitBtn.textContent = "Yuborilmoqda...";
  submitBtn.disabled = true;

  const name = nameInput.value.trim();
  const formattedPhone = `+998${phoneValue}`;
  const text = `👤 Ism: ${name}\n📞 Tel: ${formattedPhone}`;

  try {
    const telegramPromise = fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: CHAT_ID, text }),
      }
    );

    fetch(SHEET_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone: formattedPhone }),
    });

    await telegramPromise;

    submitBtn.textContent = "Tabriklayman ✅";
    submitBtn.classList.add("success");

    setTimeout(() => {
      form.reset();
      submitBtn.textContent = "Yuborish";
      submitBtn.disabled = false;
      overlay.style.display = "none";
      window.open("https://t.me/+JLNrGiMU5f0wYjYy", "_blank");
    }, 800);
  } catch (err) {
    alert("Xatolik yuz berdi: " + err.message);
    submitBtn.textContent = "Yuborish";
    submitBtn.disabled = false;
  }
});
