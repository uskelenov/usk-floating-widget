# usk-floating-widget

## How to use
1. Connecting the bundle: "usk-floating-widget.bundle.js"
```
<script src="usk-floating-widget.bundle.js"></script>
```
2. Add an HTML widget with the "fab-widget" class
```
<div id="fab-widget"></div>
```

3. Initialization
```
<script>
document.addEventListener('DOMContentLoaded',()=>{
	new FloatingWidget('#fab-widget',{
		mainIcon:'/icons/chat.svg',
		greeting:{enabled:true,text:'Привет! 👋<br>Чем могу помочь?',autoHide:true,delay:null},
		pulse:{enabled:true,target:'main',pulseDelay:3000,pulseUntilClick:true},
		buttons:[
			{icon:'📞',tooltip:'Позвонить',background:'#2ecc71',color:'#fff',pulse:true,pulseDelay:2000,pulseOnce:true,onClick:()=>alert('Звонок')},
			{icon:'💬',tooltip:'Telegram',background:'#229ED9',color:'#fff',hoverBackground:'#1c8acb',alwaysShowLabel:true,classes:['btn-telegram','is-primary'],onClick:()=>window.open('https://t.me/','_blank')},
			{icon:'✉️',tooltip:'Email',background:'#f1c40f',color:'#111',classes:'btn-mail',onClick:()=>alert('Письмо')}
		]
	})
});
</script>
```
