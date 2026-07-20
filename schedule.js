"use strict";

/* =========================================================
   VLORA & NORI VISUAL SCHEDULE — VERSION 2
   SECTION 1: SETTINGS, SCHEDULES, AND PAGE ELEMENTS
========================================================= */

const APP_CONFIG = {
  childName: "Vlora",
  upcomingTaskLimit: 5,
  weatherLatitude: 42.3314,
  weatherLongitude: -83.0458
};

/* =========================================================
   SCHEDULES
========================================================= */

const SCHEDULES = {
  weekdayTasks: [
    {
      time: "6:00",
      durationMinutes: 10,
      icon: "🛏️",
      title: "Wake Up",
      say: "Good morning Vlora. Time to wake up."
    },
    {
      time: "6:10",
      durationMinutes: 5,
      icon: "🚽",
      title: "Go Potty",
      say: "Go to the bathroom and wash your hands."
    },
    {
      time: "6:15",
      durationMinutes: 5,
      icon: "🪥",
      title: "Brush Teeth",
      say: "Brush your teeth, clean out the sink, and wipe your mouth!"
    },
    {
      time: "6:20",
      durationMinutes: 5,
      icon: "👕",
      title: "Get Dressed",
      say: "Get dressed and put your pajamas away!"
    },
    {
      time: "6:25",
      durationMinutes: 10,
      icon: "🪞",
      title: "Brush Your Hair",
      say: "Brush and do your hair!"
    },
    {
      time: "6:35",
      durationMinutes: 15,
      icon: "🥣",
      title: "Breakfast",
      say: "Fuel your body and brain!"
    },
    {
      time: "6:50",
      durationMinutes: 5,
      icon: "🎒",
      title: "Backpack Check",
      say: "Let's make sure you have everything!"
    },
    {
      time: "6:55",
      durationMinutes: 5,
      icon: "👟",
      title: "Shoes On",
      say: "Time to put on your shoes!"
    },
    {
      time: "7:00",
      durationMinutes: 10,
      icon: "🚪",
      title: "Let's Go",
      say: "Get in the car!"
    }
  ],

  stayHomeTasks: [
    {
      time: "7:00",
      durationMinutes: 15,
      icon: "🛏️",
      title: "Wake Up",
      say: "Good morning Vlora. Time to wake up."
    },
    {
      time: "7:15",
      durationMinutes: 10,
      icon: "🚽",
      title: "Potty & Wash Hands",
      say: "Go potty and wash your hands."
    },
    {
      time: "7:25",
      durationMinutes: 5,
      icon: "🪥",
      title: "Brush Teeth",
      say: "Brush your teeth and clean the sink."
    },
    {
      time: "7:30",
      durationMinutes: 10,
      icon: "👕",
      title: "Get Dressed",
      say: "Choose your clothes and put your pajamas away."
    },
    {
      time: "7:40",
      durationMinutes: 20,
      icon: "🥣",
      title: "Breakfast",
      say: "Time for a healthy breakfast."
    },
    {
      time: "8:00",
      durationMinutes: 20,
      icon: "🧸",
      title: "Play Time",
      say: "You may choose something fun to play."
    }
  ],

  bedtimeTasks: [
    {
      time: "19:00",
      durationMinutes: 10,
      icon: "🧸",
      title: "Clean Up",
      say: "Put your toys and belongings away."
    },
    {
      time: "19:10",
      durationMinutes: 15,
      icon: "🛁",
      title: "Bath Time",
      say: "Time to get clean and ready for bed."
    },
    {
      time: "19:25",
      durationMinutes: 5,
      icon: "👚",
      title: "Pajamas",
      say: "Put on your pajamas."
    },
    {
      time: "19:30",
      durationMinutes: 5,
      icon: "🪥",
      title: "
      
/* =========================================================
   SECTION 2: DATE, TIME, MODE, AND TASK HELPERS
========================================================= */

function getMinutesFromTime(time) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function getCurrentMinutes(date = new Date()) {
  return date.getHours() * 60 + date.getMinutes();
}

function formatTaskTime(time) {
  const [hours, minutes] = time.split(":").map(Number);
  const date = new Date();

  date.setHours(hours, minutes, 0, 0);

  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit"
  });
}

function formatCountdown(totalSeconds) {
  const safeSeconds = Math.max(0, Math.ceil(totalSeconds));
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function getGreeting(date = new Date()) {
  const hour = date.getHours();

  if (hour < 12) {
    return `Good morning, ${APP_CONFIG.childName}!`;
  }

  if (hour < 17) {
    return `Good afternoon, ${APP_CONFIG.childName}!`;
  }

  return `Good evening, ${APP_CONFIG.childName}!`;
}

function isWeekend(date = new Date()) {
  const day = date.getDay();
  return day === 0 || day === 6;
}

function determineMode(date = new Date()) {
  const minutesNow = getCurrentMinutes(date);

  if (minutesNow >= 18 * 60 + 30) {
    return "bedtime";
  }

  if (isWeekend(date)) {
    return "stayHome";
  }

  return "weekday";
}

function getTasksForMode(mode) {
  if (mode === "bedtime") {
    return SCHEDULES.bedtimeTasks;
  }

  if (mode === "stayHome") {
    return SCHEDULES.stayHomeTasks;
  }

  return SCHEDULES.weekdayTasks;
}

function getModeDisplay(mode) {
  if (mode === "bedtime") {
    return {
      message: `It's <span class="gradient-text">Bedtime!</span>`,
      progressTitle: "Bedtime Routine Progress",
      bodyClass: "bedtime-mode"
    };
  }

  if (mode === "stayHome") {
    return {
      message: `It's a <span class="gradient-text">Stay at Home Day!</span>`,
      progressTitle: "Morning Routine Progress",
      bodyClass: "stay-home-mode"
    };
  }

  return {
    message: `It's a <span class="gradient-text">School Day!</span>`,
    progressTitle: "Morning Routine Progress",
    bodyClass: "school-day-mode"
  };
}

function updateMode(date = new Date()) {
  const newMode = determineMode(date);

  if (newMode !== state.mode || state.tasks.length === 0) {
    state.mode = newMode;
    state.tasks = getTasksForMode(newMode);
    state.completedTaskIndexes.clear();
    state.currentTaskIndex = 0;
    state.lastRenderedTaskIndex = -1;
  }

  const display = getModeDisplay(state.mode);

  document.body.classList.remove(
    "school-day-mode",
    "stay-home-mode",
    "bedtime-mode"
  );

  document.body.classList.add(display.bodyClass);

  elements.greeting.textContent = getGreeting(date);
  elements.dayMessage.innerHTML = display.message;
  elements.progressTitle.textContent = display.progressTitle;
}

function updateClock(date = new Date()) {
  elements.currentTime.textContent = date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit"
  });

  elements.currentDate.textContent = date.toLocaleDateString([], {
    weekday: "long",
    month: "long",
    day: "numeric"
  });
}

function getTaskTiming(task, date = new Date()) {
  const startMinutes = getMinutesFromTime(task.time);
  const endMinutes = startMinutes + task.durationMinutes;
  const currentMinutes = getCurrentMinutes(date);
  const currentSeconds =
    date.getHours() * 3600 +
    date.getMinutes() * 60 +
    date.getSeconds();

  const startSeconds = startMinutes * 60;
  const endSeconds = endMinutes * 60;

  return {
    startMinutes,
    endMinutes,
    currentMinutes,
    secondsRemaining: endSeconds - currentSeconds,
    hasStarted: currentMinutes >= startMinutes,
    hasEnded: currentMinutes >= endMinutes
  };
}

function findCurrentTaskIndex(date = new Date()) {
  if (!state.tasks.length) {
    return 0;
  }

  const currentMinutes = getCurrentMinutes(date);

  for (let index = 0; index < state.tasks.length; index += 1) {
    const task = state.tasks[index];
    const start = getMinutesFromTime(task.time);
    const end = start + task.durationMinutes;

    if (currentMinutes >= start && currentMinutes < end) {
      return index;
    }

    if (currentMinutes < start) {
      return index;
    }
  }

  return state.tasks.length - 1;
}
/* =========================================================
   SECTION 3: CURRENT TASK AND UP NEXT
========================================================= */

function renderCurrentTask(date = new Date()) {
  if (!state.tasks.length) {
    return;
  }

  const taskIndex = findCurrentTaskIndex(date);
  const task = state.tasks[taskIndex];
  const timing = getTaskTiming(task, date);

  state.currentTaskIndex = taskIndex;

  elements.currentTaskIcon.textContent = task.icon;
  elements.currentTaskTitle.textContent = task.title;
  elements.currentTaskSpeech.textContent = task.say;

  if (!timing.hasStarted) {
    const secondsUntilStart =
      getMinutesFromTime(task.time) * 60 -
      (date.getHours() * 3600 +
        date.getMinutes() * 60 +
        date.getSeconds());

    elements.countdown.textContent = formatCountdown(secondsUntilStart);
    elements.countdownLabel.textContent = "UNTIL START";
  } else if (!timing.hasEnded) {
    elements.countdown.textContent = formatCountdown(
      timing.secondsRemaining
    );
    elements.countdownLabel.textContent = "REMAINING";
  } else {
    elements.countdown.textContent = "0:00";
    elements.countdownLabel.textContent = "TIME'S UP";
  }

  const elapsedSeconds = Math.max(
    0,
    task.durationMinutes * 60 - timing.secondsRemaining
  );

  const progress = Math.min(
    100,
    (elapsedSeconds / (task.durationMinutes * 60)) * 100
  );

  elements.timerRing.style.setProperty(
    "--timer-progress",
    `${progress * 3.6}deg`
  );

  elements.completeButton.disabled =
    state.completedTaskIndexes.has(taskIndex);

  elements.completeButton.textContent =
    state.completedTaskIndexes.has(taskIndex)
      ? "✓ Done!"
      : "✓ I did it!";

  if (state.lastRenderedTaskIndex !== taskIndex) {
    elements.currentTaskCard.classList.remove("task-change");

    requestAnimationFrame(() => {
      elements.currentTaskCard.classList.add("task-change");
    });

    state.lastRenderedTaskIndex = taskIndex;
  }
}

function renderUpcomingTasks(date = new Date()) {
  elements.taskList.innerHTML = "";

  const startIndex = state.currentTaskIndex + 1;
  const upcomingTasks = state.tasks.slice(
    startIndex,
    startIndex + APP_CONFIG.upcomingTaskLimit
  );

  if (!upcomingTasks.length) {
    const finishedMessage = document.createElement("div");
    finishedMessage.className = "empty-task-list";
    finishedMessage.innerHTML = `
      <span class="empty-task-icon">🎉</span>
      <strong>All finished!</strong>
      <span>Great job, ${APP_CONFIG.childName}!</span>
    `;

    elements.taskList.appendChild(finishedMessage);
    return;
  }

  upcomingTasks.forEach((task, offset) => {
    const taskIndex = startIndex + offset;
    const item = document.createElement("div");

    item.className = "upcoming-task";

    if (state.completedTaskIndexes.has(taskIndex)) {
      item.classList.add("completed");
    }

    item.innerHTML = `
      <div class="upcoming-task-icon">${task.icon}</div>

      <div class="upcoming-task-info">
        <strong>${task.title}</strong>
        <span>${formatTaskTime(task.time)}</span>
      </div>

      <div class="upcoming-task-duration">
        ${task.durationMinutes} min
      </div>
    `;

    elements.taskList.appendChild(item);
  });
}

function updateProgress() {
  const completedCount = state.completedTaskIndexes.size;
  const totalTasks = state.tasks.length;
  const percentage =
    totalTasks === 0 ? 0 : (completedCount / totalTasks) * 100;

  elements.progressFill.style.width = `${percentage}%`;
  elements.progressCount.textContent =
    `${completedCount} of ${totalTasks} complete`;

  elements.progressTrack.setAttribute(
    "aria-valuenow",
    String(Math.round(percentage))
  );
}

function renderSchedule(date = new Date()) {
  renderCurrentTask(date);
  renderUpcomingTasks(date);
  updateProgress();
}
/* =========================================================
   SECTION 4: BUTTONS, SPEECH, AND CELEBRATION
========================================================= */

function speakText(text) {
  if (!("speechSynthesis" in window)) {
    elements.encouragement.textContent =
      "Speech is not supported on this device.";
    return;
  }

  window.speechSynthesis.cancel();

  const message = new SpeechSynthesisUtterance(text);
  message.rate = 0.9;
  message.pitch = 1.05;
  message.volume = 1;

  window.speechSynthesis.speak(message);
}

function speakCurrentTask() {
  const task = state.tasks[state.currentTaskIndex];

  if (!task) {
    return;
  }

  speakText(task.say);
}

function showCelebration() {
  elements.celebration.classList.remove("show");

  requestAnimationFrame(() => {
    elements.celebration.classList.add("show");
  });

  window.setTimeout(() => {
    elements.celebration.classList.remove("show");
  }, 2200);
}

function completeCurrentTask() {
  const taskIndex = state.currentTaskIndex;
  const task = state.tasks[taskIndex];

  if (!task || state.completedTaskIndexes.has(taskIndex)) {
    return;
  }

  state.completedTaskIndexes.add(taskIndex);

  elements.encouragement.textContent =
    `Great job, ${APP_CONFIG.childName}!`;

  showCelebration();
  speakText(`Great job, ${APP_CONFIG.childName}!`);

  renderSchedule(new Date());
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen?.();
    return;
  }

  document.exitFullscreen?.();
}

function updateFullscreenButton() {
  elements.fullscreenButton.textContent =
    document.fullscreenElement ? "✕" : "⛶";

  elements.fullscreenButton.setAttribute(
    "aria-label",
    document.fullscreenElement
      ? "Exit fullscreen"
      : "Enter fullscreen"
  );
}

function attachEventListeners() {
  elements.sayButton.addEventListener("click", speakCurrentTask);
  elements.completeButton.addEventListener(
    "click",
    completeCurrentTask
  );

  elements.fullscreenButton.addEventListener(
    "click",
    toggleFullscreen
  );

  document.addEventListener(
    "fullscreenchange",
    updateFullscreenButton
  );
}

/* =========================================================
   SECTION 5: WEATHER, APP LOOP, AND STARTUP
========================================================= */

function getWeatherIcon(code, isDay = true) {
  if (code === 0) {
    return isDay ? "☀️" : "🌙";
  }

  if ([1, 2].includes(code)) {
    return isDay ? "🌤️" : "☁️";
  }

  if (code === 3) {
    return "☁️";
  }

  if ([45, 48].includes(code)) {
    return "🌫️";
  }

  if ([51, 53, 55, 56, 57].includes(code)) {
    return "🌦️";
  }

  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) {
    return "🌧️";
  }

  if ([71, 73, 75, 77, 85, 86].includes(code)) {
    return "❄️";
  }

  if ([95, 96, 99].includes(code)) {
    return "⛈️";
  }

  return "🌤️";
}

async function loadWeather() {
  const url =
    "https://api.open-meteo.com/v1/forecast" +
    `?latitude=${APP_CONFIG.weatherLatitude}` +
    `&longitude=${APP_CONFIG.weatherLongitude}` +
    "&current=temperature_2m,weather_code,is_day" +
    "&daily=temperature_2m_max,temperature_2m_min" +
    "&temperature_unit=fahrenheit" +
    "&timezone=auto" +
    "&forecast_days=1";

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Weather request failed.");
    }

    const weather = await response.json();

    const currentTemperature = Math.round(
      weather.current.temperature_2m
    );

    const highTemperature = Math.round(
      weather.daily.temperature_2m_max[0]
    );

    const lowTemperature = Math.round(
      weather.daily.temperature_2m_min[0]
    );

    elements.weatherIcon.textContent = getWeatherIcon(
      weather.current.weather_code,
      weather.current.is_day === 1
    );

    elements.currentTemperature.textContent =
      `${currentTemperature}°`;

    elements.highTemperature.textContent =
      `H: ${highTemperature}°`;

    elements.lowTemperature.textContent =
      `L: ${lowTemperature}°`;

    state.weatherLoaded = true;
  } catch (error) {
    console.error(error);

    elements.weatherIcon.textContent = "🌤️";
    elements.currentTemperature.textContent = "--°";
    elements.highTemperature.textContent = "H: --°";
    elements.lowTemperature.textContent = "L: --°";
  }
}

function updateApp() {
  const now = new Date();

  updateMode(now);
  updateClock(now);
  renderSchedule(now);
}

function startApp() {
  attachEventListeners();
  updateFullscreenButton();
  updateApp();
  loadWeather();

  window.setInterval(updateApp, 1000);

  window.setInterval(() => {
    loadWeather();
  }, 30 * 60 * 1000);
}

document.addEventListener("DOMContentLoaded", startApp);


      