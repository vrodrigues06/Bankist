export default function initTabOperations() {
  const contentArr = document.querySelectorAll(".operations__content");
  const tabContainer = document.querySelector(".operations__tab-container");
  const activeClass = "operations__content--active";
  const activeBtn = "operations__tab--active";
  contentArr[0].classList.add(activeClass);
  const btnsArray = [...tabContainer.children];
  btnsArray[0].classList.add(activeBtn);

  // Function to display content

  const activeContent = (tabNum) => {
    contentArr.forEach((content) => {
      content.classList.remove(activeClass);
    });
    const contentSelected = document.querySelector(
      `.operations__content--${tabNum}`
    );
    contentSelected.classList.add(activeClass);
  };

  // Function to active the button Tab

  const activeTab = (e) => {
    e.preventDefault();
    const btnClicked = e.target.closest(".operations__tab");

    if (!btnClicked) return;

    const elTab = btnClicked.getAttribute("data-tab");
    const btnTab = document.querySelector(`[data-tab="${elTab}"]`);

    btnTab.classList.add(activeBtn);
    activeContent(elTab);
    btnsArray.forEach((btn) => {
      if (btn !== btnTab) {
        btn.classList.remove(activeBtn);
      }
    });
  };

  tabContainer.addEventListener("click", activeTab);
}
