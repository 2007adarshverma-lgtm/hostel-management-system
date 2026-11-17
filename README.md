# HostelEase — Hostel Management System

A responsive, browser-based hostel management dashboard built with **HTML, CSS and vanilla JavaScript**. It is suitable as a first-semester / beginner web development project and can be hosted free using GitHub Pages.

## Features

- Dashboard with resident count, occupied rooms, pending fees and open complaints
- Add, edit and delete resident records
- Search residents by name, roll number, room or sharing type
- Filter residents by fee status
- Room allocation overview and sharing-type counts
- Monthly fee tracking with paid / pending status
- Log maintenance complaints and toggle them between Open and Resolved
- Export resident records to CSV
- Responsive layout for desktop, tablet and mobile
- Saves changes in browser `localStorage`

## Project files

- `index.html` — page structure and forms
- `style.css` — responsive dashboard styling
- `script.js` — resident, room, fee, complaint and CSV features

## Run locally

1. Download or extract the project folder.
2. Open `index.html` in a modern browser.
3. No installation or build step is required.

## Publish with GitHub Pages

1. Create a **Public** repository on GitHub, for example `hostel-management-system`.
2. Upload `index.html`, `style.css`, `script.js` and `README.md` to the repository root.
3. Open the repository's **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select branch **main** and folder **/(root)**, then click **Save**.
6. Wait a minute or two. GitHub will show your public website URL in the Pages section. It usually looks like `https://YOUR-USERNAME.github.io/hostel-management-system/`.

## Notes

- The project starts with a few sample residents and complaints so the dashboard is not empty. You can edit or delete these records.
- Data is stored only in the browser where you use the site. `localStorage` is not a shared database, so records do not automatically sync between different devices or users.
- This is a front-end academic demo, not a production hostel administration platform. Do not enter sensitive personal information.
