class FloatingWidget {
	constructor(selector, options={}) {
		this.root = document.querySelector(selector)
		if(!this.root) return
		this.options = options
		this.isOpen = false
		this.pulseTimer = null
		this.render()
	}

	render() {
		this.container = document.createElement('div')
		this.container.className = 'fab-container'

		this.renderMain()
		this.renderItems()

		this.root.appendChild(this.container)
	}

	renderMain() {
		this.mainBtn = document.createElement('div')
		this.mainBtn.className='fab-main'
		this.mainBtn.innerHTML = this.renderIcon(this.options.mainIcon)

		// mainStyle
		const s = this.options.mainStyle || {}
		if(s.background) this.mainBtn.style.background = s.background
		if(s.color) this.mainBtn.style.color = s.color

		// pulseColor
		const p = this.options.pulse||{}
		if(p.pulseColor) this.mainBtn.style.setProperty('--fab-pulse-color', p.pulseColor)

		this.mainBtn.addEventListener('click', ()=>this.toggle())

		if(p.enabled && p.target==='main') this.startPulse()

		this.container.appendChild(this.mainBtn)
	}

	renderItems(){
		this.itemsWrap = document.createElement('div')
		this.itemsWrap.className='fab-items'

		(this.options.buttons||[]).forEach(b=>{
			const btn=document.createElement('div')
			btn.className='fab-item'
			if(b.classes){
				if(Array.isArray(b.classes)) btn.classList.add(...b.classes)
				else btn.classList.add(...b.classes.split(' '))
			}
			if(b.background) btn.style.background=b.background
			if(b.color) btn.style.color=b.color
			if(b.icon) btn.innerHTML=b.icon

			// tooltip
			if(b.tooltip){
				const tip=document.createElement('div')
				tip.className='fab-tooltip'
				tip.innerHTML=b.tooltip
				if(b.tooltipStyle){
					if(b.tooltipStyle.background) tip.style.background=b.tooltipStyle.background
					if(b.tooltipStyle.color) tip.style.color=b.tooltipStyle.color
				}
				btn.appendChild(tip)
				if(b.alwaysShowLabel) btn.classList.add('show-label')
			}

			if(b.hoverBackground){
				btn.addEventListener('mouseenter',()=>{btn.dataset.prevBg=btn.style.background; btn.style.background=b.hoverBackground})
				btn.addEventListener('mouseleave',()=>{btn.style.background=btn.dataset.prevBg||''})
			}

			if(b.onClick) btn.addEventListener('click',e=>{e.stopPropagation(); b.onClick()})

			this.itemsWrap.appendChild(btn)
		})

		this.container.appendChild(this.itemsWrap)
	}

	renderIcon(icon){
		if(!icon) return ''
		if(typeof icon==='string' && !icon.includes('<') && /\.(svg|png|jpe?g|webp|gif)$/i.test(icon)){
			return `<img decoding="async" src="${icon}" class="fab-main-icon" alt="">`
		}
		return icon
	}

	startPulse(){
		const p = this.options.pulse||{}
		const delay = p.pulseDelay||2500
		this.resetPulse()
		this.pulseTimer = setInterval(()=>{
			if(!this.isOpen){
				this.mainBtn.classList.remove('fab-pulse')
				void this.mainBtn.offsetWidth
				this.mainBtn.classList.add('fab-pulse')
			}
		},delay)
	}

	resetPulse(){
		if(this.pulseTimer) clearInterval(this.pulseTimer)
		this.pulseTimer=null
		if(this.mainBtn) this.mainBtn.classList.remove('fab-pulse')
	}

	toggle(){
		this.isOpen=!this.isOpen
		this.container.classList.toggle('open',this.isOpen)
		const p=this.options.pulse||{}
		if(this.isOpen){
			this.resetPulse()
		}else{
			if(p.enabled && p.target==='main') this.startPulse()
		}
	}
}
