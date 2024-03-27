export default function initSectionReveal() {
  const sections = document.querySelectorAll(".section");

  const revealSection = (entries, observer) => {
    const [entry] = entries;
    const section = entry.target;

    if (entry.isIntersecting === true) {
      section.classList.remove("section--hidden");
      observer.unobserve(entry.target);
    }
  };

  const sectionObserver = new IntersectionObserver(revealSection, {
    root: null,
    threshold: 0.2,
  });

  sections.forEach((sec) => {
    sectionObserver.observe(sec);
    sec.classList.add("section--hidden");
  });
}
