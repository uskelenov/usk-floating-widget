class FloatingWidget {
	constructor(selector, options = {}) {
		this.container = document.querySelector(selector)
		if (!this.container) return

		this.options = options
		this.isOpen = false
		this.pulseTimer = null

		this.init()
	}

	init() {
		this.container.classList.add('fab-widget')
		this.renderMain()
	}

	/* =========================
		RENDER MAIN BUTTON
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

		if (p.pulseColor) {
			this.mainBtn.style.setProperty('--fab-pulse-color', p.pulseColor)
		}

		this.mainBtn.addEventListener('click', () => this.toggle())

		if (p.enabled && p.target === 'main') {
			this.startPulse(this.mainBtn, p)
		}

		this.container.appendChild(this.mainBtn)
	}

	/* =========================
		ICON RENDER
	========================= */
	renderIcon(icon) {
		if (!icon) return ''

		// image
		if (
			typeof icon === 'string' &&
			!icon.includes('<') &&
			/\.(svg|png|jpe?g|webp|gif)$/i.test(icon)
		) {
			return `<img decoding="async" src="${icon}" alt="" class="fab-main-icon">`
		}

		// svg or emoji
		return icon
	}

	/* =========================
		PULSE
	========================= */
	startPulse(el, pulse) {
		const delay = pulse.pulseDelay || 2500

		this.resetPulse()

		this.pulseTimer = setInterval(() => {
			if (!this.isOpen) {
				el.classList.add('fab-pulse')
				setTimeout(() => el.classList.remove('fab-pulse'), 1200)
			}
		}, delay)
	}

	resetPulse() {
		if (this.pulseTimer) {
			clearInterval(this.pulseTimer)
			this.pulseTimer = null
		}
	}

	/* =========================
		STATE
	========================= */
	toggle() {
		this.isOpen = !this.isOpen

		if (this.isOpen) {
			this.resetPulse()
		} else {
			const p = this.options.pulse || {}
			if (p.enabled && p.target === 'main') {
				this.startPulse(this.mainBtn, p)
			}
		}
	}
}

/* =========================
	EXPORT (optional)
========================= */
window.FloatingWidget = FloatingWidget
