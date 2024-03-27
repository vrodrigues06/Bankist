"use strict";

export default function initApp() {
  // Selecting Dom Elements
  const btnLogin = document.querySelector(".login__btn");
  const btnTransfer = document.querySelector(".form__btn--transfer");
  const btnLoan = document.querySelector(".form__btn--loan");
  const btnClose = document.querySelector(".form__btn--close");
  const btnSort = document.querySelector(".btn--sort");

  const inputTransferTo = document.querySelector(".form__input--to");
  const inputTransferAmount = document.querySelector(".form__input--amount");
  const inputLoanAmount = document.querySelector(".form__input--loan-amount");
  const inputCloseUsername = document.querySelector(".form__input--user");
  const inputClosePin = document.querySelector(".form__input--pin");
  const inputLoginUsername = document.querySelector(".login__input--user");
  const inputLoginPin = document.querySelector(".login__input--pin");

  const labelBalance = document.querySelector(".balance__value");
  const labelDate = document.querySelector(".date");
  const labelWelcome = document.querySelector(".welcome");
  const labelTimer = document.querySelector(".timer");
  const labelSumIn = document.querySelector(".summary__value--in");
  const labelSumOut = document.querySelector(".summary__value--out");

  // Containers

  const containerMovements = document.querySelector(".movements");
  const containerApp = document.querySelector(".app");
  const modal = document.querySelector(".modal");
  let currentAccount, timer;

  const formatDate = (datePassed) => {
    const date = new Date(datePassed);
    const calcDaysPassed = (date1, date2) => {
      return Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
    };

    const daysPassed = calcDaysPassed(new Date(), date);

    const day = `${date.getDate()}`.padStart("2", "0");
    const month = `${date.getMonth() + 1}`.padStart("2", 0);
    const year = date.getFullYear();

    if (daysPassed === 0) return "Today";
    if (daysPassed === 1) return "Yesterday";
    if (daysPassed <= 7 && daysPassed > 1) return `${daysPassed} days ago`;
    else {
      return `${day}/${month}/${year}`;
    }
  };

  const formatCurUsd = (number) => {
    const formatted = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(number);
    return formatted;
  };

  // Recuperation of Accounts

  let accounts = JSON.parse(localStorage.getItem("accounts")) || [];

  class Account {
    constructor(owner, pin) {
      this.owner = owner;
      this.movements = [];
      this.movementsDate = [];
      this.username = this.setUsername();
      this.pin = pin;
      this.balance = 0;
    }

    setUsername() {
      const name = this.owner;
      if (typeof name === "string") {
        const username = name
          .toLowerCase()
          .split(" ")
          .map((nameArr) => nameArr[0])
          .join("");
        this.username = username;
        return username;
      } else {
        return "Invalid Name";
      }
    }

    static login(event) {
      event.preventDefault();
      const userInput = inputLoginUsername.value;
      const pinInput = inputLoginPin.value;

      inputLoginUsername.classList.remove("input-error");
      inputLoginPin.classList.remove("input-error");

      // zero the values after click
      inputLoginPin.value = "";
      inputLoginUsername.value = "";

      currentAccount = accounts.find(
        (acc) => userInput === acc.username && pinInput === acc.pin
      );

      if (currentAccount) {
        labelWelcome.textContent = `Welcome back, ${
          currentAccount.owner.split(" ")[0]
        }`;
        Account.updateUI(currentAccount);
        containerApp.style.opacity = "1";

        // Add events in CurrentAccount

        // btnTransfer.addEventListener(
        //   "click",
        //   currentAccount.transfer.bind(currentAccount)
        // );

        // btnLoan.addEventListener(
        //   "click",
        //   currentAccount.loan.bind(currentAccount)
        // );
        // btnClose.addEventListener(
        //   "click",
        //   currentAccount.closeAcc.bind(currentAccount)
        // );

        let sorted = false;
        btnSort.addEventListener("click", function (e) {
          e.preventDefault();
          Account.displayMovements(currentAccount, !sorted);
          sorted = !sorted;
        });

        // start timer

        if (timer) clearInterval(timer);
        timer = Account.startLogoutTimer();
      } else {
        // feedback if fails
        inputLoginUsername.classList.add("input-error");
        inputLoginPin.classList.add("input-error");
      }
    }

    static updateUI(acc) {
      Account.displayDate();
      Account.displayMovements(acc);
      Account.currentBalance(acc.movements);
      Account.calcDisplaySum(acc);
    }

    static displayDate() {
      const curDate = new Date();
      const day = `${curDate.getDate()}`.padStart("2", "0");
      const month = `${curDate.getMonth() + 1}`.padStart("2", "0");
      const year = curDate.getFullYear();
      const hour = `${curDate.getHours()}`.padStart("2", "0");
      const min = curDate.getMinutes();

      labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;
    }

    static displayMovements(acc, sort = false) {
      containerMovements.innerHTML = "";

      const movs = sort
        ? acc.movements.slice().sort((a, b) => a - b)
        : acc.movements;

      movs.forEach((mov, i) => {
        const displayDate = formatDate(acc.movementsDate[i]);

        // Formating number

        const formattedMov = formatCurUsd(mov);
        // Create and add Div Row
        const movementRow = document.createElement("div");
        movementRow.classList.add("movements__row");

        // Create and add Div of type
        const movementType = document.createElement("div");
        const type = mov > 0 ? "deposit" : "withdrawal";
        movementType.classList.add(
          "movements__type",
          `movements__type--${type}`
        );
        movementType.innerText = `${i + 1} ${type}`;
        movementRow.appendChild(movementType);

        // Create and Add Div of date
        const movementDate = document.createElement("div");
        movementDate.classList.add("movements__date");
        movementDate.innerText = `${displayDate}`;
        movementRow.appendChild(movementDate);

        //  Create and add Div of Value
        const movementValue = document.createElement("div");
        movementValue.classList.add("movements__value");
        movementValue.innerText = `${formattedMov}`;
        movementRow.appendChild(movementValue);

        // sort with date
        containerMovements.prepend(movementRow);
      });
    }

    static currentBalance(accMovs) {
      if (accMovs.length > 0) {
        currentAccount.balance = accMovs.reduce(
          (mov, current) => mov + current
        );
      }

      const formattedBalance = formatCurUsd(currentAccount.balance);

      labelBalance.textContent = `${formattedBalance}`;
    }

    static calcDisplaySum(acc) {
      const incomes = acc.movements
        .filter((mov) => mov > 0)
        .reduce((acc, mov) => acc + mov);

      const formattedIncomes = formatCurUsd(incomes);

      labelSumIn.textContent = `${formattedIncomes}`;

      const out = acc.movements.filter((mov) => mov < 0);
      if (out.length > 0) {
        const sumOut = out.reduce((acc, mov) => acc + mov, 0);

        const formattedOut = formatCurUsd(Math.abs(sumOut));

        labelSumOut.textContent = `${formattedOut}`;
      } else {
        labelSumOut.textContent = 0;
      }
    }

    static startLogoutTimer() {
      let time = 300;
      const timer = setInterval(() => {
        const min = String(Math.trunc(time / 60)).padStart(2, 0);
        const sec = String(time % 60).padStart(2, 0);

        labelTimer.textContent = `${min}:${sec}`;

        if (time === 0) {
          clearInterval(timer);
          containerApp.style.opacity = "0";
          labelWelcome.textContent = "Log in to get started";
          currentAccount = "";
        }

        time--;
      }, 1000);

      return timer;
    }

    feedback(text, container, success = false) {
      const olderSpan = container.querySelector("span");
      if (olderSpan) olderSpan.remove();

      const span = document.createElement("span");
      span.classList.add("operation-feedback");

      if (success) span.classList.add("success");

      span.textContent = text;
      container.insertAdjacentElement("beforeend", span);

      setTimeout(() => {
        span.remove();
      }, 10000);
    }

    transfer(e) {
      e.preventDefault();

      const transferContainer = document.querySelector(".operation--transfer");

      const totalAmount = currentAccount.balance;
      const account = accounts.find(
        (acc) => inputTransferTo.value === acc.username
      );

      if (account) {
        const transferValue = +inputTransferAmount.value;

        if (currentAccount.owner !== account.owner) {
          if (transferValue > 0 && transferValue < totalAmount) {
            account.movements.push(transferValue);
            currentAccount.movements.push(-transferValue);

            account.movementsDate.push(new Date());
            currentAccount.movementsDate.push(new Date());

            Account.updateUI(currentAccount);

            this.feedback(
              "Transfer successfully completed!",
              transferContainer,
              true
            );
            // save with localStorage
            localStorage.setItem("accounts", JSON.stringify(accounts));
          } else {
            this.feedback(
              "You Don't Have this value on Account!",
              transferContainer
            );
          }
        } else {
          this.feedback(
            "You cannot transfer to the same account!",
            transferContainer
          );
        }
      } else {
        this.feedback("The account does not exist!", transferContainer);
      }

      inputTransferTo.value = "";
      inputTransferAmount.value = "";

      // Reset Timer
      if (timer) {
        clearInterval(timer);
        timer = Account.startLogoutTimer();
      }
    }

    loan(e) {
      e.preventDefault();
      const amount = +inputLoanAmount.value;
      const loanContainer = document.querySelector(".operation--loan");

      // only can accept loan if has one mov above 10% of the value
      console.log(amount);
      const bankLoanRule = currentAccount.movements.some(
        (mov) => mov >= amount * 0.25
      );

      if (amount > 0 && bankLoanRule) {
        this.feedback("Loan Approved!", loanContainer, true);
        setTimeout(() => {
          currentAccount.movements.push(amount);
          currentAccount.movementsDate.push(new Date());
          Account.updateUI(currentAccount);
          localStorage.setItem("accounts", JSON.stringify(accounts));
        }, 2500);
      } else {
        this.feedback("Loan Denied!", loanContainer);
      }

      inputLoanAmount.value = "";
      clearInterval(timer);
      timer = Account.startLogoutTimer();
    }

    closeAcc(e) {
      e.preventDefault();
      const user = inputCloseUsername.value;
      const pin = inputClosePin.value;
      const closeAccContainer = document.querySelector(".operation--close");

      if (currentAccount.username === user && currentAccount.pin === pin) {
        containerApp.style.opacity = "0";
      } else {
        this.feedback("Wrong Credentials!", closeAccContainer);
      }

      inputClosePin.value = "";
      inputCloseUsername.value = "";
    }

    // final brackets
  }

  accounts = accounts.map((acc) => {
    const newAccount = new Account(acc.owner, acc.pin);
    newAccount.movements = acc.movements;
    newAccount.movementsDate = acc.movementsDate;
    return newAccount;
  });

  // Open Account Process
  // ? if its online
  //? if (window.location.pathname === "/")

  if (window.location.pathname === "/") {
    const form = document.querySelector(".modal__form");
    const btnSubmit = form.querySelector(".btn");

    const openAccount = (e) => {
      e.preventDefault();
      const inputNode = form.querySelectorAll("input");
      const firstName = inputNode[0].value.trim();
      const lastName = inputNode[1].value.trim();

      if (verifyInputs(inputNode)) {
        const owner = `${firstName} ${lastName}`;
        const pin = `${Math.floor(Math.random() * 9) + 1}`.repeat(4);
        createAccount(owner, pin);
        welcomeMessage(owner, pin);
      }
    };

    function verifyInputs(inputs) {
      const inputArr = [...inputs];
      let valid = true;
      inputArr.forEach((input) => {
        if (input.value === "" || /\d/.test(input.value)) {
          valid = false;
          input.classList.add("input-error");
        } else {
          input.classList.remove("input-error");
        }
      });

      return valid;
    }

    function createAccount(owner, pin) {
      const newAccount = new Account(owner, pin);
      newAccount.movementsDate.push(new Date());
      newAccount.movements.push(100);

      accounts.push(newAccount);
      localStorage.setItem("accounts", JSON.stringify(accounts));
    }

    function welcomeMessage(owner, pin) {
      const modalEls = Array.from(modal.children);

      modalEls.forEach((el) => {
        el.remove();
      });

      modal.style.minWidth = "350px";
      const ownerAccount = accounts.find((acc) => acc.owner === owner);
      const username = ownerAccount.setUsername();

      // Credential Text

      const p = document.createElement("p");
      p.innerHTML = `Here's your credentials:<br>
      username: ${username}
      <br>pin: ${pin}<br>
      `;
      p.classList.add("open-greetings");

      // Header Text
      const h2 = document.createElement("h2");
      h2.classList.add("modal__header");
      h2.textContent = `Hi ${owner}! Welcome aboard! 🚀`;

      // Btn

      const btn = document.createElement("a");
      btn.classList.add("btn");
      btn.setAttribute("href", "./app.html");

      btn.textContent = "Get Start!";

      // Greetings Text
      const greetings = document.createElement("h2");
      greetings.classList.add("modal__header");
      greetings.textContent = `Enjoy your journey with us! `;
      greetings.style.marginTop = "4.5rem";
      greetings.style.marginBottom = "2.5rem";
      modal.insertAdjacentElement("afterbegin", h2);
      modal.insertAdjacentElement("beforeend", p);
      modal.insertAdjacentElement("beforeend", greetings);
      modal.insertAdjacentElement("beforeend", btn);

      // add Animation
      const anime = "slideUp";
      greetings.classList.add(anime);
      h2.classList.add(anime);
      p.classList.add(anime);
      btn.classList.add(anime);
    }

    btnSubmit?.addEventListener("click", openAccount);
  }
  // Events Handler
  btnLogin?.addEventListener("click", Account.login);
  btnTransfer?.addEventListener("click", (e) => {
    currentAccount.transfer(e);
  });
  btnLoan?.addEventListener("click", (e) => {
    currentAccount.loan(e);
  });
  btnClose?.addEventListener("click", (e) => {
    currentAccount.closeAcc(e);
  });
}

initApp();
