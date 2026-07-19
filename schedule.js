/*
  Kid Visual Schedule Dashboard
  This file is the "brain" of the app.

  It controls:
  - Which kid is showing
  - Morning and bedtime routines
  - Current time/date
  - Weather from Open-Meteo
  - Weekday/weekend/federal holiday day type
  - Countdown timer
  - Late alarm
  - Progress and task checkoff

  TO EDIT MOST THINGS:
  Look for the KIDS object below.
*/

/* -----------------------------
   1. BASIC SETTINGS
------------------------------ */

// Durham, NC coordinates for Open-Meteo weather.
// You can change these later if you move or want a different weather location.
const WEATHER_LATITUDE = 35.9940;
const WEATHER_LONGITUDE = -78.8986;

// Weather updates every 20 minutes to avoid unnecessary calls.
const WEATHER_REFRESH_MINUTES = 20;

// Countdown/alarm behavior.
// Alarm plays immediately when the timer ends, lasts 10 seconds,
// then plays again once every minute while still late.
const ALARM_DURATION_SECONDS = 10;
const ALARM_REPEAT_MINUTES = 1;

// The app automatically switches to bedtime mode at or after this hour.
// 17 means 5:00 PM. Change to 18 for 6 PM, 19 for 7 PM, etc.
const BEDTIME_MODE_START_HOUR = 17;

// The purple SVG ring circumference.
// This matches r="108" in index.html:
// circumference = 2 * Math.PI * 108
const RING_CIRCUMFERENCE = 678.58;

/* -----------------------------
   2. EDITABLE KID SCHEDULES
------------------------------ */

/*
  Each child gets:
  - weekdayTasks: school morning
  - weekendTasks: stay-at-home morning
  - bedtimeTasks: evening/bedtime routine

  Each task has:
  - time: when it starts, shown in the list
  - durationMinutes: how long the child has to finish before it turns red
  - icon: emoji for now; later you can replace with image files
  - title: the task name
  - say: what the tablet says out loud
*/
const KIDS = {
  vlora: {
    name: "Vlora",

    weekdayTasks: [
      { time: "6:00", durationMinutes: 10, icon: "🛏️", title: "Wake Up", say: "Good morning Vlora. Time to wake up." },
      { time: "6:10", durationMinutes: 5, icon: "🚽", title: "Go Potty", say: "Go to the bathroom and wash your hands." },
      { time: "6:15", durationMinutes: 5, icon: "🪥", title: "Brush Teeth", say: "Brush your teeth, clean out the sink, and wipe your mouth!" },
      { time: "6:20", durationMinutes: 5, icon: "👕", title: "Get Dressed", say: "Get dressed and put your pajamas away!" },
      { time: "6:25", durationMinutes: 10, icon: "🪞", title: "Brush Your Hair", say: "Brush and do your hair!" },
      { time: "6:35", durationMinutes: 15, icon: "🥣", title: "Breakfast", say: "Fuel your body and brain!" },
      { time: "6:50", durationMinutes: 5, icon: "🎒", title: "Backpack Check", say: "Let's make sure you have everything!" },
      { time: "6:55", durationMinutes: 5, icon: "👟", title: "Shoes On", say: "Time to put on your shoes!" },
      { time: "7:00", durationMinutes: 10, icon: "🚪", title: "Let's Go", say: "Get in the car!" }
    ],

    weekendTasks: [
      { time: "8:00", durationMinutes: 10, icon: "🛏️", title: "Wake Up", say: "Good morning Vlora. Time to wake up." },
      { time: "8:10", durationMinutes: 10, icon: "🚽", title: "Potty", say: "Please go potty." },
      { time: "8:20", durationMinutes: 10, icon: "🦷", title: "Brush Teeth", say: "Let's make those smiles sparkle!" },
      { time: "8:30", durationMinutes: 10, icon: "👕", title: "Get Dressed", say: "Pick out something comfy!" },
      { time: "8:40", durationMinutes: 20, icon: "🥞", title: "Breakfast", say: "Time for breakfast!" },
      { time: "9:00", durationMinutes: 15, icon: "🎨", title: "Play Time", say: "Now it is time to play." }
    ],

    bedtimeTasks: [
      { time: "18:50", durationMinutes: 10, icon: "🧸", title: "Clean Up Toys", say: "Time to clean up your toys." },
      { time: "19:20", durationMinutes: 10, icon: "🛁", title: "Bath Time", say: "Time for bath." },
      { time: "19:30", durationMinutes: 10, icon: "🧴", title: "Pajamas", say: "Please put on your pajamas." },
      { time: "20:40", durationMinutes: 10, icon: "🦷", title: "Brush Teeth", say: "Let's brush teeth before bed." },
      { time: "20:50", durationMinutes: 10, icon: "📚", title: "Story Time", say: "Pick a book for story time." },
      { time: "20:00", durationMinutes: 10, icon: "🌙", title: "Lights Out", say: "Time to get cozy and rest." }
    ]
  },

  nori: {
    name: "Nori",

    weekdayTasks: [
      { time: "6:00", durationMinutes: 10, icon: "🛏️", title: "Wake Up", say: "Good morning Nori. Time to wake up." },
      { time: "6:10", durationMinutes: 10, icon: "🦷", title: "Brush Teeth", say: "Let's make those smiles sparkle!" },
      { time: "6:20", durationMinutes: 10, icon: "👗", title: "Get Dressed", say: "Pick out something comfy!" },
      { time: "6:30", durationMinutes: 15, icon: "🍓", title: "Breakfast", say: "Fuel your body and brain!" },
      { time: "6:45", durationMinutes: 10, icon: "🎒", title: "Backpack Check", say: "Let's make sure you have everything!" },
      { time: "6:55", durationMinutes: 5, icon: "👟", title: "Shoes On", say: "Time to put on your shoes!" },
      { time: "7:00", durationMinutes: 10, icon: "🚪", title: "Head Out", say: "Let's go!" }
    ],

    weekendTasks: [
      { time: "8:00", durationMinutes: 10, icon: "🛏️", title: "Wake Up", say: "Good morning Nori. Time to wake up." },
      { time: "8:10", durationMinutes: 10, icon: "🚽", title: "Potty", say: "Please go potty." },
      { time: "8:20", durationMinutes: 10, icon: "🦷", title: "Brush Teeth", say: "Let's make those smiles sparkle!" },
      { time: "8:30", durationMinutes: 10, icon: "👗", title: "Get Dressed", say: "Pick out something comfy!" },
      { time: "8:40", durationMinutes: 20, icon: "🥞", title: "Breakfast", say: "Time for breakfast!" },
      { time: "9:00", durationMinutes: 15, icon: "🧸", title: "Play Time", say: "Now it is time to play." }
    ],

    bedtimeTasks: [
      { time: "6:50", durationMinutes: 10, icon: "🧸", title: "Clean Up Toys", say: "Time to clean up your toys." },
      { time: "7:00", durationMinutes: 30, icon: "🛁", title: "Bath Time", say: "Time for bath." },
      { time: "7:30", durationMinutes: 10, icon: "🧴", title: "Pajamas", say: "Please put on your pajamas." },
      { time: "7:40", durationMinutes: 10, icon: "🦷", title: "Brush Teeth", say: "Let's brush teeth before bed." },
      { time: "7:50", durationMinutes: 10, icon: "📚", title: "Story Time", say: "Pick a book for story time." },
      { time: "8:00", durationMinutes: 10, icon: "🌙", title: "Lights Out", say: "Time to get cozy and rest." }
    ]
  }
};

/* -----------------------------
   3. FEDERAL HOLIDAY LOGIC
------------------------------ */

/*
  Weekdays are school days unless they are federal holidays.
  This function checks common US federal holidays.

  Note:
  If your school has teacher workdays or breaks, we can later add a custom
  "no school dates" list.
*/
function isFederalHoliday(date) {
  const year = date.getFullYear();

  const holidays = [
    observedDate(year, 0, 1),
    nthWeekdayOfMonth(year, 0, 1, 3),
    nthWeekdayOfMonth(year, 1, 1, 3),
    lastWeekdayOfMonth(year, 4, 1),
    observedDate(year, 5, 19),
    observedDate(year, 6, 4),
    nthWeekdayOfMonth(year, 8, 1, 1),
    nthWeekdayOfMonth(year, 9, 1, 2),
    observedDate(year, 10, 11),
    nthWeekdayOfMonth(year, 10, 4, 4),
    observedDate(year, 11, 25)
  ];

  return holidays.some(d => sameDate(d, date));
}

function observedDate(year, monthIndex, day) {
  const actual = new Date(year, monthIndex, day);
  const dayOfWeek = actual.getDay();

  if (dayOfWeek === 6) return new Date(year, monthIndex, day - 1);
  if (dayOfWeek === 0) return new Date(year, monthIndex, day + 1);

  return actual;
}

function nthWeekdayOfMonth(year, monthIndex, weekday, nth) {
  const date = new Date(year, monthIndex, 1);
  let count = 0;

  while (date.getMonth() === monthIndex) {
    if (date.getDay() === weekday) {
      count += 1;
      if (count === nth) return new Date(date);
    }
    date.setDate(date.getDate() + 1);
  }
}

function lastWeekdayOfMonth(year, monthIndex, weekday) {
  const date = new Date(year, monthIndex + 1, 0);

  while (date.getDay() !== weekday) {
    date.setDate(date.getDate() - 1);
  }

  return date;
}

function sameDate(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/* -----------------------------
   4. APP STATE
------------------------------ */

// Choose kid using the URL:
// index.html?kid=vlora
// index.html?kid=nori
const urlParams = new URLSearchParams(window.location.search);
const urlKid = urlParams.get("kid");
const kidKey = (urlKid || "vlora").toLowerCase();
const kid = KIDS[kidKey] || KIDS.vlora;

// Optional URL override:
// ?routine=morning
// ?routine=bedtime
const urlRoutine = urlParams.get("routine");

// Manual routine choice is used when the parent taps Morning/Bedtime buttons.
let manualRoutine = urlRoutine === "bedtime" || urlRoutine === "morning"
  ? urlRoutine
  : null;

// Weather cache so we don't refetch constantly.
let weatherCache = null;
let lastWeatherFetch = 0;

// Alarm state so it does not play continuously every second.
let alarmPlaying = false;
let lastAlarmMinutePlayed = null;

// Browser audio context for pleasant alarm tones.
let audioContext = null;

/* -----------------------------
   5. HTML ELEMENT REFERENCES
------------------------------ */

const els = {
  greetingText: document.getElementById("greetingText"),
  kidName: document.getElementById("kidName"),
  dayMessage: document.getElementById("dayMessage"),
  currentTime: document.getElementById("currentTime"),
  currentDate: document.getElementById("currentDate"),

  weatherIcon: document.getElementById("weatherIcon"),
  currentTemp: document.getElementById("currentTemp"),
  highTemp: document.getElementById("highTemp"),
  lowTemp: document.getElementById("lowTemp"),

  dayPills: document.getElementById("dayPills"),
  morningRoutineButton: document.getElementById("morningRoutineButton"),
  bedtimeRoutineButton: document.getElementById("bedtimeRoutineButton"),

  timerRing: document.getElementById("timerRing"),
  nowIcon: document.getElementById("nowIcon"),
  countdownTime: document.getElementById("countdownTime"),
  countdownLabel: document.getElementById("countdownLabel"),
  nowBadge: document.getElementById("nowBadge"),
  nowTitle: document.getElementById("nowTitle"),
  nowHint: document.getElementById("nowHint"),

  speakButton: document.getElementById("speakButton"),
  completeButton: document.getElementById("completeButton"),

  progressFill: document.getElementById("progressFill"),
  progressCount: document.getElementById("progressCount"),
  listTitle: document.getElementById("listTitle"),
  taskList: document.getElementById("taskList")
};

/* -----------------------------
   6. DATE / ROUTINE HELPERS
------------------------------ */

function isWeekend(date = new Date()) {
  return date.getDay() === 0 || date.getDay() === 6;
}

function isSchoolDay(date = new Date()) {
  return !isWeekend(date) && !isFederalHoliday(date);
}

// Automatically choose morning or bedtime.
// Morning shows before BEDTIME_MODE_START_HOUR.
// Bedtime shows at or after BEDTIME_MODE_START_HOUR.
function getActiveRoutine() {
  if (manualRoutine) return manualRoutine;

  const hour = new Date().getHours();
  return hour >= BEDTIME_MODE_START_HOUR ? "bedtime" : "morning";
}

function getTodayTasks() {
  const routine = getActiveRoutine();

  if (routine === "bedtime") {
    return kid.bedtimeTasks;
  }

  return isSchoolDay() ? kid.weekdayTasks : kid.weekendTasks;
}

function getDayMessage() {
  const routine = getActiveRoutine();

  if (routine === "bedtime") {
    return "It's Bedtime!";
  }

  return isSchoolDay() ? "It's a School Day!" : "It's a Stay at Home Day!";
}

function getGreetingText() {
  const routine = getActiveRoutine();

  if (routine === "bedtime") return "Good evening";
  return "Good morning";
}

function getFinishedMessage() {
  const routine = getActiveRoutine();

  if (routine === "bedtime") {
    return "Great job getting ready for bed";
  }

  return isSchoolDay()
    ? "Great job getting ready for school"
    : "Great job getting ready for the day";
}

function getStorageKey() {
  const dateKey = new Date().toISOString().slice(0, 10);
  const routine = getActiveRoutine();

  // Progress is saved separately for:
  // kid + date + routine.
  return `kidSchedule:${kidKey}:${dateKey}:${routine}`;
}

function getCompleted() {
  return JSON.parse(localStorage.getItem(getStorageKey()) || "[]");
}

function setCompleted(completed) {
  localStorage.setItem(getStorageKey(), JSON.stringify(completed));
}

function getCurrentTaskIndex(tasks) {
  const completed = getCompleted();
  const firstIncomplete = tasks.findIndex((_, index) => !completed.includes(index));
  return firstIncomplete === -1 ? tasks.length : firstIncomplete;
}

// Converts "6:10" to a Date object for today.
// Supports 24-hour strings like "14:30" too.
function timeStringToToday(timeString) {
  const [hours, minutes] = timeString.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
}

function formatTime(date) {
  const parts = date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit"
  }).split(" ");

  const time = parts[0];
  const ampm = parts[1] || "";

  return `${time}<span>${ampm}</span>`;
}

function formatDate(date) {
  return date.toLocaleDateString([], {
    weekday: "short",
    month: "short",
    day: "numeric"
  });
}

function formatTaskTime(timeString) {
  const date = timeStringToToday(timeString);
  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit"
  });
}

function formatCountdown(totalSeconds) {
  const absSeconds = Math.abs(totalSeconds);
  const minutes = Math.floor(absSeconds / 60);
  const seconds = absSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

/* -----------------------------
   7. WEATHER
------------------------------ */

/*
  Open-Meteo requires no API key.
  Weather code docs are mapped here to simple emoji icons.
*/
function weatherCodeToIcon(code) {
  if ([0].includes(code)) return "☀️";
  if ([1, 2].includes(code)) return "🌤️";
  if ([3].includes(code)) return "☁️";
  if ([45, 48].includes(code)) return "🌫️";
  if ([51, 53, 55, 56, 57].includes(code)) return "🌦️";
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "🌧️";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "❄️";
  if ([95, 96, 99].includes(code)) return "⛈️";
  return "⛅";
}

async function updateWeather() {
  const now = Date.now();
  const refreshMs = WEATHER_REFRESH_MINUTES * 60 * 1000;

  if (weatherCache && now - lastWeatherFetch < refreshMs) {
    renderWeather(weatherCache);
    return;
  }

  try {
    const url =
      `https://api.open-meteo.com/v1/forecast` +
      `?latitude=${WEATHER_LATITUDE}` +
      `&longitude=${WEATHER_LONGITUDE}` +
      `&current=temperature_2m,weather_code` +
      `&daily=temperature_2m_max,temperature_2m_min,weather_code` +
      `&temperature_unit=fahrenheit` +
      `&timezone=auto`;

    const response = await fetch(url);
    const data = await response.json();

    weatherCache = {
      currentTemp: Math.round(data.current.temperature_2m),
      weatherCode: data.current.weather_code,
      high: Math.round(data.daily.temperature_2m_max[0]),
      low: Math.round(data.daily.temperature_2m_min[0])
    };

    lastWeatherFetch = now;
    renderWeather(weatherCache);
  } catch (error) {
    els.weatherIcon.textContent = "⛅";
    els.currentTemp.textContent = "--°";
    els.highTemp.textContent = "--°";
    els.lowTemp.textContent = "--°";
  }
}

function renderWeather(weather) {
  els.weatherIcon.textContent = weatherCodeToIcon(weather.weatherCode);
  els.currentTemp.textContent = `${weather.currentTemp}°`;
  els.highTemp.textContent = `${weather.high}°`;
  els.lowTemp.textContent = `${weather.low}°`;
}

/* -----------------------------
   8. SPEECH AND ALARM
------------------------------ */

function speak(text) {
  if (!("speechSynthesis" in window)) return;

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.9;
  utterance.pitch = 1.05;

  window.speechSynthesis.speak(utterance);
}

/*
  Pleasant alarm:
  Uses soft bell-like notes instead of a harsh beep.
  Browsers usually require the user to tap once before audio can play.
  The "Say it" or "I did it" button tap will unlock audio on most devices.
*/
function ensureAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }

  if (audioContext.state === "suspended") {
    audioContext.resume();
  }
}

function playPleasantAlarm() {
  if (alarmPlaying) return;

  ensureAudioContext();
  alarmPlaying = true;

  const start = audioContext.currentTime;
  const notes = [523.25, 659.25, 783.99];
  const patternLength = 1.5;

  for (let t = 0; t < ALARM_DURATION_SECONDS; t += patternLength) {
    notes.forEach((frequency, index) => {
      const noteStart = start + t + index * 0.22;
      const noteEnd = noteStart + 0.18;

      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();

      oscillator.type = "sine";
      oscillator.frequency.value = frequency;

      gain.gain.setValueAtTime(0.0001, noteStart);
      gain.gain.exponentialRampToValueAtTime(0.08, noteStart + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, noteEnd);

      oscillator.connect(gain);
      gain.connect(audioContext.destination);

      oscillator.start(noteStart);
      oscillator.stop(noteEnd + 0.02);
    });
  }

  setTimeout(() => {
    alarmPlaying = false;
  }, ALARM_DURATION_SECONDS * 1000);
}

function maybePlayLateAlarm(secondsLate) {
  if (secondsLate <= 0) {
    lastAlarmMinutePlayed = null;
    return;
  }

  const minuteLate = Math.floor(secondsLate / 60);

  if (lastAlarmMinutePlayed !== minuteLate) {
    lastAlarmMinutePlayed = minuteLate;
    playPleasantAlarm();
  }
}

/* -----------------------------
   9. RENDERING THE SCREEN
------------------------------ */

function renderHeader() {
  const now = new Date();
  const message = getDayMessage();
  const emphasized = getActiveRoutine() === "bedtime"
    ? "Bedtime!"
    : isSchoolDay()
      ? "School Day!"
      : "Stay at Home Day!";

  els.greetingText.textContent = getGreetingText();
  els.kidName.textContent = kid.name;
  els.dayMessage.innerHTML = message.replace(emphasized, `<span>${emphasized}</span>`);
  els.currentTime.innerHTML = formatTime(now);
  els.currentDate.textContent = formatDate(now);
}

function renderDayPills() {
  const labels = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const today = new Date().getDay();

  els.dayPills.innerHTML = "";

  labels.forEach((label, index) => {
    const pill = document.createElement("div");
    pill.className = "day-pill";

    if (index === 0 || index === 6) {
      pill.classList.add("weekend");
    }

    if (index === today) {
      pill.classList.add("today");
    }

    pill.textContent = label;
    els.dayPills.appendChild(pill);
  });
}

function renderRoutineSwitcher() {
  const routine = getActiveRoutine();

  els.morningRoutineButton.classList.toggle("active", routine === "morning");
  els.bedtimeRoutineButton.classList.toggle("active", routine === "bedtime");
  document.body.classList.toggle("bedtime-mode", routine === "bedtime");
}

function renderCurrentTask(tasks, currentIndex) {
  const finished = currentIndex >= tasks.length;

  document.body.classList.toggle("finished", finished);

  if (finished) {
    els.nowIcon.textContent = getActiveRoutine() === "bedtime" ? "🌙" : "🎉";
    els.countdownTime.textContent = "Done";
    els.countdownLabel.textContent = "";
    els.nowBadge.textContent = "DONE";
    els.nowTitle.textContent = getFinishedMessage();
    els.nowHint.textContent = "You did it!";
    els.timerRing.classList.remove("late");
    els.countdownLabel.classList.remove("late");
    els.timerRing.style.strokeDashoffset = 0;
    return;
  }

  const task = tasks[currentIndex];
  const taskStart = timeStringToToday(task.time);
  const taskDue = new Date(taskStart.getTime() + task.durationMinutes * 60 * 1000);
  const now = new Date();

  const totalSeconds = task.durationMinutes * 60;
  const secondsUntilDue = Math.floor((taskDue - now) / 1000);
  const secondsLate = Math.max(0, -secondsUntilDue);
  const secondsRemaining = Math.max(0, secondsUntilDue);

  const isLate = secondsUntilDue < 0;
  const elapsedSeconds = Math.min(totalSeconds, Math.max(0, totalSeconds - secondsRemaining));
  const progressRatio = elapsedSeconds / totalSeconds;
  const dashOffset = RING_CIRCUMFERENCE * progressRatio;

  els.nowIcon.textContent = task.icon;
  els.nowBadge.textContent = "NOW";
  els.nowTitle.textContent = task.title;
  els.nowHint.textContent = task.say;

  els.timerRing.style.strokeDashoffset = dashOffset;
  els.timerRing.classList.toggle("late", isLate);
  els.countdownLabel.classList.toggle("late", isLate);

  if (isLate) {
    els.countdownTime.textContent = formatCountdown(secondsLate);
    els.countdownLabel.textContent = "late";
    maybePlayLateAlarm(secondsLate);
  } else {
    els.countdownTime.textContent = formatCountdown(secondsRemaining);
    els.countdownLabel.textContent = "until this is done";
    maybePlayLateAlarm(0);
  }
}

function renderProgress(tasks) {
  const completed = getCompleted();
  const total = tasks.length;
  const done = completed.length;
  const percent = total === 0 ? 0 : (done / total) * 100;

  els.progressFill.style.width = `${percent}%`;
  els.progressCount.textContent = `${done} / ${total}`;
}

function renderTaskList(tasks, currentIndex) {
  const completed = getCompleted();
  els.taskList.innerHTML = "";

  tasks.forEach((task, index) => {
    const row = document.createElement("button");
    row.type = "button";
    row.className = "task-row";

    const isDone = completed.includes(index);
    const isCurrent = index === currentIndex;

    if (isDone) row.classList.add("done");
    if (isCurrent) row.classList.add("current");

    row.innerHTML = `
      <div class="status-dot">${isDone ? "✓" : ""}</div>
      <div class="task-time">${formatTaskTime(task.time)}</div>
      <div class="task-emoji">${task.icon}</div>
      <div>
        <div class="task-title">${task.title}</div>
        <div class="task-subtitle">${task.say}</div>
      </div>
      <div class="chevron">›</div>
    `;

    row.addEventListener("click", () => {
      ensureAudioContext();

      const updatedCompleted = getCompleted();

      if (updatedCompleted.includes(index)) {
        setCompleted(updatedCompleted.filter(i => i !== index));
      } else {
        updatedCompleted.push(index);
        updatedCompleted.sort((a, b) => a - b);
        setCompleted(updatedCompleted);
      }

      render();
    });

    els.taskList.appendChild(row);
  });
}

function render() {
  const tasks = getTodayTasks();
  const currentIndex = getCurrentTaskIndex(tasks);

  renderHeader();
  renderDayPills();
  renderRoutineSwitcher();
  renderCurrentTask(tasks, currentIndex);
  renderProgress(tasks);
  renderTaskList(tasks, currentIndex);
}

/* -----------------------------
   10. BUTTONS
------------------------------ */

els.morningRoutineButton.addEventListener("click", () => {
  manualRoutine = "morning";
  render();
});

els.bedtimeRoutineButton.addEventListener("click", () => {
  manualRoutine = "bedtime";
  render();
});

els.speakButton.addEventListener("click", () => {
  ensureAudioContext();

  const tasks = getTodayTasks();
  const currentIndex = getCurrentTaskIndex(tasks);
  const task = tasks[currentIndex];

  if (task) {
    let intro;

    if (getActiveRoutine() === "bedtime") {
      intro = `Good evening ${kid.name}. It is bedtime.`;
    } else {
      intro = isSchoolDay()
        ? `Good morning ${kid.name}. It's a school day.`
        : `Good morning ${kid.name}. It's a stay at home day.`;
    }

    speak(`${intro} ${task.say}`);
  } else {
    speak(getFinishedMessage());
  }
});

els.completeButton.addEventListener("click", () => {
  ensureAudioContext();

  const tasks = getTodayTasks();
  const currentIndex = getCurrentTaskIndex(tasks);
  const completed = getCompleted();

  if (currentIndex < tasks.length && !completed.includes(currentIndex)) {
    completed.push(currentIndex);
    completed.sort((a, b) => a - b);
    setCompleted(completed);
  }

  render();
});

/* -----------------------------
   11. START APP
------------------------------ */

render();
updateWeather();

setInterval(render, 1000);
setInterval(updateWeather, 60 * 1000);
