// Interaksi umum: menu mobile, tema, tahun footer, kuis, checklist, dan salin email.
document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav-links");
  if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", String(isOpen));
      menuButton.textContent = isOpen ? "×" : "☰";
    });
    nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
      nav.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.textContent = "☰";
    }));
  }

  const themeButtons = document.querySelectorAll(".theme-toggle");
  const savedTheme = localStorage.getItem("technova-theme");
  if (savedTheme === "light") document.body.classList.add("light-mode");
  const updateThemeIcons = () => themeButtons.forEach(button => button.textContent = document.body.classList.contains("light-mode") ? "☾" : "☼");
  updateThemeIcons();
  themeButtons.forEach(button => button.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    localStorage.setItem("technova-theme", document.body.classList.contains("light-mode") ? "light" : "dark");
    updateThemeIcons();
  }));

  document.querySelectorAll("[data-year]").forEach(el => el.textContent = new Date().getFullYear());

  // Kuis tiga pertanyaan di halaman jaringan.
  const quiz = document.querySelector("#network-quiz");
  if (quiz) {
    const questions = [
      {q:"Perangkat yang meneruskan paket antarjaringan berdasarkan alamat IP adalah...", options:["Switch","Router","Keyboard"], answer:1, explain:"Benar. Router meneruskan paket antarjaringan menggunakan informasi alamat IP."},
      {q:"Switch umumnya meneruskan frame dalam LAN berdasarkan...", options:["MAC address","Nama pengguna","Ukuran monitor"], answer:0, explain:"Benar. Switch mempelajari alamat MAC untuk meneruskan frame ke port yang sesuai."},
      {q:"Jaringan dengan cakupan area lokal seperti laboratorium kampus disebut...", options:["WAN","LAN","PAN"], answer:1, explain:"Benar. LAN digunakan pada area terbatas seperti rumah, kantor, atau laboratorium."}
    ];
    let index = 0, selected = null, checked = false, score = 0;
    const questionEl = document.querySelector("#quiz-question");
    const optionsEl = document.querySelector("#quiz-options");
    const countEl = document.querySelector(".quiz-count");
    const feedbackEl = document.querySelector("#quiz-feedback");
    const nextButton = document.querySelector("#quiz-next");
    const bar = document.querySelector("#quiz-progress-bar");
    function render() {
      const item = questions[index];
      selected = null; checked = false;
      countEl.textContent = `PERTANYAAN ${String(index + 1).padStart(2,"0")} / ${String(questions.length).padStart(2,"0")}`;
      questionEl.textContent = item.q;
      optionsEl.innerHTML = "";
      item.options.forEach((option, i) => {
        const button = document.createElement("button");
        button.type = "button"; button.textContent = option; button.dataset.answer = i;
        button.addEventListener("click", () => {
          if (checked) return;
          selected = i;
          optionsEl.querySelectorAll("button").forEach(b => b.classList.toggle("selected", b === button));
          feedbackEl.textContent = "Jawaban dipilih. Tekan periksa jawaban.";
        });
        optionsEl.appendChild(button);
      });
      feedbackEl.textContent = "Pilih salah satu jawaban.";
      nextButton.textContent = "Periksa jawaban";
      bar.style.width = `${(index / questions.length) * 100}%`;
    }
    nextButton.addEventListener("click", () => {
      if (!checked) {
        if (selected === null) { feedbackEl.textContent = "Pilih jawaban terlebih dahulu."; return; }
        checked = true;
        const item = questions[index];
        const buttons = optionsEl.querySelectorAll("button");
        buttons.forEach((b, i) => {
          b.disabled = true;
          if (i === item.answer) b.classList.add("correct");
          if (i === selected && i !== item.answer) b.classList.add("incorrect");
        });
        if (selected === item.answer) { score++; feedbackEl.textContent = item.explain; }
        else feedbackEl.textContent = `Belum tepat. ${item.explain}`;
        nextButton.textContent = index === questions.length - 1 ? "Lihat hasil" : "Pertanyaan berikutnya";
      } else if (index < questions.length - 1) {
        index++; render();
      } else {
        questionEl.textContent = `Kuis selesai! Skor kamu ${score} dari ${questions.length}.`;
        optionsEl.innerHTML = "";
        feedbackEl.textContent = score === questions.length ? "Mantap! Semua jawaban benar." : "Coba ulangi materi dan tingkatkan skor kamu.";
        nextButton.textContent = "Ulangi kuis";
        bar.style.width = "100%";
        nextButton.onclick = () => { index = 0; score = 0; nextButton.onclick = null; render(); };
      }
      if (checked) bar.style.width = `${((index + 1) / questions.length) * 100}%`;
    });
    render();
  }

  const checklist = document.querySelector(".checklist");
  if (checklist) {
    const inputs = [...checklist.querySelectorAll('input[type="checkbox"]')];
    const count = document.querySelector("#checklist-count");
    const progress = document.querySelector("#checklist-progress");
    const updateChecklist = () => {
      const checked = inputs.filter(input => input.checked).length;
      count.textContent = `${checked} dari ${inputs.length} kebiasaan diperiksa`;
      progress.style.width = `${checked / inputs.length * 100}%`;
    };
    inputs.forEach(input => input.addEventListener("change", updateChecklist));
    updateChecklist();
  }

  const copyButton = document.querySelector("#copy-email");
  if (copyButton) {
    copyButton.addEventListener("click", async () => {
      const feedback = document.querySelector("#copy-feedback");
      try {
        await navigator.clipboard.writeText(copyButton.dataset.email);
        feedback.textContent = "Alamat email berhasil disalin.";
      } catch {
        feedback.textContent = `Email: ${copyButton.dataset.email}`;
      }
    });
  }
});