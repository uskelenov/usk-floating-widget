class FloatingWidget {
	constructor(selector, options = {}) {
		this.root = document.querySelector(selector)
		if (!this.root) {
			console.warn('FloatingWidget: container not found:', selector)
			return
		}

		this.options = options
		this.isOpen = false
		this.greetingVisible = false
		this.greetingTimer = null

		this.render()
	}

	render() {
		this.container = document.createElement('div')
		this.container.className = 'fab-container'

		this.renderGreeting()
		this.renderItems()
		this.renderMain()

		this.root.appendChild(this.container)
	}

	/* ===== Greeting ===== */
	renderGreeting() {
		const g = this.options.greeting
		if (!g?.enabled) return

		this.greetingVisible = true
		this.greeting = document.createElement('div')
		this.greeting.className = 'fab-greeting'
		this.greeting.innerHTML = g.text

		// Custom greeting styles
		if (g.background) this.greeting.style.background = g.background
		if (g.color) this.greeting.style.color = g.color
		
		this.container.appendChild(this.greeting)

		if (g.autoHide && typeof g.delay === 'number') {
			this.greetingTimer = setTimeout(() => this.hideGreeting(), g.delay)
		}
	}

	hideGreeting() {
		if (!this.greetingVisible || !this.greeting) return

		this.greetingVisible = false
		clearTimeout(this.greetingTimer)

		this.greeting.style.opacity = '0'
		this.greeting.style.transform = 'translateY(10px)'

		setTimeout(() => {
			this.greeting?.remove()
			this.greeting = null
		}, 200)
	}

	/* ===== Items ===== */
	renderItems() {
		this.itemsWrap = document.createElement('div')
		this.itemsWrap.className = 'fab-items'

		;(this.options.buttons || []).forEach(btn => {
			const item = document.createElement('div')
			item.classList.add('fab-item')

			if (btn.classes) {
				if (Array.isArray(btn.classes)) item.classList.add(...btn.classes)
				else item.classList.add(...btn.classes.split(' '))
			}

			item.innerHTML = btn.icon || '+'

			if (btn.tooltip) {
				const tip = document.createElement('div')
				tip.className = 'fab-tooltip'
				tip.innerHTML = btn.tooltip
				item.appendChild(tip)

				if (btn.alwaysShowLabel) item.classList.add('show-label')
			}

			if (btn.background) item.style.background = btn.background
			if (btn.color) item.style.color = btn.color

			if (btn.hoverBackground) {
				item.addEventListener('mouseenter', () => {
					item.dataset.prevBg = item.style.background
					item.style.background = btn.hoverBackground
				})
				item.addEventListener('mouseleave', () => {
					item.style.background = item.dataset.prevBg || ''
				})
			}

			if (btn.onClick) {
				item.addEventListener('click', e => {
					e.stopPropagation()
					btn.onClick()
				})
			}

			this.itemsWrap.appendChild(item)
		})

		this.container.appendChild(this.itemsWrap)
	}

	/* ===== Main button ===== */
	renderIcon(icon) {
		if (!icon) return '☰'

		if (
			typeof icon === 'string' &&
			!icon.includes('<') &&
			/\.(svg|png|jpe?g|webp|gif)$/i.test(icon)
		) {
			return `<img src="${icon}" alt="" class="fab-main-icon">`
		}

		return icon
	}

	renderMain() {
		this.mainBtn = document.createElement('div')
		this.mainBtn.className = 'fab-main'
		this.mainBtn.innerHTML = this.renderIcon(this.options.mainIcon)

		this.mainBtn.addEventListener('click', () => this.toggle())

		const p = this.options.pulse
		if (p?.enabled && p.target === 'main') {
			this.startPulse(this.mainBtn, p)
		}

		this.container.appendChild(this.mainBtn)
	}

	/* ===== Toggle ===== */
	toggle() {
		this.isOpen = !this.isOpen
		this.container.classList.toggle('open', this.isOpen)

		if (this.greetingVisible) this.hideGreeting()

		const p = this.options.pulse
		if (p?.enabled && p.target === 'main') {
			this.resetPulse(this.mainBtn, p)
		}
	}

	/* ===== Pulse ===== */
	startPulse(el, options = {}) {
		const { pulseDelay = 0, pulseOnce = false, pulseUntilClick = false } = options

		const start = () => {
			el.classList.add('fab-pulse')
			if (pulseOnce) {
				setTimeout(() => el.classList.remove('fab-pulse'), 2200)
			}
		}

		if (pulseDelay) setTimeout(start, pulseDelay)
		else start()

		if (pulseUntilClick) {
			const stop = () => {
				el.classList.remove('fab-pulse')
				el.removeEventListener('click', stop)
			}
			el.addEventListener('click', stop)
		}
	}

	resetPulse(el, options = {}) {
		el.classList.remove('fab-pulse')
		void el.offsetWidth // force reflow

		if (!this.isOpen) {
			this.startPulse(el, options)
		}
	}
}
