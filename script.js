const root = document.documentElement
const themeButton = document.querySelector('[data-theme-toggle]')

function setTheme(theme) {
  root.dataset.theme = theme
  if (!themeButton) return
  const isLight = theme === 'light'
  themeButton.textContent = isLight ? 'Mode gelap' : 'Mode terang'
  themeButton.setAttribute('aria-pressed', String(isLight))
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', isLight ? '#eeeadf' : '#11130f')
}

try {
  setTheme(localStorage.getItem('pnr-theme') || 'dark')
} catch {
  setTheme('dark')
}

themeButton?.addEventListener('click', () => {
  const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark'
  setTheme(nextTheme)
  try {
    localStorage.setItem('pnr-theme', nextTheme)
  } catch {
    // Theme still changes for this page view when storage is unavailable.
  }
})

document.querySelectorAll('[data-current-year]').forEach((element) => {
  element.textContent = new Date().getFullYear()
})

const countdown = document.querySelector('[data-countdown]')
if (countdown) {
  const eventDate = new Date(countdown.dataset.date).getTime()
  const fields = {
    days: countdown.querySelector('[data-days]'),
    hours: countdown.querySelector('[data-hours]'),
    minutes: countdown.querySelector('[data-minutes]'),
  }

  const updateCountdown = () => {
    const distance = eventDate - Date.now()
    if (distance <= 0) {
      countdown.textContent = 'Festival sedang berlangsung'
      return false
    }
    fields.days.textContent = Math.floor(distance / 86400000)
    fields.hours.textContent = Math.floor((distance % 86400000) / 3600000)
    fields.minutes.textContent = Math.floor((distance % 3600000) / 60000)
    return true
  }

  if (updateCountdown()) {
    const timer = window.setInterval(() => {
      if (!updateCountdown()) window.clearInterval(timer)
    }, 60000)
  }
}

const artistCards = [...document.querySelectorAll('[data-artist]')]
if (artistCards.length) {
  const searchInput = document.querySelector('#cari-artis')
  const dayButtons = [...document.querySelectorAll('[data-day-filter]')]
  const resultCount = document.querySelector('[data-result-count]')
  const emptyState = document.querySelector('[data-empty-state]')
  let activeDay = 'all'

  const filterArtists = () => {
    const query = (searchInput?.value || '').trim().toLocaleLowerCase('id-ID')
    let visibleCount = 0

    artistCards.forEach((card) => {
      const matchesDay = activeDay === 'all' || card.dataset.day === activeDay
      const matchesText = card.textContent.toLocaleLowerCase('id-ID').includes(query)
      const visible = matchesDay && matchesText
      card.hidden = !visible
      if (visible) visibleCount += 1
    })

    if (resultCount) resultCount.textContent = visibleCount
    if (emptyState) emptyState.hidden = visibleCount > 0
  }

  searchInput?.addEventListener('input', filterArtists)
  dayButtons.forEach((button) => {
    button.addEventListener('click', () => {
      activeDay = button.dataset.dayFilter
      dayButtons.forEach((dayButton) => {
        const selected = dayButton === button
        dayButton.classList.toggle('is-active', selected)
        dayButton.setAttribute('aria-pressed', String(selected))
      })
      filterArtists()
    })
  })
}

document.querySelectorAll('.navbar-collapse .nav-link').forEach((link) => {
  link.addEventListener('click', () => {
    const menu = document.querySelector('.navbar-collapse.show')
    if (menu && window.bootstrap) window.bootstrap.Collapse.getOrCreateInstance(menu).hide()
  })
})
