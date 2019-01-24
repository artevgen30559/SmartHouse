const Home = {template: 'roomspage'}
const Loginpage = {template: 'loginpage'}
const Roompage = {template: 'room-devices'}
const Macrospage = {template: 'macrospage'}

const routes = {
	'': Home,
	'loginpage': Loginpage,
	'room-devices': Roompage,
	'macrospage': Macrospage
}

const apiUrl = '/smarthouse/api_server/';
const siteUrl = '/smarthouse/vuejs/';


Vue.component('top-menu', {
	data: function() {
		return {
			siteUrl: siteUrl
		}
	},
	props: ['title', 'roomBg'],
	methods: {
		burger: function() {
			changeMenuStatus();
		}
	},
	template: `
	<div>
		<nav class="nav-menu">
			<a :href="'#'">Мои комнаты</a>
			<a href="/smarthouse/vuejs/#macrospage">Макросы</a>
			<a href="#">Девайсы</a>
			<a href="#" class="logout">Выйти из аккаунта</a>
		</nav>
		<header :style="roomBg">
			<div class="container">
				<div class="row align-items-center" style="position: relative;">
					<div class="col-3">
						<div class="header__logotype">
							<img src="imgs/logotype.svg" alt="logotype">
						</div>
					</div>
					<div class="col-6">
						<div class="header__caption">
							<h2>{{title}}</h2>
						</div>
					</div>
					<div class="col-3">
						<div class="header__burger-menu">
							<img src="imgs/menu_bar.png" alt="menu" id="menu" v-on:click="burger">
						</div>
					</div>
				</div>
			</div>
		</header>
	</div>
	`
});

Vue.component('macrospage', {
	data: function() {
		return {
			macros: [],
			newMacros: false,
			qty: 0
		}
	},
	created: function() {
		self = this;
		fetch(apiUrl + 'api/macros', {
			method: 'get',
			headers: {
				'Authorization': 'Bearer ' + localStorage.getItem('token')
			}
		}).then(function(response) {
			response.json().then(function(data) {
				self.macros = data;
			})
		})
	},
	methods: {
		doMacros: function(id) {
			self = this;
			fetch(apiUrl + 'api/macros/' + id, {
				method: 'get',
				headers: {
					'Authorization': 'Bearer ' + localStorage.getItem('token')
				}
			}).then(function(response) {
				if (response.status == 200) {
					appStatus.response = 'Макрос успешно выполнен';
					appStatus.appearStatus();
				}
				console.log(response);	
			})
		},
		createMacros: function() {
			this.qty++;
			this.newMacros = true;
		}
	},
	template: `
	<div>
		<top-menu title="Макросы"></top-menu>
		<div class="new-macros">
			<button v-on:click="createMacros">Новый макрос</button>
		</div>
		<section class="macros-list">
			<div class="container">
				<div class="macros" v-for="macro in macros">
					<div class="row align-items-center">
						<div class="col-7">
							<div class="macros__name">
								<p>{{macro.name}}</p>
							</div>
						</div>
						<div class="col-2">
							<div class="macros__edit">
								<img src="imgs/edit.png">
								<span>Ред.</span>
							</div>
						</div>
						<div class="col-3">
							<div class="macros__play" v-on:click="doMacros(macro.id)">
								<img src="imgs/play.png">
								<span>Запуск</span>
							</div>
						</div>
					</div>
				</div>
				<create-macros v-if="newMacros" :qty="this.qty"></create-macros>
			</div>
		</section>

	</div>
	`
});

Vue.component('create-macros', {
	data: function() {
		return {
			macrosName: null,
			devices: []	
		}
	},
	created: function() {
		self = this;
		
		fetch(apiUrl + 'api/devices', {
			method: 'get',
			headers: {
				'Authorization': 'Bearer ' + localStorage.getItem('token')
			}
		}).then(function(response) {
			response.json().then(function(data) {
				self.devices = data;		
			})
		})
	},
	methods: {
		deviceNameSelected: function() {
			console.log(test);	
		}
	},
	props: ['qty'],
	template: `
	<div>
		<div class="macros" v-for="q in qty">
			<div class="row align-items-center">
				<div class="col-12">
					<div class="new-macros__name">
						<input type="text" placeholder="Название макроса" :value="macrosName"> 
					</div>
				</div>
				<div class="col-6">
					<div class="device__name">
						<select v-on:change="deviceNameSelected">
							<option>Устройство</option>
							<option v-for="device of devices" :value="device.id" :data-device-type="device.type_id">{{device.name}}</option>
						</select>
					</div>
				</div>
				<div class="col-6">
					<div class="device__status">
						<select>
							<option>Состояние</option>
						</select>
					</div>
				</div>
			</div>
		</div>
	</div>	
	`
});

Vue.component('loginpage', {
	data: function() {
		return {
			username: null,
			password: null
		}
	},
	created: function() {
		if (localStorage.getItem('token') != '') {
			window.location.href = '/smarthouse/vuejs';
		}
	},
	methods: {
		login: function() {
			var self = this;
			
			fetch(apiUrl + 'api/login', {
				method: 'post',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					login: self.username,
					password: self.password
				})
			}).then(function(response) {
				response.json().then(function(data) {
					if (data.errors) {
						appStatus.response = data.errors.login;	
					} else {
						localStorage.setItem('token', data.token);
						window.location.href = '/smarthouse/vuejs/#';
					}
				})
			})
		}
	},
	template: `
	<div>
		<div class="auth-bg"></div>
		<section class="auth">
			<div class="container">
				<div class="row justify-content-center">
					<div class="col-12">
						<div class="auth_logotype">
							<img src="imgs/logotype.svg" alt="logotype">
						</div>
					</div>
					<div class="col-12 col-lg-6">
						<form method="post" v-on:submit.prevent="login">
							<input v-model="username" type="text" placeholder="Введите логин..." id="username" name="password">
							<input v-model="password" type="text" placeholder="Введите пароль..." id="password" name="password">
							<button type="submit" class="auth_submit">Войти</button>
						</form>
					</div>
				</div>
			</div>
		</section>
	</div>
	`
});

Vue.component('roomspage', {
	data: function() {
		return {
			rooms: []
		}
	},
	methods: {
		logout: function() {
			localStorage.removeItem('token');
			window.location.href = '/smarthouse/vuejs/#loginpage';
		}
	},
	created: function() {
		var self = this;
		fetch(apiUrl + 'api/rooms', {
			method: 'get',
			headers: {
				'Authorization': 'Bearer ' + localStorage.getItem('token')
			}
		}).then(function(response) {
			response.json().then(function(data) {
				console.log(response);
				if (response.statusText == 'Unauthorized') {
					window.location.href = '/smarthouse/vuejs/#loginpage';	
				} else {
					this.roomName = data.name;
					self.rooms = data;
				}	
			})
		})	
	},
	template: `
	<div>
		<top-menu title="Мои комнаты"></top-menu>
		<section class="rooms-list">
			<div class="container">
				<div class="room" v-for="room of rooms">
					<a :href="'/smarthouse/vuejs/#room-devices?id=' + room.id" class="room__link">
						<div class="row align-items-center">
							<div class="col-6">
								<div class="room__name">
									<span>{{room.name}}</span>
								</div>		
							</div>
							<div class="col-6">
								<div class="room__preview_align">
									<div class="room__preview">
										<img v-bind:src="'/smarthouse/vuejs/imgs/' + room.photo">
									</div>	
								</div>
							</div>
						</div>
					</a>
				</div>
			</div>
		</section>
		<favorite></favorite>
	</div>	
	`
});

Vue.component('favorite', {
	data: function() {
		return {
			favorite: [],
			isLoad: false
		}
	},
	template: `
	<div>
		<section class="favorite">
			<div class="favorite__caption">
				<h2>Избранное</h2>
			</div>
			<div class="container">
				<div class="favorite__room" v-if="isLoad">
					<div class="room__name">
						<span>Кухня</span>
					</div>
					<div class="room__devices">
						<div class="row align-items-center">
							<div class="col-6">
								<div class="room__devices-name">
									<span>Окно</span>
								</div>
							</div>
							<div class="col-6">
								<div class="room__devices-status">
									<div class="devices-status__switch">
										<input type="checkbox" id="switch__check2" class="switch__check">
										<label for="switch__check2" class="switch__slider"></label>
									</div>
								</div>
							</div>
						</div>	
					</div>	
				</div>
				<div class="favorite-none" v-else>
					<p>Здесь пока ничего нет.</p>
				</div>
			</div>
		</section>
	</div>
	`
});

Vue.component('room-devices', {
	data: function() {
		return {
			roomDevices: [],
			roomId: window.location.hash.replace('#', '').split('?id=')[1],
			roomName: null,
			roomBg: null
		}
	},
	created: function() {
		var self = this;
		fetch(apiUrl + 'api/rooms/' + self.roomId + '/devices', {
			method: 'get',
			headers: {
				'Authorization': 'Bearer ' + localStorage.getItem('token')
			}
		}).then(function(response) {
			response.json().then(function(data) {
				self.roomDevices = data;				
			})
		})
		// get roomName
		fetch(apiUrl + 'api/rooms/' + self.roomId, {
			method: 'get',
			headers: {
				'Authorization': 'Bearer ' + localStorage.getItem('token')
			}
		}).then(function(response) {
			response.json().then(function(data) {
				self.roomName = data.name;
				self.roomBg = data.photo;
			})
		})
	},
	template: `
	<div>
		<top-menu :title="roomName" :roomBg="'background: url(imgs/' + roomBg + ') center center, rgba(26, 54, 218, 0.5)'"></top-menu>
		<section class="room">
			<div class="container">
				<div class="room__devices">
					<device-list :devices="roomDevices"></device-list>	
				</div>
			</div>
		</section>
	</div>
	`
});

Vue.component('device-list', {
	props: ['devices'],
	template: `
	<div>
		<div class="device" v-for="device in devices">
			<div class="row align-items-center">
				<div class="col-5">
					<div class="room__devices-name">
						<span>{{device.name}}</span>
					</div>
				</div>
				<div class="col-7">
					<div class="room__devices-status">
						<device-component :value="device.value" :deviceId="device.id" :deviceType="device.type_id"></device-component>
					</div>
				</div>
			</div>
		</div>
	</div>
	`
});

Vue.component('device-component', {
	props: ['deviceId', 'value', 'deviceType'],
	data: function() {
		return {
			currentValue: this.value,
			newValue: null,
			reverseValue: {
				'off': 'on',
				'open': 'close',
				'on': 'off',
				'close': 'open'
			}
		}
	},
	computed: {
		updateInput: function() {
			this.currentValue = this.newValue;
		} 
	},
	methods: {
		updateSlider: function() {
			this.newValue = eval('this.reverseValue.' + this.currentValue);
			this.updateValueOnServer();	
		},
		updateCounterPlus: function() {
			self = this;
			if (self.deviceType == 5) {
				if (self.currentValue < 100) {
					self.newValue = parseInt(self.currentValue) + 1;
					this.updateValueOnServer();
				}
			}
			if (self.deviceType == 6) {
				if (self.currentValue < 30) {
					self.newValue = parseInt(self.currentValue) + 1;
					this.updateValueOnServer();	
				}
			}		
		},
		updateCounterMinus: function() {
			self = this;
			if (self.deviceType == 5) {
				if (self.currentValue > -100) {
					self.newValue = parseInt(self.currentValue) - 1;
					this.updateValueOnServer();
				}
			}
			if (self.deviceType == 6) {
				if (self.currentValue > 10) {
					self.newValue = parseInt(self.currentValue) - 1;
					this.updateValueOnServer();	
				}
			}		
		},
		updateValueOnServer: function() {
			self = this;
			fetch(apiUrl + 'api/devices/' + self.deviceId, {
				method: 'PATCH',
				headers: {
					'Authorization': 'Bearer ' + localStorage.getItem('token'),
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					value: self.newValue
				})
			}).then(function(response) {
				response.json().then(function(data) {
					self.currentValue = self.newValue;
				})
			})
		}
	},
	template: `
	<div>
		<div class="devices-status__count" v-if="deviceType == 5 || deviceType == 6">
			<div class="minus" v-on:click="updateCounterMinus"><img src="imgs/minus-icon.png"></div>
			<div class="plus" v-on:click="updateCounterPlus"><img src="imgs/plus-icon.png"></div>
			<input type="text" :value="currentValue">	
		</div>
		<div class="devices-status__switch" v-else>
			<input type="checkbox" :id="deviceId" class="switch__check" :checked="currentValue == 'on' || currentValue == 'open'">
			<label :for="deviceId" class="switch__slider" v-on:click="updateSlider"></label>
		</div>
	</div>
	`
});


var appStatus = new Vue({
	el: '#app-status',
	data: {
		response: []
	},
	methods: {
		appearStatus: function() {
			$('#app-status').addClass('active');
			if (this.response.length != 0) {
				return this.response
			}	
		}
	}
});

var app = new Vue({
	el: '#app',
	data: {
		currentRoute: window.location.hash.replace('#', '').split('?')[0]
	},
	computed: {
		viewComponent: function() {
			return routes[this.currentRoute]	
		}
	},
	render: function(h) {
		return h(this.viewComponent.template)	
	}
});

// burger menu
function changeMenuStatus() {
	$('.nav-menu').toggleClass('active');
	$('body').on('click', function(event) {
		if (!$('#menu').is(event.target)) {
			$('.nav-menu').removeClass('active');	
		} 	
	});
}

// logout
$('.logout').on('click', function(e) {
	e.preventDefault();
	localStorage.removeItem('token');
	window.location.href = '/smarthouse/vuejs/#loginpage';
})

// auto-update link location
window.onpopstate = function() {
	document.getElementById('app-status').classList.remove('active');
	app.currentRoute = window.location.hash.replace('#', '').split('?')[0]; 
}
