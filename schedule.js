/*
  Kid Visual Schedule

  HOW TO EDIT:
  1. Change KID_NAME.
  2. Edit the weekdayTasks and weekendTasks arrays.
  3. Open index.html in a browser.
  4. For two kids, duplicate this folder and change KID_NAME/tasks,
     or use ?kid=Vlora / ?kid=Nori and add separate configs below.

  Hosting ideas:
  - GitHub Pages
  - Cloudflare Pages
  - Netlify free tier
*/

const KID_NAME = "Vlora";

const WEATHER_LAT = 35.9229155;
const WEATHER_LON = -78.9018444;

// Optional: change by URL, example: index.html?kid=Nori
const urlKid = new URLSearchParams(window.location.search).get("kid");

const schedules = {
  Vlora: {
    name: "Vlora",
    weekdayGreeting: "Good morning Vlora. It is a school day.",
    weekendGreeting: "Good morning Vlora. It is a stay at home day.",
    doneMessage: "Great job Vlora! You are ready.",
    weekdayTasks: [
      { time: "7:00", icon: "🛏️", title: "Wake up", say: "It's time to wake up." },
      { time: "7:05", icon: "🚽", title: "Potty", say: "It's time go potty." },
      { time: "7:10", icon: "🦷", title: "Brush teeth", say: "It's time to brush your teeth." },
      { time: "7:15", icon: "👕", title: "Get dressed", say: "It's time to get dressed." },
      { time: "7:25", icon: "🍳", title: "Breakfast", say: "It's time for breakfast." },
      { time: "7:40", icon: "👟", title: "Shoes", say: "Please put on your shoes." },
      { time: "7:45", icon: "🎒", title: "Backpack", say: "Please get your backpack." }
    ],
    weekendTasks: [
      { time: "8:00", icon: "🛏️", title: "Wake up", say: "Time to wake up." },
      { time: "8:10", icon: "🚽", title: "Potty", say: "Please go potty." },
      { time: "8:15", icon: "🦷", title: "Brush teeth", say: "Time to brush your teeth." },
      { time: "8:20", icon: "👕", title: "Get dressed", say: "Time to get dressed." },
      { time: "8:30", icon: "🥞", title: "Breakfast", say: "Time for breakfast." },
      { time: "9:00", icon: "🎨", title: "Play", say: "Now it is time to play." }
    ]
  },

  Nori: {
    name: "Nori",
    weekdayGreeting: "Good morning Nori. It is a school day.",
    weekendGreeting: "Good morning Nori. It is a stay at home day.",
    doneMessage: "Great job Nori! You are ready.",
    weekdayTasks: [
      { time: "7:00", icon: "🛏️", title: "Wake up", say: "Time to wake up." },
      { time: "7:05", icon: "🚽", title: "Potty", say: "Please go potty." },
      { time: "7:10", icon: "🦷", title: "Brush teeth", say: "Time to brush your teeth." },
      { time: "7:15", icon: "👗", title: "Get dressed", say: "Time to get dressed." },
      { time: "7:25", icon: "🍓", title: "Breakfast", say: "Time for breakfast." },
      { time: "7:40", icon: "👟", title: "Shoes", say: "Please put on your shoes." },
      { time: "7:45", icon: "🎒", title: "Backpack", say: "Please get your backpack." }
    ],
    weekendTasks: [
      { time: "8:00", icon: "🛏️", title: "Wake up", say: "Time to wake up." },
      { time: "8:10", icon: "🚽", title: "Potty", say: "Please go potty." },
      { time: "8:15", icon: "🦷", title: "Brush teeth", say: "Time to brush your teeth." },
      { time: "8:20", icon: "👗", title: "Get dressed", say: "Time to get dressed." },
      { time: "8:30", icon: "🥞", title: "Breakfast", say: "Time for breakfast." },
      { time: "9:00", icon: "🧸", title: "Play", say: "Now it is time to play." }
    ]
  }
};

const activeKey = (urlKid || KID_NAME).toUpperCase();
const config = schedules[activeKey] || schedules.Vlora;

const todayKey = new Date().toISOString().slice(0, 10);
const storageKey = `kidSchedule:${config.name}:${todayKey}`;
let completed = JSON.parse(localStorage.getItem(storageKey) || "[]");

const els = {
  kidName: document.getElementById("kidName"),
  dayType: document.getElementById("dayType"),
  nowIcon: document.getElementById("nowIcon"),
  nowTitle: document.getElementById("nowTitle"),
  nowHint: document.getElementById("nowHint"),
  taskList: document.getElementById("taskList"),
  completeButton: document.getElementById("completeButton"),
  speakButton: document.getElementById("speakButton"),
  doneScreen: document.getElementById("doneScreen"),
  doneMessage: document.getElementById("doneMessage"),
  resetButton: document.getElementById("resetButton")
};

function isWeekend() {
  const day = new Date().getDay();
  return day === 0 || day === 6;
}

function getTasks() {
  return isWeekend() ? config.weekendTasks : config.weekdayTasks;
}

function getCurrentIndex(tasks) {
  const firstIncomplete = tasks.findIndex((_, index) => !completed.includes(index));
  return firstIncomplete === -1 ? tasks.length : firstIncomplete;
}

function saveProgress() {
  localStorage.setItem(storageKey, JSON.stringify(completed));
}

function speak(text) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.9;
  utterance.pitch = 1.05;
  window.speechSynthesis.speak(utterance);
}

async function updateDayTimeWeather() {
  const dayLabel = isWeekend() ? "🏡 Home day" : "It's a School Day";

  const now = new Date();
  const timeText = now.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit"
  });

  els.dayType.textContent = `${dayLabel} | ${timeText} | Weather loading…`;

  try {
    const url =
      `https://api.open-meteo.com/v1/forecast` +
      `?latitude=${WEATHER_LAT}` +
      `&longitude=${WEATHER_LON}` +
      `&daily=temperature_2m_max,temperature_2m_min` +
      `&temperature_unit=fahrenheit` +
      `&timezone=auto`;

    const response = await fetch(url);
    const data = await response.json();

    const high = Math.round(data.daily.temperature_2m_max[0]);
    const low = Math.round(data.daily.temperature_2m_min[0]);

    els.dayType.textContent = `${dayLabel} | ${timeText} | High ${high}° / Low ${low}°`;
  } catch (error) {
    els.dayType.textContent = `${dayLabel} | ${timeText}`;
  }
}

function render() {
  const tasks = getTasks();
  const currentIndex = getCurrentIndex(tasks);
  const currentTask = tasks[currentIndex];

  els.kidName.textContent = `${config.name}'s Schedule`;
  els.dayType.textContent = isWeekend() ? "Weekend day" : "It's a School Day!";
  els.doneMessage.textContent = config.doneMessage;

  if (!currentTask) {
    els.doneScreen.classList.remove("hidden");
    speak(config.doneMessage);
    return;
  }

  els.doneScreen.classList.add("hidden");
  els.nowIcon.textContent = currentTask.icon;
  els.nowTitle.textContent = currentTask.title;
  els.nowHint.textContent = currentTask.say;

  els.taskList.innerHTML = "";
  tasks.forEach((task, index) => {
    const item = document.createElement("button");
    item.className = "task";
    if (index === currentIndex) item.classList.add("current");
    if (completed.includes(index)) item.classList.add("done");

    item.innerHTML = `
      <div class="task-icon">${task.icon}</div>
      <div>
        <div class="task-title">${task.title}</div>
        <div class="task-time">${task.time}</div>
      </div>
      <div class="check">${completed.includes(index) ? "✅" : index === currentIndex ? "👉" : ""}</div>
    `;

    item.addEventListener("click", () => {
      if (completed.includes(index)) {
        completed = completed.filter(i => i !== index);
      } else {
        completed.push(index);
      }
      completed.sort((a, b) => a - b);
      saveProgress();
      render();
    });

    els.taskList.appendChild(item);
  });
}

els.completeButton.addEventListener("click", () => {
  const tasks = getTasks();
  const currentIndex = getCurrentIndex(tasks);
  if (currentIndex < tasks.length && !completed.includes(currentIndex)) {
    completed.push(currentIndex);
    saveProgress();
  }
  render();
});

els.speakButton.addEventListener("click", () => {
  const tasks = getTasks();
  const currentIndex = getCurrentIndex(tasks);
  const intro = isWeekend() ? config.weekendGreeting : config.weekdayGreeting;
  if (currentIndex < tasks.length) {
    speak(`${intro} ${tasks[currentIndex].say}`);
  } else {
    speak(config.doneMessage);
  }
});

els.resetButton.addEventListener("click", () => {
  completed = [];
  saveProgress();
  render();
});

render();

// Refresh once per minute in case the day changes while the tablet is mounted.
setInterval(render, 60_000);
setInterval(updateDayTimeWeather, 60_000);
