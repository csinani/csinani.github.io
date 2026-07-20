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
      
      
      