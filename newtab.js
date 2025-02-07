// src/newtab.js
'use strict'

const TIMEZONES = [
  { name: 'New York', timezone: 'America/New_York' },
  { name: 'Beijing', timezone: 'Asia/Shanghai' },
  { name: 'Bangkok', timezone: 'Asia/Bangkok' },
  { name: 'Berlin', timezone: 'Europe/Berlin' }
]

function updateDarkMode() {
  const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  document.body.classList.toggle('dark', isDark)
}

function getLocalTime(timezone) {
  const date = new Date()
  const options = {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }
  return new Intl.DateTimeFormat('en-US', options).format(date)
}

function getLocalDate(timezone) {
  const date = new Date()
  const options = {
    timeZone: timezone,
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  }
  return new Intl.DateTimeFormat('en-US', options).format(date)
}

function isDaytime(timezone) {
  const date = new Date()
  const hour = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    hour: 'numeric',
    hour12: false
  }).format(date)
  
  return parseInt(hour) >= 6 && parseInt(hour) < 18
}

function createTimeCard(city, timezone) {
  const card = document.createElement('div')
  const time = getLocalTime(timezone)
  const date = getLocalDate(timezone)
  const daytime = isDaytime(timezone)
  
  card.className = `card ${daytime ? 'day' : 'night'}`
  
  card.innerHTML = `
    <div class="time">${time}</div>
    <div class="city">${city}</div>
    <div class="date">${date}</div>
  `
  
  return card
}

function updateProgressIndicator() {
  const now = new Date()
  const hours = now.getHours() % 12
  const minutes = now.getMinutes()
  const progress = ((hours * 60 + minutes) / (12 * 60)) * 100
  
  const indicator = document.getElementById('progress-indicator')
  if (!indicator) return

  const size = 120
  const strokeWidth = 4
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  
  indicator.innerHTML = `
    <svg width="${size}" height="${size}">
      <circle
        cx="${size/2}"
        cy="${size/2}"
        r="${radius}"
        fill="transparent"
        stroke="rgba(0,0,0,0.1)"
        stroke-width="${strokeWidth}"
      />
      <circle
        cx="${size/2}"
        cy="${size/2}"
        r="${radius}"
        fill="transparent"
        stroke="currentColor"
        stroke-width="${strokeWidth}"
        stroke-dasharray="${circumference}"
        stroke-dashoffset="${circumference * (1 - progress/100)}"
      />
      <text
        x="${size/2}"
        y="${size/2}"
        text-anchor="middle"
        dominant-baseline="middle"
        font-size="20"
      >${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}</text>
    </svg>
  `
}

function updateTimes() {
  const grid = document.getElementById('timezone-grid')
  if (!grid) return
  
  grid.innerHTML = ''
  
  TIMEZONES.forEach(({ name, timezone }) => {
    const card = createTimeCard(name, timezone)
    grid.appendChild(card)
  })
  
  updateProgressIndicator()
}

function init() {
  // Initial dark mode check
  updateDarkMode()

  // Listen for system dark mode changes
  window.matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', updateDarkMode)

  // Start time updates
  updateTimes()
  setInterval(updateTimes, 60000)
}

init()
