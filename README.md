Nukkad Flood Map

A hyperlocal, lane-level flood risk map and community alert web app for the Nag River basin in Nagpur. It shows which streets are risky, lets residents report water levels, suggests a safer route to an emergency shelter, and gives ward officers a panel to dispatch help. Built for the TCS iON hackathon.

Status: working prototype. It uses sample data for about 30 street segments and shelters, not live sensor or government data.

Features
Street-level risk map: interactive Leaflet map with streets coloured by risk (safe, watch, high, severe).
Crowdsourced reports: residents report water depth and hazards (such as a blocked exit), and the street's risk score updates using a weighted score of baseline risk, water depth and number of reports.
Safe evacuation route: picks a route to an emergency shelter that avoids severe or blocked streets and prefers higher ground, with step-by-step directions and a walking-time estimate.
Multilingual alerts: English, Hindi and Marathi interface, with voice readout of alerts using the browser's speech feature.
Ward officer view: a separate panel to mark streets for pump, boat or cleared status.
Shareable alerts and low-literacy guide: simple alert sharing and a picture-led guide for people who find text hard to read.
Tech stack

React 19, TypeScript, Vite, Tailwind CSS 4, Leaflet, Lucide icons, Motion

Run it locally
Install Node.js (version 18 or newer).
Clone the repo and open its folder.
Install packages:
npm install
Start the app:
npm run dev
Open http://localhost:3000 in your browser.

No API key is needed to run the map. The .env.example file lists optional settings.

Project structure
src/
  components/   Map, report form, route panel, officer panel, modals
  data/         Sample street data, shelters, translations, risk scoring
  utils/        Safe route calculation, voice readout
  types/        TypeScript types
What I would improve next
Connect to real rainfall and river-level data
Use a real road network for routing instead of the current elevation-based heuristic
Store reports in a database so they are shared between users
