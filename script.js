'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

//render ra list movement
const displayMovements = function (account, sort = false) {
  containerMovements.innerHTML = null;
  const movs = sort
    ? account.movements.slice().sort((a, b) => a - b)
    : account.movements;

  movs.forEach((e, i) => {
    const type = e > 0 ? 'deposit' : 'withdrawal';

    const dateMov = new Date(account.movementsDates[i]);
    const displayDate = new Intl.DateTimeFormat(account.locale).format(dateMov);

    const formattedMov = new Intl.NumberFormat(account.locale, {
      style: 'currency',
      currency: account.currency,
    }).format(e);
    const html = `
    <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__date">${displayDate}</div>
    <div class="movements__value">${formattedMov}</div>
  </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

//tính số dư tài khoản
const displayBalance = function (account) {
  account.balance = account.movements.reduce((acc, cur) => acc + cur, 0);
  const formattedBalance = new Intl.NumberFormat(account.locale, {
    style: 'currency',
    currency: account.currency,
  }).format(account.balance);
  labelBalance.textContent = formattedBalance;
};

//tính các loại tổng ra,vảo,lãi
const displaySummary = function (account) {
  const sumIn = account.movements
    .filter((e) => e > 0)
    .reduce((acc, cur) => acc + cur, 0);

  const sumOut = account.movements
    .filter((e) => e < 0)
    .reduce((acc, cur) => acc + cur, 0);

  const interest = account.movements
    .filter((e) => e > 0)
    .map((e) => (e * account.interestRate) / 100)
    .filter((e) => e > 1)
    .reduce((acc, cur) => acc + cur);
  labelSumIn.textContent = new Intl.NumberFormat(account.locale, {
    style: 'currency',
    currency: account.currency,
  }).format(sumIn);
  labelSumOut.textContent = new Intl.NumberFormat(account.locale, {
    style: 'currency',
    currency: account.currency,
  }).format(sumOut);
  labelSumInterest.textContent = new Intl.NumberFormat(account.locale, {
    style: 'currency',
    currency: account.currency,
  }).format(interest);
};

//tạo username cho mỗi người dùng
const createUserName = function (accounts) {
  accounts.forEach((acc) => {
    acc.userName = acc.owner
      .toLowerCase()
      .split(' ')
      .map((e) => e[0])
      .join('');
  });
};

createUserName(accounts);

//handle login
let userLogin, timer;
btnLogin.addEventListener('click', (e) => {
  e.preventDefault();
  userLogin = accounts.find((e) => {
    return e.userName === inputLoginUsername.value;
  });
  console.log(userLogin);
  if (userLogin && userLogin.pin === Number(inputLoginPin.value)) {
    //hiển thị chào mừng
    labelWelcome.textContent = `Welcome back,${userLogin.owner.split(' ')[0]}`;
    //hiển thị giao diện
    containerApp.style.opacity = 1;

    //display time now
    // const now = new Date();
    // const dateNow = `${now.getDate()}`.padStart(2, 0);
    // const monthNow = `${now.getMonth() + 1}`.padStart(2, 0);
    // const hourNow = `${now.getHours()}`.padStart(2, 0);
    // const minuteNow = `${now.getMinutes()}`.padStart(2, 0);
    // labelDate.textContent = `${dateNow}/${monthNow}/${now.getFullYear()} , ${hourNow}:${minuteNow}`;
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    };
    const DateFormat = new Intl.DateTimeFormat(userLogin.locale, options);
    const today = DateFormat.format(new Date());
    labelDate.textContent = today;

    //clear input
    inputLoginUsername.value = inputLoginPin.value = '';
    if (timer) clearInterval(timer);
    timer = timerLogout();
    updateUI(userLogin);
  }
});
//cập nhật giao diện
const updateUI = (account) => {
  //hiển thị giao dịch
  displayMovements(account);
  //hiên thị số dư
  displayBalance(account);
  //hiển thị các loại tổng
  displaySummary(account);
};

const timerLogout = function () {
  const tick = () => {
    const minute = String(Math.trunc(time / 60)).padStart(2, '0');
    const second = String(time % 60).padStart(2, '0');
    labelTimer.textContent = `${minute}:${second}`;
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
    }
    time--;
  };
  let time = 120;
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

//handle chuyển tiền
btnTransfer.addEventListener('click', (e) => {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiver = accounts.find((e) => e.userName === inputTransferTo.value);
  inputTransferAmount.value = inputTransferTo.value = '';
  if (
    amount > 0 &&
    receiver &&
    userLogin.balance >= amount &&
    receiver.userName !== userLogin.userName
  ) {
    userLogin.movements.push(-amount);
    receiver.movements.push(amount);

    userLogin.movementsDates.push(new Date().toISOString());
    receiver.movementsDates.push(new Date().toISOString());

    updateUI(userLogin);
  } else console.log('không chuyển được');
});

//handle cho vay
btnLoan.addEventListener('click', (e) => {
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);
  if (amount > 0 && userLogin.movements.some((e) => e >= amount * 0.1)) {
    userLogin.movements.push(amount);
    userLogin.movementsDates.push(new Date().toISOString());
    updateUI(userLogin);
  }
  inputLoanAmount.value = '';
});

//handle xóa tài khoản
btnClose.addEventListener('click', (e) => {
  e.preventDefault();
  const closeUserName = inputCloseUsername.value;
  const closePin = Number(inputClosePin.value);
  inputCloseUsername.value = inputClosePin.value = '';
  if (userLogin.pin === closePin && userLogin.userName === closeUserName) {
    const index = accounts.findIndex((e) => e.userName === userLogin.userName);
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  } else console.log('ko xóa được');
});
//handle sort movement

let sortState = false;
btnSort.addEventListener('click', (e) => {
  e.preventDefault();
  sortState = !sortState;
  displayMovements(userLogin, sortState);
});
// const arr = [1, 2, 4, -5, 50, -100, 20];
// const max = arr.reduce(function (acc, cur, i) {
//   console.log(i, cur, acc);
//   return cur < acc ? cur : acc;
// }, arr[0]);
// console.log(max);
///////////////////////////////////////////////
// Julia and Kate are doing a study on dogs. So each of them asked 5 dog owners
// about their dog's age, and stored the data into an array (one array for each). For
// now, they are just interested in knowing whether a dog is an adult or a puppy.
// A dog is an adult if it is at least 3 years old, and it's a puppy if it's less than 3 years
// old.
// Your tasks:
// Create a function 'checkDogs', which accepts 2 arrays of dog's ages
// ('dogsJulia' and 'dogsKate'), and does the following things:
// 1. Julia found out that the owners of the first and the last two dogs actually have
// cats, not dogs! So create a shallow copy of Julia's array, and remove the cat
// ages from that copied array (because it's a bad practice to mutate function
// parameters)
// 2. Create an array with both Julia's (corrected) and Kate's data
// 3. For each remaining dog, log to the console whether it's an adult ("Dog number 1
// is an adult, and is 5 years old") or a puppy ("Dog number 2 is still a puppy
// �
// ")
// 4. Run the function for both test datasets
// Test data:
// § Data 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
// § Data 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]
// Hints: Use tools from all lectures in this section so far �
// GOOD LUCK

// const checkDogs = function (arr) {
//   const copyArr = arr.slice();
//   copyArr.pop();
//   copyArr.shift();
// };
// const Julia = [3, 5, 2, 12, 7];
// const Kate = [4, 1, 15, 8, 3];
// checkDogs(Julia);
// const final = [...Julia, ...Kate];
// console.log(final);

// final.forEach((e, i) => {
//   if (e >= 3) {
//     console.log(`Dog number${i + 1} is an adult,and is ${e} year old`);
//   } else {
//     console.log(`Dog number${i + 1} is still a puppy `);
//   }
// });

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// const eurToUsd = 1.1;

// const movementsUsd = movements.map(function (mov) {
//   return mov * eurToUsd;
// });

// console.log(movements);
// console.log(movementsUsd);
// console.log(movements.map((e, i, arr) => arr));

// Let's go back to Julia and Kate's study about dogs. This time, they want to convert
// dog ages to human ages and calculate the average age of the dogs in their study.
// Your tasks:
// Create a function 'calcAverageHumanAge', which accepts an arrays of dog's
// ages ('ages'), and does the following things in order:
// 1. Calculate the dog age in human years using the following formula: if the dog is
// <= 2 years old, humanAge = 2 * dogAge. If the dog is > 2 years old,
// humanAge = 16 + dogAge * 4
// 2. Exclude all dogs that are less than 18 human years old (which is the same as
// keeping dogs that are at least 18 years old)
// 3. Calculate the average human age of all adult dogs (you should already know
// from other challenges how we calculate averages �)
// 4. Run the function for both test datasets
// Test data:
// § Data 1: [5, 2, 4, 1, 15, 8, 3]
// § Data 2: [16, 6, 10, 5, 6, 1, 4]
// const array = [5000, 3400, -150, -790, -3210, -1000, 8500, -30];
// console.log(array.find((e) => e < 0));

// console.log(accounts.find((e) => e.userName === 'js'));
// console.log(
//   accounts
//     .map((e) => e.movements)
//     .flat()
//     .reduce((acc, curr) => acc + curr, 0)
// );

// const allDeposit = accounts
//   .flatMap((e) => e.movements)
//   .reduce(
//     (prev, curr) =>
//       curr > 0
//         ? { ...prev, deposit: prev.deposit + curr }
//         : { ...prev, withdraw: prev.withdraw + curr },
//     { deposit: 0, withdraw: 0 }
//   );
// console.log(allDeposit);
// const convert = function (str) {
//   const newStr = str.split(' ').reduce((prev, curr) => {
//     curr[0].toUpperCase();
//     prev += curr;
//     return prev;
//   }, '');
//   return newStr;
// };
// console.log(convert('manh nguyen'));

// Julia and Kate are still studying dogs, and this time they are studying if dogs are
// eating too much or too little.
// Eating too much means the dog's current food portion is larger than the
// recommended portion, and eating too little is the opposite.
// Eating an okay amount means the dog's current food portion is within a range 10%
// above and 10% below the recommended portion (see hint).
// Your tasks:
// 1. Loop over the 'dogs' array containing dog objects, and for each dog, calculate
// the recommended food portion and add it to the object as a new property. Do
// not create a new array, simply loop over the array. Forumla:
// recommendedFood = weight ** 0.75 * 28. (The result is in grams of
// food, and the weight needs to be in kg)
//
// 3. Create an array containing all owners of dogs who eat too much
// ('ownersEatTooMuch') and an array with all owners of dogs who eat too little
// ('ownersEatTooLittle').
// 4. Log a string to the console for each array created in 3., like this: "Matilda and
// Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat
// too little!"
// 5. Log to the console whether there is any dog eating exactly the amount of food
// that is recommended (just true or false)
// 6. Log to the console whether there is any dog eating an okay amount of food
// (just true or false)
// 7. Create an array containing the dogs that are eating an okay amount of food (try
// to reuse the condition used in 6.)
// 8. Create a shallow copy of the 'dogs' array and sort it by recommended food
// portion in an ascending order (keep in mind that the portions are inside the
// array's objects �
// Hints:
// § Use many different tools to solve these challenges, you can use the summary
// lecture to choose between them �
// § Being within a range 10% above and below the recommended portion means:
// current > (recommended * 0.90) && current < (recommended *
// 1.10). Basically, the current portion should be between 90% and 110% of the
// recommended portion.
// Test data:
// const dogs = [
//   { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
//   { weight: 8, curFood: 200, owners: ['Matilda'] },
//   { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
//   { weight: 32, curFood: 340, owners: ['Michael'] },
// ];
// dogs.forEach((e) => (e.recommendFood = Math.trunc(e.weight ** 0.75 * 28)));

// const copyDogs = dogs.slice();
// // copyDogs[0].weight = 10;
// copyDogs.sort((a, b) => a.recommendFood - b.recommendFood);
// console.log(dogs);
// console.log(copyDogs);

/////////////////////////////////////////////////
