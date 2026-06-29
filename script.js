// ============================================
// MENU BURGER CORRIGÉ - Version améliorée
// ============================================

document.addEventListener("DOMContentLoaded", function () {
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("navMenu");
  const navOverlay = document.getElementById("navOverlay");
  const navClose = document.getElementById("navClose");
  const body = document.body;

  // Fonction pour ouvrir le menu
  function openMenu() {
    hamburger.classList.add("active");
    navMenu.classList.add("active");
    navOverlay.classList.add("active");
    body.style.overflow = "hidden"; // Empêche le scroll
  }

  // Fonction pour fermer le menu
  function closeMenu() {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
    navOverlay.classList.remove("active");
    body.style.overflow = ""; // Réactive le scroll
  }

  // Ouvrir avec le hamburger
  if (hamburger) {
    hamburger.addEventListener("click", function (e) {
      e.stopPropagation();
      if (navMenu.classList.contains("active")) {
        closeMenu();
      } else {
        openMenu();
      }
    });
  }

  // Fermer avec la croix
  if (navClose) {
    navClose.addEventListener("click", closeMenu);
  }

  // Fermer en cliquant sur l'overlay (fond)
  if (navOverlay) {
    navOverlay.addEventListener("click", closeMenu);
  }

  // Fermer en cliquant sur un lien
  document.querySelectorAll(".nav-links-mobile a").forEach(function (link) {
    link.addEventListener("click", closeMenu);
  });

  // Fermer avec la touche Echap
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && navMenu.classList.contains("active")) {
      closeMenu();
    }
  });

  // ============================================
  // CARROUSEL (page accueil)
  // ============================================
  const track = document.querySelector(".carousel-track");
  const cards = document.querySelectorAll(".carousel-track .art-card");
  const prevBtn = document.querySelector(".carousel-btn.prev");
  const nextBtn = document.querySelector(".carousel-btn.next");

  if (track && cards.length > 0 && prevBtn && nextBtn) {
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
      if (currentIndex > maxIndex) currentIndex = 0;
      updateCarousel();
    }

    function prevSlide() {
      const cardsPerView = getCardsPerView();
      const maxIndex = Math.max(cards.length - cardsPerView, 0);
      currentIndex -= cardsPerView;
      if (currentIndex < 0) currentIndex = maxIndex;
      updateCarousel();
    }

    nextBtn.addEventListener("click", nextSlide);
    prevBtn.addEventListener("click", prevSlide);

    let autoSlide = setInterval(nextSlide, 3000);
    const carousel = document.querySelector(".carousel");

    if (carousel) {
      carousel.addEventListener("mouseenter", () => clearInterval(autoSlide));
      carousel.addEventListener("mouseleave", () => {
        autoSlide = setInterval(nextSlide, 3000);
      });
    }

    window.addEventListener("resize", () => {
      const cardsPerView = getCardsPerView();
      const maxIndex = Math.max(cards.length - cardsPerView, 0);
      if (currentIndex > maxIndex) currentIndex = maxIndex;
      updateCarousel();
    });

    updateCarousel();
  }

  // ============================================
  // FILTRES ET RECHERCHE (page collection)
  // ============================================
  const filterButtons = document.querySelectorAll(".filter-btn");
  const collectionCards = document.querySelectorAll(
    ".collection-grid .art-card",
  );
  const searchInput = document.getElementById("searchInput");

  let currentFilter = "toutes";
  let currentSearch = "";

  function matchesSearch(card, searchTerm) {
    if (!searchTerm) return true;
    const textContent = card.textContent.toLowerCase();
    const keywords = searchTerm.toLowerCase().split(" ");
    return keywords.some((keyword) => textContent.includes(keyword));
  }

  function filterCards() {
    collectionCards.forEach((card) => {
      const cardType = card.getAttribute("data-type");
      const typeMatch =
        currentFilter === "toutes" || cardType === currentFilter;
      const searchMatch = matchesSearch(card, currentSearch);

      if (typeMatch && searchMatch) {
        card.style.display = "block";
        card.style.animation = "fadeIn 0.4s ease";
      } else {
        card.style.display = "none";
      }
    });
  }

  if (filterButtons.length) {
    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        filterButtons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");
        currentFilter = button.getAttribute("data-filter");
        filterCards();
      });
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      currentSearch = e.target.value;
      filterCards();
    });
  }

  // Animation fadeIn
  if (!document.querySelector("style[data-fade]")) {
    const style = document.createElement("style");
    style.setAttribute("data-fade", "");
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .art-card { animation: fadeIn 0.4s ease; }
    `;
    document.head.appendChild(style);
  }
});
