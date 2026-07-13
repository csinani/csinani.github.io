# Kid Visual Schedule Dashboard v3 — Morning + Bedtime

This version includes both morning and bedtime routines.

## URLs

Use these URLs for each tablet:

- `index.html?kid=vlora`
- `index.html?kid=nori`

Force a specific routine:

- `index.html?kid=vlora&routine=morning`
- `index.html?kid=vlora&routine=bedtime`
- `index.html?kid=nori&routine=morning`
- `index.html?kid=nori&routine=bedtime`

On GitHub Pages:

- `https://YOURUSERNAME.github.io/YOURREPOSITORY/?kid=vlora`
- `https://YOURUSERNAME.github.io/YOURREPOSITORY/?kid=nori`

## Automatic routine switching

The app automatically switches to bedtime mode at 5 PM.

To change that, edit this in `schedule.js`:

```js
const BEDTIME_MODE_START_HOUR = 17;
```

Examples:

- `17` = 5 PM
- `18` = 6 PM
- `19` = 7 PM

## Editing routines

Open `schedule.js` and look for:

```js
const KIDS = {
```

Each child has:

```js
weekdayTasks: []
weekendTasks: []
bedtimeTasks: []
```

Each task looks like:

```js
{ time: "7:00", durationMinutes: 10, icon: "🦷", title: "Brush Teeth", say: "Let's brush teeth before bed." }
```

You can edit:

- `time`
- `durationMinutes`
- `icon`
- `title`
- `say`

## Progress

Progress is saved separately for:

- each child
- each date
- morning vs bedtime routine

## Weather

Weather uses Open-Meteo and is set to Durham, NC.

## Uploading to GitHub

Upload these files to the root of your repository:

- `index.html`
- `styles.css`
- `schedule.js`
- `README.md`

Then commit changes.
