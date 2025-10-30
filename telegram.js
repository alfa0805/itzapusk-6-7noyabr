// telegram.js
(function () {
  const DELAY = 5000; // kutish (ms)

  // DOM tayyor bo'lgandan keyin ishlaydi
  function init() {
    const telegramLink = document.getElementById("telegramLink");
    if (!telegramLink) return; // agar element topilmasa chiqib ket

    let clicked = false;

    telegramLink.addEventListener("click", () => {
      clicked = true;
    });

    // 5 seconddan keyin ochish (agar foydalanuvchi bosmagan bo'lsa)
    setTimeout(() => {
      if (clicked) return;

      // Avvalo yangi oynada ochishni urinib ko'ramiz
      const newWin = window.open(telegramLink.href, "_blank", "noopener,noreferrer");

      // Agar popup bloklangan bo'lsa, newWin null bo'ladi -> fallback: navigatsiya
      if (!newWin) {
        // fallback: shu oynada yuklash (bloklash bo'lmaydi)
        window.location.href = telegramLink.href;
      }
    }, DELAY);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
