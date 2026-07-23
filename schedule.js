"use strict";

const APP_CONFIG = {
  childName: "Vlora",
  upcomingTaskLimit: 5,
  weatherLatitude: 35.9940,
  weatherLongitude: -78.8986
};

const SCHEDULES = {
  weekday: [
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
  stayHome: [
    { time: "7:00", durationMinutes: 15, icon: "🛏️", title: "Wake Up", say: "Good morning Vlora. Time to wake up." },
    { time: "7:15", durationMinutes: 10, icon: "🚽", title: "Potty & Wash Hands", say: "Go potty and wash your hands." },
    { time: "7:25", durationMinutes: 5, icon: "🪥", title: "Brush Teeth", say: "Brush your teeth and clean the sink." },
    { time: "7:30", durationMinutes: 10, icon: "👕", title: "Get Dressed", say: "Choose your clothes and put your pajamas away." },
    { time: "7:40", durationMinutes: 20, icon: "🥣", title: "Breakfast", say: "Time for a healthy breakfast." },
    { time: "8:00", durationMinutes: 20, icon: "🧸", title: "Play Time", say: "You may choose something fun to play." }
  ],
  bedtime: [
    { time: "19:00", durationMinutes: 10, icon: "🧸", title: "Clean Up", say: "Put your toys and belongings away." },
    { time: "19:10", durationMinutes: 15, icon: "🛁", title: "Bath Time", say: "Time to get clean and ready for bed." },
    { time: "19:25", durationMinutes: 5, icon: "👚", title: "Pajamas", say: "Put on your pajamas." },
    { time: "19:30", durationMinutes: 5, icon: "🪥", title: "Brush Teeth", say: "Brush your teeth and clean the sink." },
    { time: "19:35", durationMinutes: 15, icon: "📖", title: "Story Time", say: "Choose a bedtime story." },
    { time: "19:50", durationMinutes: 10, icon: "🌙", title: "Bedtime", say: "Good night Vlora. Sweet dreams." }
  ]
};

const $ = (id) => document.getElementById(id);
const el = {
  greeting: $("greeting"), dayMessage: $("dayMessage"), currentTime: $("currentTime"), currentDate: $("currentDate"),
  weatherIcon: $("weatherIcon"), currentTemperature: $("currentTemperature"), highTemperature: $("highTemperature"), lowTemperature: $("lowTemperature"),
  currentTaskCard: $("currentTaskCard"), timerRing: $("timerRing"), currentTaskIcon: $("currentTaskIcon"), countdown: $("countdown"), countdownLabel: $("countdownLabel"),
  currentTaskTitle: $("currentTaskTitle"), currentTaskSpeech: $("currentTaskSpeech"), sayButton: $("sayButton"), completeButton: $("completeButton"), encouragement: $("encouragement"),
  taskList: $("taskList"), completedTaskList: $("completedTaskList"),
  progressTitle: $("progressTitle"), progressTrack: $("progressTrack"), progressFill: $("progressFill"), progressCount: $("progressCount"),
  juniperImage: $("juniperImage"), juniperBubble: $("juniperBubble"),
  goodNightScreen: $("goodNightScreen"), goodNightName: $("goodNightName"),
  fullscreenButton: $("fullscreenButton"), celebration: $("celebration")
};

const juniperImage = document.getElementById("juniperImage");

const JUNIPER_IMAGES = {
    default: "images/juniper-wave.png",

    "Wake Up": "images/juniper-wave.png",
    "Go Potty": "images/juniper-wave.png",
    "Brush Teeth": "images/juniper-toothbrush.png",
    "Brush Your Hair": "images/juniper-wave.png",
    "Get Dressed": "images/juniper-backpack.png",
    "Breakfast": "images/juniper-pancakes.png",
    "Backpack Check": "images/juniper-backpack.png",
    "Shoes On": "images/juniper-backpack.png",
    "Story Time": "images/juniper-story.png"
};

const state = { mode: "", tasks: [], completed: new Set(), currentIndex: 0, lastIndex: -1 };

function storageKey(d = new Date(), mode = state.mode) {
  const day = d.toISOString().slice(0, 10);
  return `kid-schedule:${APP_CONFIG.childName}:${day}:${mode}`;
}

function loadCompleted(d = new Date()) {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey(d)) || "[]");
    state.completed = new Set(saved.filter(Number.isInteger));
  } catch {
    state.completed = new Set();
  }
}

function saveCompleted(d = new Date()) {
  try {
    localStorage.setItem(storageKey(d), JSON.stringify([...state.completed]));
  } catch {}
}

const toMinutes = (time) => { const [h,m] = time.split(":").map(Number); return h*60+m; };
const nowMinutes = (d) => d.getHours()*60+d.getMinutes();
const nowSeconds = (d) => d.getHours()*3600+d.getMinutes()*60+d.getSeconds();
const formatCountdown = (s) => { s=Math.max(0,Math.ceil(s)); return `${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}`; };
const formatTaskTime = (time) => { const [h,m]=time.split(":").map(Number); const d=new Date(); d.setHours(h,m,0,0); return d.toLocaleTimeString([], {hour:"numeric",minute:"2-digit"}); };

function determineMode(d) {
  if (nowMinutes(d) >= 18*60+30) return "bedtime";
  return [0,6].includes(d.getDay()) ? "stayHome" : "weekday";
}

function modeDisplay(mode) {
  if (mode === "bedtime") return { heading:`It's <span class="gradient-text">Bedtime!</span>`, progress:"Bedtime Routine Progress", cls:"bedtime-mode" };
  if (mode === "stayHome") return { heading:`It's a <span class="gradient-text">Stay at Home Day!</span>`, progress:"Morning Routine Progress", cls:"stay-home-mode" };
  return { heading:`It's a <span class="gradient-text">School Day!</span>`, progress:"Morning Routine Progress", cls:"school-day-mode" };
}

function greeting(d) {
  if (d.getHours() < 12) return `Good morning, ${APP_CONFIG.childName}!`;
  if (d.getHours() < 17) return `Good afternoon, ${APP_CONFIG.childName}!`;
  return `Good evening, ${APP_CONFIG.childName}!`;
}

function updateMode(d) {
  const mode = determineMode(d);
  if (mode !== state.mode) {
    state.mode = mode;
    state.tasks = SCHEDULES[mode];
    state.lastIndex = -1;
    loadCompleted(d);
  }
  const display = modeDisplay(mode);
  document.body.className = display.cls;
  el.greeting.textContent = greeting(d);
  el.dayMessage.innerHTML = display.heading;
  el.progressTitle.textContent = display.progress;
}

function updateClock(d) {
  el.currentTime.textContent = d.toLocaleTimeString([], {hour:"numeric", minute:"2-digit"});
  el.currentDate.textContent = d.toLocaleDateString([], {weekday:"long", month:"long", day:"numeric"});
}

function currentTaskIndex(d) {
  const mins = nowMinutes(d);
  let index = Math.max(0, state.tasks.length - 1);

  for (let i = 0; i < state.tasks.length; i++) {
    const start = toMinutes(state.tasks[i].time);
    const end = start + state.tasks[i].durationMinutes;

    if (mins >= start && mins < end) {
      index = i;
      break;
    }

    if (mins < start) {
      index = i;
      break;
    }
  }

  // When a child finishes early, immediately advance to the next task.
  while (index < state.tasks.length - 1 && state.completed.has(index)) {
    index += 1;
  }

  return index;
}


function bedtimeEndSeconds() {
  const last = state.tasks[state.tasks.length - 1];
  return last ? (toMinutes(last.time) + last.durationMinutes) * 60 : 0;
}

//function shouldShowGoodNight(d) {
 // if (state.mode !== "bedtime") return false;
 // const allCompleted = state.tasks.length > 0 && state.completed.size >= state.tasks.length;
 // return allCompleted || nowSeconds(d) >= bedtimeEndSeconds();
//}

function showGoodNight(show) {
  document.body.classList.toggle("good-night-active", show);
  el.goodNightScreen?.classList.toggle("is-visible", show);
  el.goodNightScreen?.setAttribute("aria-hidden", String(!show));
  if (el.goodNightName) el.goodNightName.textContent = APP_CONFIG.childName;
}

function renderCurrent(d) {
  const i = currentTaskIndex(d);
  const task = state.tasks[i];
  let completionChanged = false;
  for (let x = 0; x < i; x++) {
    if (!state.completed.has(x)) {
      state.completed.add(x);
      completionChanged = true;
    }
  }
  if (completionChanged) saveCompleted(d);
  state.currentIndex = i;
  const start = toMinutes(task.time)*60;
  const end = start + task.durationMinutes*60;
  const now = nowSeconds(d);
  let progress = 0;

  juniperImage.src =
    JUNIPER_IMAGES[task.title] ||
    JUNIPER_IMAGES.default;

  el.currentTaskIcon.textContent = task.icon;
  el.currentTaskTitle.textContent = task.title;
  el.currentTaskSpeech.textContent = task.say;

  if (now < start) {
    el.countdown.textContent = formatCountdown(start-now);
    el.countdownLabel.textContent = "UNTIL START";
  } else if (now < end) {
    el.countdown.textContent = formatCountdown(end-now);
    el.countdownLabel.textContent = "REMAINING";
    progress = ((now-start)/(task.durationMinutes*60))*100;
  } else {
    el.countdown.textContent = "0:00";
    el.countdownLabel.textContent = "TIME'S UP";
    progress = 100;
  }

  el.timerRing.style.setProperty("--timer-progress", `${Math.max(0,Math.min(100,progress))*3.6}deg`);
  const done = state.completed.has(i);
  el.completeButton.disabled = done;
  el.completeButton.innerHTML = done ? '<span>✓</span><span>Done!</span>' : '<span>✓</span><span>I did it!</span>';

  if (state.lastIndex !== i) {
    el.currentTaskCard.classList.remove("task-change");
    requestAnimationFrame(()=>el.currentTaskCard.classList.add("task-change"));
    state.lastIndex = i;
  }
}

function renderUpcoming() {

    el.taskList.innerHTML = "";
    el.completedTaskList.innerHTML = "";

    // Remaining tasks
    const upcoming = state.tasks.slice(
        state.currentIndex + 1,
        state.currentIndex + 1 + APP_CONFIG.upcomingTaskLimit
    );

    if (!upcoming.length) {

        el.taskList.innerHTML = `
            <div class="empty-task-list">
                <span class="empty-task-icon">🎉</span>
                <strong>All finished!</strong>
                <span>Great job, ${APP_CONFIG.childName}!</span>
            </div>
        `;

    } else {

        upcoming.forEach(task => {

            const card = document.createElement("div");
            card.className = "upcoming-task";

            card.innerHTML = `
                <div class="upcoming-task-icon">${task.icon}</div>

                <div class="upcoming-task-info">
                    <strong>${task.title}</strong>
                    <span>${formatTaskTime(task.time)}</span>
                </div>

                <div class="upcoming-task-duration">
                    ${task.durationMinutes} min
                </div>
            `;

            el.taskList.appendChild(card);

        });

    }

    // Completed tasks
    [...state.completed]
        .sort((a,b)=>a-b)
        .forEach(index => {

            const task = state.tasks[index];

            const card = document.createElement("div");
            card.className = "upcoming-task completed";

            card.innerHTML = `
                <div class="upcoming-task-icon">
                    ✓
                </div>

                <div class="upcoming-task-info">
                    <strong>${task.title}</strong>
                    <span>${formatTaskTime(task.time)}</span>
                </div>

                <div class="upcoming-task-duration">
                    Done
                </div>
            `;

            el.completedTaskList.appendChild(card);

        });

    if (state.completed.size === 0) {

        el.completedTaskList.innerHTML = `
            <div class="empty-task-list">
                <span class="empty-task-icon">⭐</span>
                <strong>No completed tasks yet</strong>
            </div>
        `;

    }

}

function updateProgress() {
  const done=state.completed.size, total=state.tasks.length;
  el.progressFill.style.width = `${total ? (done/total)*100 : 0}%`;
  el.progressCount.textContent = `${done} / ${total}`;
  el.progressTrack.setAttribute("aria-valuemax", String(total));
  el.progressTrack.setAttribute("aria-valuenow", String(done));
}

function render(d) {
  const goodNight = shouldShowGoodNight(d);

  if (goodNight && state.completed.size < state.tasks.length) {
    state.tasks.forEach((_, index) => state.completed.add(index));
    saveCompleted(d);
  }

  showGoodNight(goodNight);

  if (goodNight) {
    updateProgress();
    return;
  }

  renderCurrent(d);
  renderUpcoming();
  updateProgress();
}
function speak(text) { if (!("speechSynthesis" in window)) return; speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(text); u.rate=.9; u.pitch=1.05; speechSynthesis.speak(u); }
function celebrate() { el.celebration.textContent="🎉 ⭐ 🌈 ✨"; el.celebration.classList.add("show"); setTimeout(()=>el.celebration.classList.remove("show"),2200); }

el.sayButton.addEventListener("click",()=>speak(state.tasks[state.currentIndex]?.say || ""));
el.completeButton.addEventListener("click",()=>{
  if (state.completed.has(state.currentIndex)) return;
  state.completed.add(state.currentIndex);
  saveCompleted(new Date());
  el.encouragement.innerHTML=`<span class="encouragement-icon">⭐</span><div><strong>Great job, ${APP_CONFIG.childName}!</strong><p>Keep going, you've got this!</p></div>`;
  
  celebrate();
  speak(`Great job, ${APP_CONFIG.childName}!`);
  
  // Show celebration Juniper
  el.juniperImage.src = "juniper-celebrate.png";
  
  // Wait 2 seconds before moving to the next task
  setTimeout(() => {
      render(new Date());
  }, 2000);
    
});
el.fullscreenButton.addEventListener("click",async()=>{ try { document.fullscreenElement ? await document.exitFullscreen() : await document.documentElement.requestFullscreen(); } catch {} });
document.addEventListener("fullscreenchange",()=>{ el.fullscreenButton.innerHTML=document.fullscreenElement?'✕ <span>Exit full screen</span>':'⛶ <span>Full screen</span>'; });

function weatherIcon(code,isDay) {
  if (code===0) return isDay?"☀️":"🌙";
  if ([1,2].includes(code)) return isDay?"🌤️":"☁️";
  if (code===3) return "☁️";
  if ([45,48].includes(code)) return "🌫️";
  if ([51,53,55,56,57].includes(code)) return "🌦️";
  if ([61,63,65,66,67,80,81,82].includes(code)) return "🌧️";
  if ([71,73,75,77,85,86].includes(code)) return "❄️";
  if ([95,96,99].includes(code)) return "⛈️";
  return "🌤️";
}

async function loadWeather() {
  const url=`https://api.open-meteo.com/v1/forecast?latitude=${APP_CONFIG.weatherLatitude}&longitude=${APP_CONFIG.weatherLongitude}&current=temperature_2m,weather_code,is_day&daily=temperature_2m_max,temperature_2m_min&temperature_unit=fahrenheit&timezone=auto&forecast_days=1`;
  try {
    const r=await fetch(url); if(!r.ok) throw new Error(); const w=await r.json();
    el.weatherIcon.textContent=weatherIcon(w.current.weather_code,w.current.is_day===1);
    el.currentTemperature.textContent=`${Math.round(w.current.temperature_2m)}°`;
    el.highTemperature.textContent=`${Math.round(w.daily.temperature_2m_max[0])}°`;
    el.lowTemperature.textContent=`${Math.round(w.daily.temperature_2m_min[0])}°`;
  } catch {
    el.weatherIcon.textContent="🌤️";
  }
}

function updateApp() { const d=new Date(); updateMode(d); updateClock(d); render(d); }
updateApp(); loadWeather(); setInterval(updateApp,1000); setInterval(loadWeather,30*60*1000);
