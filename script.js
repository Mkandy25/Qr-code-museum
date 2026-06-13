// Menu burger
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");

if (hamburger && navLinks) {
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navLinks.classList.toggle("active");
  });

  // Fermer le menu après un clic sur un lien
  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active");
      navLinks.classList.remove("active");
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector(".carousel-track");
  const cards = document.querySelectorAll(".carousel-track .art-card");
  const prevBtn = document.querySelector(".carousel-btn.prev");
  const nextBtn = document.querySelector(".carousel-btn.next");

  // Si on n'est pas sur la page d'accueil, on arrête le script
  if (!track || cards.length === 0 || !prevBtn || !nextBtn) {
    return;
  }

  let currentIndex = 0;

  function getCardsPerView() {
    return window.innerWidth <= 768 ? 1 : 3;
  }

  function getGap() {
    const styles = window.getComputedStyle(track);
    return parseInt(styles.gap) || 0;
  }

  function updateCarousel() {
    const cardWidth = cards[0].offsetWidth;
    const gap = getGap();

    track.style.transform = `translateX(-${currentIndex * (cardWidth + gap)}px)`;
  }

  function nextSlide() {
    const cardsPerView = getCardsPerView();
    const maxIndex = Math.max(cards.length - cardsPerView, 0);

    currentIndex += cardsPerView;

    if (currentIndex > maxIndex) {
      currentIndex = 0;
    }

    updateCarousel();
  }

  function prevSlide() {
    const cardsPerView = getCardsPerView();
    const maxIndex = Math.max(cards.length - cardsPerView, 0);

    currentIndex -= cardsPerView;

    if (currentIndex < 0) {
      currentIndex = maxIndex;
    }

    updateCarousel();
  }

  nextBtn.addEventListener("click", nextSlide);
  prevBtn.addEventListener("click", prevSlide);

  // Défilement automatique toutes les 5 secondes
  let autoSlide = setInterval(nextSlide, 3000);

  // Met en pause quand la souris est dessus
  const carousel = document.querySelector(".carousel");

  carousel.addEventListener("mouseenter", () => {
    clearInterval(autoSlide);
  });

  carousel.addEventListener("mouseleave", () => {
    autoSlide = setInterval(nextSlide, 3000);
  });

  // Recalcul lors du redimensionnement
  window.addEventListener("resize", () => {
    const cardsPerView = getCardsPerView();
    const maxIndex = Math.max(cards.length - cardsPerView, 0);

    if (currentIndex > maxIndex) {
      currentIndex = maxIndex;
    }

    updateCarousel();
  });

  updateCarousel();
});
