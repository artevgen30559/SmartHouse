export default
Vue.component('loginpage', {
	data: function() {
		return {
			username: null,
			password: null
		}
	},
	template: `
	<div>
		<div class="login-bg"></div>
		<div class="logotype big">
			<p>Smart <span>house</span></p>
		</div>
		<form method="POST" class="login-form" @submit.prevent="login">
			<div class="container">
				<input type="text" placeholder="Имя" class="form__login" v-model="username">
				<input type="password" placeholder="Пароль" class="form__password" v-model="password">
				<button class="form__btn" type="submit">Войти</button>
			</div>
		</form>
	</div>
	`,
	created: function() {
		if (localStorage.getItem('token')) {
			window.location = '#home';
		}
	},
	methods: {
		login: function() {
			self = this;
			var body = JSON.stringify({
				login: self.username,
				password: self.password
			});
			API(API_URL + 'login', 'POST', body, (result) => {
				if (result.errors) {
					$('.login-form').addClass('invalid shake');
					setTimeout(function() {
						$('.login-form').removeClass('invalid');
					}, 1000);
				} else {
					localStorage.setItem('token', result.token);
					window.location = '#home';
				}
			});
		}
	}
});