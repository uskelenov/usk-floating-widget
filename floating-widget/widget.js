class FloatingWidget {
	constructor(selector, options = {}) {
		this.root = document.querySelector(selector)
		if (!this.root) return

		this.options = options
		this.isOpen = false
		this.clickedOnce = false
		this.pulseTimer = null

		this.container = document.createElement('div')
		this.container.className = 'fab-container'

		this.renderGreeting()
		this.renderItems()
		this.renderMain()

		this.root.appendChild(this.container)
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
		ITEMS
	========================= */
	renderItems() {
		const buttons = this.options.buttons || []
		if (!buttons.length) return

		this.itemsWrap = document.createElement('div')
		this.itemsWrap.className = 'fab-items'

		buttons.forEach(b => {
			const btn = document.createElement('div')
			btn.className = 'fab-item'
			btn.innerHTML = this.renderIcon(b.icon)

			if (b.background) btn.style.background = b.background
			if (b.color) btn.style.color = b.color

			if (b.hoverBackground) {
				btn.addEventListener('mouseenter', () => btn.style.background = b.hoverBackground)
				btn.addEventListener('mouseleave', () => btn.style.background = b.background)
			}

			if (b.classes) {
				[].concat(b.classes).forEach(c => btn.classList.add(c))
			}

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

			if (b.onClick) btn.addEventListener('click', e => { e.stopPropagation(); b.onClick() })

			this.itemsWrap.appendChild(btn)
		})

		this.container.appendChild(this.itemsWrap)
	}

	/* =========================
		MAIN BUTTON
	========================= */
	renderMain() {
		this.mainBtn = document.createElement('div')
		this.mainBtn.className = 'fab-main'
		this.mainBtn.innerHTML = this.renderIcon(this.options.mainIcon)

		// main styles
		const s = this.options.mainStyle || {}
		if (s.background) this.mainBtn.style.background = s.background
		if (s.color) this.mainBtn.style.color = s.color

		// pulse settings
		const p = this.options.pulse || {}
		if (p.pulseColor) this.mainBtn.style.setProperty('--fab-pulse-color', p.pulseColor)

		this.mainBtn.addEventListener('click', () => this.toggle())

		this.container.appendChild(this.mainBtn)

		if (p.enabled && p.target === 'main') this.startPulse(p)
	}

	renderIcon(icon) {
		if (!icon) return ''
		if (typeof icon === 'string' && !icon.includes('<') && /\.(svg|png|jpe?g|webp|gif)$/i.test(icon)) {
			return `<img src="${icon}" class="fab-main-icon">`
		}
		return icon
	}

	/* =========================
		PULSE
	========================= */
	startPulse(p) {
		if (!p) p = this.options.pulse || {}
		const delay = p.pulseDelay || 2500
	
		this.stopPulse()
	
		this.pulseTimer = setInterval(() => {
			if (!this.isOpen) {
				// сброс анимации
				this.mainBtn.classList.remove('fab-pulse')
				void this.mainBtn.offsetWidth // триггер ререндеринга
				this.mainBtn.classList.add('fab-pulse')
	
				if (p.pulseOnce) this.stopPulse()
			}
		}, delay)
	}

	stopPulse() {
		clearInterval(this.pulseTimer)
		this.pulseTimer = null
		if (this.mainBtn) this.mainBtn.classList.remove('fab-pulse')
	}

	/* =========================
		TOGGLE
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
			// Сбрасываем пульсацию при открытии
			this.stopPulse()
			this.mainBtn.classList.remove('fab-pulse')
		} else {
			// Возобновляем пульсацию при закрытии
			if (p.enabled && p.target === 'main') {
				this.startPulse(p)
			}
		}
	}
}
