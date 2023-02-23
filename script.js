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
  modalTitle,
  modalDate,
  modalBody,
  menageTaskDiv,
  modalTaskList,
  colors,
  taskInput,
  addTaskBtn,
  editTaskBtn,
  deleteTaskBtn,
  closeModalBtn,
  cancelModalBtn,
  overlay,
  toggleHolidays,
  holidaysBtn,
  alertDanger,
  errorModal;

const tasks = [];

let holidays = false;
let fetchedHolidays = false;
const holidaysArr = [];

const BASE_CALENDAR_URL = "https://www.googleapis.com/calendar/v3/calendars";
const BASE_CALENDAR_ID_FOR_PUBLIC_HOLIDAY = "holiday@group.v.calendar.google.com";
const API_KEY = "AIzaSyCfa6Z2rd53maV9Sk1AReVUuRWO7yM9fqA";
const CALENDAR_REGION = "pl.polish";

const url = `${BASE_CALENDAR_URL}/${CALENDAR_REGION}%23${BASE_CALENDAR_ID_FOR_PUBLIC_HOLIDAY}/events?key=${API_KEY}`;

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
  modalTitle = document.querySelector(".modal-header .title");
  modalDate = document.querySelector(".modal-date");
  modalBody = document.querySelector(".modal .modal-body");
  menageTaskDiv = document.querySelector(".modal-body .menage-task");
  modalTaskList = document.querySelector(".modal-body .task-list");
  closeModalBtn = document.querySelector("[data-close-button]");
  errorModal = document.querySelector(".modal .error");
  colors = document.querySelectorAll(".select-color");
  taskInput = document.querySelector("input.task-title");
  addTaskBtn = document.querySelector(".button-add");
  editTaskBtn = document.querySelector(".button-save");
  cancelModalBtn = document.querySelector(".button-cancel");
  deleteTaskBtn = document.querySelector(".button-delete");
  overlay = document.getElementById("overlay");
  alertDanger = document.querySelector(".alert-danger");

  toggleHolidays = document.querySelector(".toggle");
};

const prepareDOMEvents = () => {
  todayBtn.addEventListener("click", goToCurrentDate);
  previousMonthBtn.addEventListener("click", previousMonth);
  nextMonthBtn.addEventListener("click", nextMonth);

  colors.forEach((color) => {
    color.addEventListener("click", selectColor);
  });
  taskInput.addEventListener("keyup", enterKeyCheck);
  addTaskBtn.addEventListener("click", addTask);
  editTaskBtn.addEventListener("click", editTask);
  deleteTaskBtn.addEventListener("click", deleteTask);
  closeModalBtn.addEventListener("click", closeModal);
  cancelModalBtn.addEventListener("click", closeModal);
  overlay.addEventListener("click", closeModal);
  //holidaysBtn.addEventListener("click", getHolidays);
  toggleHolidays.addEventListener("click", showHolidays);
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
    taskList.classList.add("task-list");

    tasks.forEach((task) => {
      if (task.date === el.date.toLocaleDateString()) {
        task.tasks.forEach((task) => {
          if (!task.holiday || (task.holiday === true && holidays === true)) {
            const newTask = document.createElement("div");
            newTask.dataset.id = task.id;
            newTask.classList.add("task");
            newTask.classList.add(task.color);
            newTask.textContent = task.title;

            taskList.append(newTask);
          }
        });

        if (task.tasks.length > 2) {
          const moreTasks = document.createElement("div");
          moreTasks.classList.add("more-tasks");
          moreTasks.textContent = `+${task.tasks.length - 2} more`;
          taskList.append(moreTasks);
        }
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

    const color = document.querySelector(".colors .active");

    const newTask = {
      id: new Date().getTime(),
      title: taskInput.value,
      color: color.firstChild.classList[1],
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

    renderCalendar();
    closeModal();
  } else {
    errorModal.innerText = "Error. The task title cannot be empty";
    errorModal.classList.remove("hide");
  }
};
const editTask = () => {
  const dataId = parseInt(taskInput.dataset.id);

  const color = document.querySelector(".colors .active");

  tasks.forEach((task) => {
    if (task.date === new Date(modalDate.getAttribute("data-date")).toLocaleDateString()) {
      task.tasks.forEach((task) => {
        if (task.id === dataId) {
          task.title = taskInput.value;
          task.color = color.firstChild.classList[1];
        }
      });
    }
  });

  renderCalendar();
  closeModal();
};

const deleteTask = () => {
  const dataId = parseInt(taskInput.dataset.id);

  tasks.forEach((task) => {
    if (task.date === new Date(modalDate.getAttribute("data-date")).toLocaleDateString()) {
      task.tasks.forEach((item, index) => {
        if (item.id === dataId) {
          task.tasks.splice(index, 1);
        }
      });
      //if no events left in a day then remove that day from tasks array
      if (task.tasks.length === 0) {
        tasks.splice(tasks.indexOf(task), 1);
      }
    }
  });

  renderCalendar();
  closeModal();
};

const checkClick = (e) => {
  if (e.target.matches(".day") || e.target.matches(".cell")) {
    openModal(e);
  } else if (e.target.matches(".task")) {
    colors.forEach((color) => {
      if (color.firstChild.classList[1] === e.target.classList[1]) {
        color.classList.add("active");
      } else {
        color.classList.remove("active");
      }
    });
    openModal(e, true);
  } else if (e.target.matches(".more-tasks")) {
    openMoreTaskModal(e);
  }
};

async function getHolidays() {
  try {
    const res = await fetch(url);
    const data = await res.json();
    holidaysArr.push(...data.items);

    holidaysArr.forEach((holiday) => {
      const holidayDate = new Date(holiday.start.date);
      const newTask = {
        id: new Date().getTime(),
        title: holiday.summary,
        color: "sky",
        holiday: true,
      };

      let taskAdded = false;
      tasks.forEach((element) => {
        const taskDate = new Date(element.date);
        if (taskDate.toLocaleDateString() === holidayDate.toLocaleDateString()) {
          element.tasks.push(newTask);
          taskAdded = true;
        }
      });

      if (!taskAdded) {
        tasks.push({
          date: holidayDate.toLocaleDateString(),
          tasks: [newTask],
        });
      }
    });

    fetchedHolidays = true;
    toggleHolidays.classList.toggle("active");
    holidays = !holidays;

    renderCalendar();
  } catch {
    alertDanger.classList.remove("hide");
    alertDanger.innerHTML = `<span class="title">Alert!</span> Failed to retrieve data from google api. Check that you have entered the correct API_KEY.`;
    console.error("Failed to retrieve data from google api");
  }
}

const showHolidays = () => {
  if (fetchedHolidays === false) {
    getHolidays();
  } else {
    toggleHolidays.classList.toggle("active");
    holidays = !holidays;
    renderCalendar();
  }
};

const selectColor = (e) => {
  colors.forEach((color) => {
    color.classList.remove("active");
  });
  e.currentTarget.classList.add("active");
};

const refreshDaysEventListeners = () => {
  Array.prototype.forEach.call(days, function (day) {
    day.addEventListener("click", checkClick);
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

const openModal = (e, edit = false) => {
  modalTaskList.innerHTML = "";
  menageTaskDiv.classList.remove("hide");
  if (edit) {
    modalTitle.textContent = "Edit task";

    taskInput.value = e.target.textContent;
    taskInput.dataset.id = e.target.dataset.id;

    addTaskBtn.classList.add("hide");
    editTaskBtn.classList.remove("hide");
    deleteTaskBtn.classList.remove("hide");
    cancelModalBtn.classList.remove("hide");
  } else {
    modalTitle.textContent = "Add task";

    addTaskBtn.classList.remove("hide");
    editTaskBtn.classList.add("hide");
    deleteTaskBtn.classList.add("hide");
    cancelModalBtn.classList.remove("hide");

    taskInput.removeAttribute("data-id");
  }

  if (!e.target.hasAttribute("data-id")) {
    const date = new Date(e.currentTarget.children[0].firstChild.getAttribute("data-date"));

    modalDate.textContent = date.toLocaleDateString();
    modalDate.dataset.date = date;
  }

  modal.classList.add("active");
  overlay.classList.add("active");
};

const openMoreTaskModal = (e) => {
  const date = new Date(e.currentTarget.children[0].firstChild.getAttribute("data-date"));

  modalTitle.textContent = "Task List";
  modalDate.textContent = date.toLocaleDateString();
  modalDate.dataset.date = date;

  menageTaskDiv.classList.add("hide");
  addTaskBtn.classList.add("hide");
  editTaskBtn.classList.add("hide");
  deleteTaskBtn.classList.add("hide");

  modal.classList.add("active");
  overlay.classList.add("active");

  modalTaskList.innerHTML = "";

  tasks.forEach((task) => {
    if (task.date === date.toLocaleDateString()) {
      task.tasks.forEach((task) => {
        const newTask = document.createElement("div");
        newTask.dataset.id = task.id;
        newTask.classList.add("task");
        newTask.classList.add(task.color);
        newTask.textContent = task.title;

        modalTaskList.append(newTask);
      });
    }
  });
  modalBody.append(modalTaskList);

  const taskListListener = document.querySelectorAll(".modal-body .task");

  taskListListener.forEach((task) => {
    task.addEventListener("click", checkClick);
  });
};

const closeModal = () => {
  taskInput.value = "";
  errorModal.classList.add("hide");

  modal.classList.remove("active");
  overlay.classList.remove("active");
};

const enterKeyCheck = (e) => {
  if (e.key === "Enter") {
    if (taskInput.hasAttribute("data-id")) {
      editTask();
    } else {
      addTask();
    }
  }
};

document.addEventListener("DOMContentLoaded", main);
