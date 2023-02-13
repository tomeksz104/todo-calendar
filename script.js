let date = new Date();

let firstDayofMonth,
  lastDayofMonth,
  lastDateofLastMonth,
  currentMonthText,
  currentYearText,
  dayRow,
  previousMonthBtn,
  nextMonthBtn,
  newDay;

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const weekDay = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const main = () => {
  prepareDOMElements();
  prepareDOMEvents();

  renderCalendar();
};

const prepareDOMElements = () => {
  currentMonthText = document.querySelector(".current-month-year .month");
  currentYearText = document.querySelector(".current-month-year .year");
  dayRow = document.querySelectorAll("td");

  previousMonthBtn = document.querySelector("button.previous-month");
  nextMonthBtn = document.querySelector("button.next-month");
};

const prepareDOMEvents = () => {
  previousMonthBtn.addEventListener("click", previousMonth);
  nextMonthBtn.addEventListener("click", nextMonth);
};

const renderCalendar = () => {
  firstDayofMonth = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  lastDayofMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  lastDateofLastMonth = new Date(date.getFullYear(), date.getMonth(), 0).getDate();

  currentMonthText.innerText = months[date.getMonth()];
  currentYearText.textContent = date.getFullYear();

  let day = 1,
    nextMonthDay = 1;

  for (let i = 0; i < dayRow.length; i++) {
    if (i < firstDayofMonth - 1) {
      createDate(i, lastDateofLastMonth + i - (firstDayofMonth - 2));
    } else if (day <= lastDayofMonth) {
      if (
        day === new Date().getDate() &&
        date.getMonth() === new Date().getMonth() &&
        date.getYear() === new Date().getYear()
      ) {
        console.log(date.getDate());
        createDate(i, day++, (current = true), (currentDay = true));
      } else {
        createDate(i, day++, (current = true));
      }
    } else {
      createDate(i, nextMonthDay++);
    }
  }
};

const createDate = (i, day, current = false, currentDay = false) => {
  dayRow[i].innerHTML = "";

  newDay = document.createElement("div");
  newDay.classList.add("day");

  const monthDay = document.createElement("span");
  monthDay.classList.add("monthday");
  monthDay.textContent = day;

  if (current === false) {
    monthDay.classList.add("not-current");
  } else if (currentDay === true) {
    monthDay.classList.add("circle");
    monthDay.classList.add("today");
  }

  newDay.append(monthDay);

  if (i <= 6) {
    const addWeekDay = document.createElement("span");
    addWeekDay.classList.add("weekday");
    addWeekDay.textContent = weekDay[i];
    newDay.append(addWeekDay);
  }

  dayRow[i].append(newDay);
};

const previousMonth = () => {
  date.setMonth(date.getMonth() - 1);
  renderCalendar();
};

const nextMonth = () => {
  date.setMonth(date.getMonth() + 1);
  renderCalendar();
};

document.addEventListener("DOMContentLoaded", main);
