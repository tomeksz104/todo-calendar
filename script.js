let date = new Date();

let firstDayofMonth,
  lastDayofMonth,
  lastDateofLastMonth,
  currentMonthText,
  currentYearText,
  calendarBody,
  days,
  todayBtn,
  previousMonthBtn,
  nextMonthBtn,
  modal,
  modalDate,
  saveTaskBtn,
  closeModalBtn,
  cancelModalBtn,
  overlay;

const tasks = [];

const eventsArr = [
  {
    date: "18.02.2023",
    events: [
      {
        title: "Event 1 lorem ipsun dolar sit genfa tersd dsad ",
        time: "10:00 AM",
      },
      {
        title: "Event 2",
        time: "11:00 AM",
      },
    ],
  },
  {
    date: new Date().toLocaleDateString(),
    events: [
      {
        title: "Event 1 lorem ipsun dolar sit genfa tersd dsad ",
        time: "10:00 AM",
      },
      {
        title: "Event 2",
        time: "11:00 AM",
      },
    ],
  },
];

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
  renderCalendar();
  prepareDOMEvents();
};

const prepareDOMElements = () => {
  currentMonthText = document.querySelector(".current-date .month");
  currentYearText = document.querySelector(".current-date .year");
  calendarBody = document.querySelector(".calendar-body");
  days = calendarBody.getElementsByClassName("cell");

  todayBtn = document.querySelector("button.today-button");
  previousMonthBtn = document.querySelector("button.previous-month");
  nextMonthBtn = document.querySelector("button.next-month");

  modal = document.querySelector(".modal");
  modalDate = document.querySelector(".modal-date");
  closeModalBtn = document.querySelector("[data-close-button]");
  saveTaskBtn = document.querySelector(".button-save");
  cancelModalBtn = document.querySelector(".button-cancel");
  overlay = document.getElementById("overlay");
  taskInput = document.querySelector("input.task-name");
};

const prepareDOMEvents = () => {
  todayBtn.addEventListener("click", goToCurrentDate);
  previousMonthBtn.addEventListener("click", previousMonth);
  nextMonthBtn.addEventListener("click", nextMonth);

  saveTaskBtn.addEventListener("click", addTask);
  closeModalBtn.addEventListener("click", closeModal);
  cancelModalBtn.addEventListener("click", closeModal);
  overlay.addEventListener("click", closeModal);
};

const getPreviousMonthDays = (date) => {
  const array = [];
  const month = date.getMonth();
  const year = date.getFullYear();
  const firstDayofMonth = new Date(year, month, 1).getDay();
  const lastDayofLastMonth = new Date(year, month, 0).getDate();

  for (let i = lastDayofLastMonth - firstDayofMonth + 2; i <= lastDayofLastMonth; i++) {
    array.push({
      day: i,
      current: false,
      date: new Date(year, month - 1, i),
    });
  }

  return array;
};

const getCurrentMonthDays = (date) => {
  const array = [];
  const month = date.getMonth();
  const year = date.getFullYear();
  const lastDayofMonth = new Date(year, month + 1, 0).getDate();

  for (let i = 1; i <= lastDayofMonth; i++) {
    array.push({
      day: i,
      current: true,
      date: new Date(year, month, i),
    });
  }

  return array;
};

const getNextMonthDays = (previousMonth, currentMonth) => {
  const array = [];
  const month = date.getMonth();
  const year = date.getFullYear();
  const days = previousMonth.length + currentMonth.length;

  for (let i = 1; i <= 42 - days; i++) {
    array.push({
      day: i,
      current: false,
      date: new Date(year, month + 1, i),
    });
  }

  return array;
};

const renderCalendar = () => {
  currentMonthText.innerText = months[date.getMonth()];
  currentYearText.textContent = date.getFullYear();

  const previousMonthDays = getPreviousMonthDays(date);
  const currentMonthDays = getCurrentMonthDays(date);
  const nextMonthDays = getNextMonthDays(previousMonthDays, currentMonthDays);

  const calendar = [...previousMonthDays, ...currentMonthDays, ...nextMonthDays];

  calendarBody.innerHTML = "";

  calendar.forEach((el) => {
    const newDayRow = document.createElement("div");
    newDayRow.classList.add("cell");

    const dayDiv = document.createElement("div");
    dayDiv.classList.add("day");

    const monthDay = document.createElement("span");
    monthDay.classList.add("monthday");
    monthDay.textContent = el.day;
    monthDay.dataset.date = el.date;

    if (el.current === false) {
      monthDay.classList.add("not-current");
    }

    if (isCurrentDay(el.date) === true) {
      monthDay.classList.add("circle");
      monthDay.classList.add("today");
    }

    const taskList = document.createElement("div");
    taskList.classList.add("event-list");

    tasks.forEach((task) => {
      if (task.date === el.date.toLocaleDateString()) {
        task.tasks.forEach((task) => {
          const newTask = document.createElement("div");
          newTask.classList.add("event");
          newTask.classList.add("yellow");
          newTask.textContent = task.title;

          taskList.append(newTask);
        });
      }
    });

    dayDiv.append(monthDay);
    newDayRow.append(dayDiv, taskList);

    calendarBody.append(newDayRow);
  });

  for (let i = 0; i <= weekDay.length; i++) {
    const addWeekDay = document.createElement("span");
    addWeekDay.classList.add("weekday");
    addWeekDay.textContent = weekDay[i];
    days[i].querySelector(".day").append(addWeekDay);
  }

  refreshDaysEventListeners();
};

const addTask = () => {
  if (taskInput.value.trim() !== "") {
    const date = new Date(modalDate.getAttribute("data-date")).toLocaleDateString();

    const newTask = {
      title: taskInput.value,
    };

    let taskAdded = false;
    tasks.forEach((element) => {
      if (element.date === date) {
        element.tasks.push(newTask);
        taskAdded = true;
      }
    });

    if (!taskAdded) {
      tasks.push({
        date,
        tasks: [newTask],
      });
    }

    taskInput.value = "";
    renderCalendar();
    closeModal();
  }
};

const refreshDaysEventListeners = () => {
  Array.prototype.forEach.call(days, function (day) {
    day.addEventListener("click", openModal);
  });
};

const isCurrentDay = (date) => {
  const today = new Date();

  if (
    date.getDate() == today.getDate() &&
    date.getMonth() == today.getMonth() &&
    date.getFullYear() == today.getFullYear()
  )
    return true;
};

const goToCurrentDate = () => {
  date = new Date();
  renderCalendar();
};

const previousMonth = () => {
  date.setMonth(date.getMonth() - 1);
  renderCalendar();
};

const nextMonth = () => {
  date.setMonth(date.getMonth() + 1);
  renderCalendar();
};

const openModal = (e) => {
  const date = new Date(e.currentTarget.children[0].firstChild.getAttribute("data-date"));

  modal.classList.add("active");
  overlay.classList.add("active");

  modalDate.textContent = date.toLocaleDateString();
  modalDate.dataset.date = date;
};

const closeModal = () => {
  modal.classList.remove("active");
  overlay.classList.remove("active");
};

document.addEventListener("DOMContentLoaded", main);
