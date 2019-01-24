export default
Vue.component('top-header', {
	template: `
	<div>
		<header>
			<div class="container">
				<div class="logotype">
					<p>Smart <span>house</span></p>
				</div>
			</div>
		</header>
		<div class="nav-menu">
			<div class="container">
				<ul>
					<li class="active"><a href="#">Главная</a></li>
					<li><a href="#macros">Макросы</a></li>
					<li><a href="#">Все устройства</a></li>
					<li><a href="#" @click="logout">Выход</a></li>
				</ul>
			</div>
		</div>
	</div>
	`,
	methods: {
		logout: function() {
			localStorage.removeItem('token');
			window.location = '#';
		}
	}
});