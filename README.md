# Kid Visual Schedule Dashboard

A simple visual schedule for a wall-mounted tablet.

## How to use

1. Open `index.html` in a browser.
2. Edit `schedule.js`.
3. Change the names, icons, spoken phrases, and routines.
4. For one kid, open:

   `index.html?kid=ava`

5. For the other kid, open:

   `index.html?kid=mia`

## Best parts to edit

Inside `schedule.js`, look for:

```js
const schedules = {
  ava: {
    name: "Ava",
    weekdayTasks: [
      { time: "7:00", icon: "🛏️", title: "Wake up", say: "Time to wake up." }
    ]
  }
}
```

Each task has:

- `time`: displayed on screen
- `icon`: emoji or symbol
- `title`: parent-readable label
- `say`: what the tablet says aloud

## Hosting for free

You can upload this folder to:

- GitHub Pages
- Cloudflare Pages
- Netlify

## Fire tablet notes

For a wall-mounted Fire tablet:

- Keep it plugged in.
- Set display sleep to the longest option possible.
- Use Silk browser full screen if available.
- Add the page to the home screen if your Fire OS version supports it.
- Consider a kiosk browser app later if you want it locked down.

## Custom images instead of emoji

Put image files in an `images` folder, then replace emoji rendering with image tags in `schedule.js`.
