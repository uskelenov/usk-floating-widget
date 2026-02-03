class FloatingWidget {

	/* =========================
			INIT
	========================= */
	constructor(selector, options = {}) {		
		this.container = document.querySelector(selector)
		if (!this.container) return

		this.options = options
		this.isOpen = false
		this.clickedOnce = false
		this.pulseTimer = null

		this.container.classList.add('fab-container')

		this.renderGreeting()
		this.renderItems()
		this.renderMain()
	}

	/* =========================
		GREETING
	========================= */
	renderGreeting() {
		const g = this.options.greeting
		if (!g || !g.enabled) return

		this.greeting = document.createElement('div')
		this.greeting.className = 'fab-greeting'
		this.greeting.innerHTML = g.text

		if (g.background) this.greeting.style.background = g.background
		if (g.color) this.greeting.style.color = g.color

		this.container.appendChild(this.greeting)

		if (g.autoHide && typeof g.delay === 'number') {
			setTimeout(() => this.hideGreeting(), g.delay)
		}
	}

	hideGreeting() {
		if (this.greeting) this.greeting.remove()
		this.greeting = null
	}

	/* =========================
		ITEMS / BUTTONS
	========================= */
	renderItems() {
		const buttons = this.options.buttons || []
		if (!buttons.length) return

		this.items = document.createElement('div')
		this.items.className = 'fab-items'

		buttons.forEach(b => {
			const btn = document.createElement('div')
			btn.className = 'fab-item'
			btn.innerHTML = this.renderIcon(b.icon)

			// Цвета кнопки
			if (b.background) btn.style.background = b.background
			if (b.color) btn.style.color = b.color

			// Hover background
			if (b.hoverBackground) {
				btn.addEventListener('mouseenter', () => btn.style.background = b.hoverBackground)
				btn.addEventListener('mouseleave', () => btn.style.background = b.background)
			}

			// Пользовательские классы
			if (b.classes) {
				[].concat(b.classes).forEach(c => btn.classList.add(c))
			}

			// Tooltip
			if (b.tooltip) {
				const tip = document.createElement('div')
				tip.className = 'fab-tooltip'
				tip.innerHTML = b.tooltip

				if (b.tooltipStyle) {
					if (b.tooltipStyle.background) tip.style.background = b.tooltipStyle.background
					if (b.tooltipStyle.color) tip.style.color = b.tooltipStyle.color
				}

				btn.appendChild(tip)

				if (b.alwaysShowLabel) btn.classList.add('show-label')
			}

			// Click handler
			btn.addEventListener('click', b.onClick || (() => {}))
			this.items.appendChild(btn)
		})

		this.container.appendChild(this.items)
	}

	/* =========================
		MAIN BUTTON
	========================= */
	renderMain() {
		this.mainBtn = document.createElement('div')
		this.mainBtn.className = 'fab-main'
		this.mainBtn.innerHTML = this.renderIcon(this.options.mainIcon)

		// Основные стили
		const s = this.options.mainStyle || {}
		if (s.background) this.mainBtn.style.background = s.background
		if (s.color) this.mainBtn.style.color = s.color

		// Цвет пульсации
		const p = this.options.pulse || {}
		if (p.pulseColor) this.mainBtn.style.setProperty('--fab-pulse-color', p.pulseColor)

		this.mainBtn.addEventListener('click', () => this.toggle())
		this.container.appendChild(this.mainBtn)

		// Запуск пульсации
		if (p.enabled) this.startPulse(p)
	}

	/* =========================
		ICON RENDER
	========================= */
	renderIcon(icon) {
		if (
			typeof icon === 'string' &&
			!icon.includes('<') &&
			/\.(svg|png|jpe?g|webp|gif)$/i.test(icon)
		) {
			return `<img src="${icon}" class="fab-main-icon">`
		}
		return icon || ''
	}

	/* =========================
		PULSE
	========================= */
	startPulse(pulse) {
		const delay = pulse.pulseDelay || 2500
		this.stopPulse() // останавливаем старый интервал

		this.pulseTimer = setInterval(() => {
			if (!this.isOpen) {
				// Сброс анимации
				this.mainBtn.classList.remove('fab-pulse')
				void this.mainBtn.offsetWidth // trigger reflow
				this.mainBtn.classList.add('fab-pulse')

				if (pulse.pulseOnce) this.stopPulse()
			}
		}, delay)
	}

	stopPulse() {
		if (this.pulseTimer) clearInterval(this.pulseTimer)
		this.pulseTimer = null
		if (this.mainBtn) this.mainBtn.classList.remove('fab-pulse')
	}

	/* =========================
		TOGGLE WIDGET
	========================= */
	toggle() {
		this.isOpen = !this.isOpen
		this.container.classList.toggle('open', this.isOpen)

		if (!this.clickedOnce) {
			this.hideGreeting()
			this.clickedOnce = true
		}

		const p = this.options.pulse || {}

		if (this.isOpen) {
			// при открытии сбрасываем пульсацию
			this.stopPulse()
		} else {
			// при закрытии возобновляем пульсацию
			const target = p.target || 'main';
            if (p.enabled && target === 'main') {
                this.startPulse(p)
            }
		}
	}
}
