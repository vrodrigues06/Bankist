export default function initSlider() {
  const btnRight = document.querySelector(".slider__btn--right");
  const btnLeft = document.querySelector(".slider__btn--left");
  const slides = document.querySelectorAll(".slide");
  const dots = document.querySelectorAll(".dots__dot");
  const dotsContainer = document.querySelector(".dots");

  let curSlide = 0;
  const maxSlide = slides.length - 1;

  // Button Events

  const goToSlide = (slide) => {
    slides.forEach((sli, i) => {
      sli.style.transform = `translateX(${100 * (i - slide)}%)`;
    });
    changeDots(slide);
  };

  goToSlide(0);
  const handlerSliderRight = () => {
    if (curSlide === maxSlide) {
      curSlide = 0;
    } else {
      curSlide++;
    }

    goToSlide(curSlide);
  };

  const handlerSliderLeft = () => {
    if (curSlide === 0) {
      curSlide = maxSlide;
    } else curSlide--;

    goToSlide(curSlide);
  };

  // Dots Events

  function changeDots(slide) {
    dots.forEach((dot) => {
      dot.classList.remove("dots__dot--active");
    });
    dots[slide].classList.add("dots__dot--active");
  }

  const handleSlideDots = (e) => {
    if (!e.target.classList.contains("dots__dot")) return;

    const slide = e.target.dataset.slide;

    changeDots(slide);
    goToSlide(slide);
  };

  // Arrow Events

  const handleSliderKey = ({ key }) => {
    if (key === "ArrowLeft") {
      handlerSliderLeft();
      btnLeft.classList.add("arrowClick");
      setTimeout(() => {
        btnLeft.classList.remove("arrowClick");
      }, 150);
    }

    if (key === "ArrowRight") {
      handlerSliderRight();
      btnRight.classList.add("arrowClick");
      setTimeout(() => {
        btnRight.classList.remove("arrowClick");
      }, 150);
    }
  };

  btnRight.addEventListener("click", handlerSliderRight);
  btnLeft.addEventListener("click", handlerSliderLeft);
  dotsContainer.addEventListener("click", handleSlideDots);
  document.body.addEventListener("keyup", handleSliderKey);

  setInterval(() => {
    handlerSliderRight();
  }, 30000);
}
