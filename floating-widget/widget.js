class FloatingWidget {
	constructor(selector, options = {}) {
		this.root = document.querySelector(selector)
		if (!this.root) return

		this.options = options
		this.isOpen = false
		this.pulseTimer = null

		this.render()
	}

	/* =========================
		RENDER
	========================= */
	render() {
		this.container = document.createElement('div')
		this.container.className = 'fab-container'

		this.renderMain()

		this.root.appendChild(this.container)
	}

	/* =========================
		MAIN BUTTON
	========================= */
	renderMain() {
		this.mainBtn = document.createElement('div')
		this.mainBtn.className = 'fab-main'
		this.mainBtn.innerHTML = this.renderIcon(this.options.mainIcon)

		// styles
		const style = this.options.mainStyle || {}
		if (style.background) this.mainBtn.style.background = style.background
		if (style.color) this.mainBtn.style.color = style.color

		// pulse color
		const pulse = this.options.pulse || {}
		if (pulse.pulseColor) {
			this.mainBtn.style.setProperty('--fab-pulse-color', pulse.pulseColor)
		}

		this.mainBtn.addEventListener('click', () => this.toggle())

		if (pulse.enabled && pulse.target === 'main') {
			this.startPulse()
		}

		this.container.appendChild(this.mainBtn)
	}

	/* =========================
		ICON
	========================= */
	renderIcon(icon) {
		if (!icon) return ''

		if (
			typeof icon === 'string' &&
			!icon.includes('<') &&
			/\.(svg|png|jpe?g|webp|gif)$/i.test(icon)
		) {
			return `<img decoding="async" src="${icon}" class="fab-main-icon" alt="">`
		}

		return icon
	}

	/* =========================
		PULSE
	========================= */
	startPulse() {
		const pulse = this.options.pulse || {}
		const delay = pulse.pulseDelay || 2500

		this.resetPulse()

		this.pulseTimer = setInterval(() => {
			if (!this.isOpen) {
				this.mainBtn.classList.remove('fab-pulse')
				void this.mainBtn.offsetWidth // reset animation
				this.mainBtn.classList.add('fab-pulse')
			}
		}, delay)
	}

	resetPulse() {
		if (this.pulseTimer) {
			clearInterval(this.pulseTimer)
			this.pulseTimer = null
		}
		if (this.mainBtn) {
			this.mainBtn.classList.remove('fab-pulse')
		}
	}

	/* =========================
		TOGGLE
	========================= */
	toggle() {
		this.isOpen = !this.isOpen
		this.container.classList.toggle('open', this.isOpen)

		const pulse = this.options.pulse || {}

		if (this.isOpen) {
			this.resetPulse()
		} else {
			if (pulse.enabled && pulse.target === 'main') {
				this.startPulse()
			}
		}
	}
}
