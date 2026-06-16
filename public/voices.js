(() => {
  const floatingCta = document.querySelector(".floating-cta");
  const heroCta = document.querySelector(".slice-cta-fv");
  const finalCtaSection = document.querySelector("#cta-link");

  if (floatingCta && heroCta) {
    const syncFloatingCta = () => {
      const showAfter = heroCta.offsetTop + heroCta.offsetHeight;
      const finalCtaVisible =
        finalCtaSection && finalCtaSection.getBoundingClientRect().top < window.innerHeight * 0.82;

      floatingCta.classList.toggle("is-visible", window.scrollY > showAfter && !finalCtaVisible);
    };

    window.addEventListener("scroll", syncFloatingCta, { passive: true });
    window.addEventListener("resize", syncFloatingCta);
    syncFloatingCta();
  }

  const viewport = document.querySelector("[data-voice-viewport]");
  const cards = Array.from(document.querySelectorAll(".voice-card"));
  const prevButton = document.querySelector("[data-voice-prev]");
  const nextButton = document.querySelector("[data-voice-next]");
  const current = document.querySelector("[data-voice-current]");
  const total = document.querySelector("[data-voice-total]");

  if (!viewport || !cards.length || !prevButton || !nextButton) {
    return;
  }

  let activeIndex = 0;
  let rafId = 0;

  const syncCount = () => {
    if (current) current.textContent = String(activeIndex + 1);
    if (total) total.textContent = String(cards.length);
  };

  const scrollToCard = (index) => {
    activeIndex = (index + cards.length) % cards.length;
    cards[activeIndex].scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
    syncCount();
  };

  const updateActiveFromScroll = () => {
    const viewportCenter = viewport.getBoundingClientRect().left + viewport.clientWidth / 2;
    let nearestIndex = 0;
    let nearestDistance = Number.POSITIVE_INFINITY;

    cards.forEach((card, index) => {
      const rect = card.getBoundingClientRect();
      const cardCenter = rect.left + rect.width / 2;
      const distance = Math.abs(cardCenter - viewportCenter);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = index;
      }
    });

    activeIndex = nearestIndex;
    syncCount();
  };

  prevButton.addEventListener("click", () => scrollToCard(activeIndex - 1));
  nextButton.addEventListener("click", () => scrollToCard(activeIndex + 1));

  viewport.addEventListener("scroll", () => {
    window.cancelAnimationFrame(rafId);
    rafId = window.requestAnimationFrame(updateActiveFromScroll);
  });

  syncCount();
})();
