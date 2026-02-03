<script>
class FloatingWidget{constructor(s,o={}){this.root=document.querySelector(s);if(!this.root){console.warn("FloatingWidget: container not found:",s);return}this.options=o,this.isOpen=!1,this.greetingVisible=!1,this.greetingTimer=null,this.render()}render(){this.container=document.createElement("div"),this.container.className="fab-container",this.renderGreeting(),this.renderItems(),this.renderMain(),this.root.appendChild(this.container)}renderGreeting(){const g=this.options.greeting;if(!g?.enabled)return;this.greetingVisible=!0,this.greeting=document.createElement("div"),this.greeting.className="fab-greeting",this.greeting.innerHTML=g.text,this.container.appendChild(this.greeting),g.autoHide&&typeof g.delay=="number"&&(this.greetingTimer=setTimeout(()=>this.hideGreeting(),g.delay))}hideGreeting(){if(!this.greetingVisible||!this.greeting)return;this.greetingVisible=!1,clearTimeout(this.greetingTimer),this.greeting.style.opacity="0",this.greeting.style.transform="translateY(10px)",setTimeout(()=>{this.greeting?.remove(),this.greeting=null},200)}renderItems(){this.itemsWrap=document.createElement("div"),this.itemsWrap.className="fab-items";(this.options.buttons||[]).forEach(btn=>{const i=document.createElement("div");i.classList.add("fab-item"),btn.classes&&(Array.isArray(btn.classes)?i.classList.add(...btn.classes):typeof btn.classes=="string"&&i.classList.add(...btn.classes.split(" "))),i.innerHTML=btn.icon||"+",btn.tooltip&&(i.appendChild(Object.assign(document.createElement("div"),{className:"fab-tooltip",innerHTML:btn.tooltip})),btn.alwaysShowLabel&&i.classList.add("show-label")),btn.background&&(i.style.background=btn.background),btn.color&&(i.style.color=btn.color),btn.hoverBackground&&(i.addEventListener("mouseenter",()=>{i.dataset.prevBg=i.style.background,i.style.background=btn.hoverBackground}),i.addEventListener("mouseleave",()=>{i.style.background=i.dataset.prevBg||""})),btn.pulse&&this.startPulse(i,btn),btn.onClick&&i.addEventListener("click",e=>{e.stopPropagation(),btn.onClick()}),this.itemsWrap.appendChild(i)}),this.container.appendChild(this.itemsWrap)}renderIcon(t){return t?typeof t=="string"&&!t.includes("<")&&/\.(svg|png|jpe?g|webp|gif)$/i.test(t)?`<img src="${t}" alt="" class="fab-main-icon">`:t:"☰"}renderMain(){this.mainBtn=document.createElement("div"),this.mainBtn.className="fab-main",this.mainBtn.innerHTML=this.renderIcon(this.options.mainIcon),this.mainBtn.addEventListener("click",()=>this.toggle());const p=this.options.pulse;p?.enabled&&p.target==="main"&&this.startPulse(this.mainBtn,p),this.container.appendChild(this.mainBtn)}toggle(){this.isOpen=!this.isOpen,this.container.classList.toggle("open",this.isOpen),this.greetingVisible&&this.hideGreeting(),this.updatePulseVisibility()}startPulse(e,{pulseDelay: t=0,pulseOnce: n=!1,pulseUntilClick: r=!1}={}){const s=()=>{e.classList.add("fab-pulse"),n&&setTimeout(()=>e.classList.remove("fab-pulse"),2200)};t?setTimeout(s,t):s(),r&&(e.addEventListener("click",()=>{e.classList.remove("fab-pulse")},!1))}updatePulseVisibility(){if(!this.mainBtn)return;this.container.querySelectorAll(".fab-pulse").forEach(e=>{this.isOpen?e.classList.add("paused"):e.classList.remove("paused")})}
}</script>
<style>
/* Container */
.fab-container{position:fixed;right:24px;bottom:24px;z-index:9999;font-family:system-ui,-apple-system,sans-serif}
/* Main */
.fab-main{width:56px;height:56px;border-radius:50%;background:#111;color:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 10px 30px rgba(0,0,0,.25);transition:transform .25s ease;user-select:none}
.fab-main:hover{transform:scale(1.05)}
/* Items */
.fab-items{display:flex;flex-direction:column;gap:12px;margin-bottom:12px;opacity:0;transform:translateY(10px);pointer-events:none;transition:all .25s ease}
.fab-container.open .fab-items{opacity:1;transform:translateY(0);pointer-events:auto}
.fab-item{width:48px;height:48px;border-radius:50%;background:#fff;color:#111;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 6px 20px rgba(0,0,0,.15);position:relative}
.fab-tooltip{position:absolute;right:60px;background:#111;color:#fff;padding:6px 10px;border-radius:6px;font-size:13px;white-space:nowrap;opacity:0;transform:translateX(5px);pointer-events:none;transition:.2s}
.fab-item:hover .fab-tooltip,.fab-item.show-label .fab-tooltip{opacity:1;transform:translateX(0)}
.fab-greeting{position:absolute;right:0;bottom:72px;background:#111;color:#fff;padding:12px 16px;border-radius:12px;max-width:240px;font-size:14px;box-shadow:0 10px 30px rgba(0,0,0,.25);animation:fadeUp .3s ease}
@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
/* Pulse */
@keyframes fabPulse{0%{box-shadow:0 0 0 0 rgba(0,0,0,.35)}70%{box-shadow:0 0 0 14px rgba(0,0,0,0)}100%{box-shadow:0 0 0 0 rgba(0,0,0,0)}}
.fab-pulse{animation:fabPulse 2s infinite}
.fab-pulse.paused{animation-play-state:paused}
.fab-main-icon{width:26px;height:26px;object-fit:contain;pointer-events:none}
.fab-item:hover.fab-pulse{animation-play-state:paused}
/* Custom classes */
.btn-phone{background:#2ecc71;color:#fff}
.btn-telegram{background:#229ED9;color:#fff}
.btn-mail{background:#f1c40f;color:#111}
.is-primary{box-shadow:0 0 0 3px rgba(0,0,0,.15)}
</style>
