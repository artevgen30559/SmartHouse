const NotFound = { template: 'not-found' }
const Home = { template: 'my-rooms' }
const Devices = { template: 'room-devices' }
const AllDevices = { template: 'all-devices' }
const Authorization = { template: 'auth' }
const Macros = { template: 'macros' }

const API_URL = 'http://localhost//module3/yii';

const routes = {
	'': Home,
	'devices': Devices,
	'alldevices': AllDevices,
	'auth' : Authorization,
	'macros' : Macros,
}

Vue.component('auth', {
	data: function() {
		return {
			username: [],
			password: [],
			errors: null
		}
	},
	template:
	`<div class="row auth">
	<div class="col-12">
	<p class="title">Авторизуйтесь</p>
	<form @submit.prevent="login">
	<div class="form_group">
	<input type="text" v-model="username" name="login" class="input_login" placeholder="Логин"/>
	</div>
	<div class="form_group">
	<input type="password" v-model="password" name="password" class="input_password" placeholder="Пароль">
	</div>
	<div class="form_group">
	<input type="submit" name="" placeholder="Вход" class="input_submit" value="Вход">
	</div>
	</form>
	<p>{{errors}}</p>
	</div>
	</div>`,
	methods: {
		login: function() {
			var self = this;

			fetch(API_URL + '/api/login', {
				method: 'post',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					login: self.username,
					password: self.password
				}),
			})
			.then(function(response) {
				response.json().then(function(data) {
					if(data.errors) {
						self.errors = data.errors.login[0];
					} else {
						localStorage.setItem('token', data.token);
						window.location.href = "/smarthouse/";
					}
				})
			})
		}
	}
});

Vue.component('my-rooms', {
	data: function() {
		return {
			isLoad: false,
			rooms: []
		}
	},
	props: ['rooms'],
	template:
	`<div>
	<div class="title">Мои комнаты</div>
	<div class="mb-3">
	<div v-for="room in rooms">
	<a :href="'/smarthouse/#devices?id='+room.id">
	<div class="row list__element">
	<div class="col-3 col-md-2 align-self-center">
	<img :src="'/smarthouse/img/'+room.photo" class="list__img">
	</div>
	<div class="col-7 col-md-8 align-self-center">
	<div class="list__description">
	{{room.name}}
	</div>
	</div>
	<div class="col-2 align-self-center">
	<div class="list__button">
	<div class="line"></div>
	<div class="line line_2"></div>
	</div>
	</div>
	</div>
	</a>
	</div>
	</div>
	<div v-if="isLoad">
		<my-favorite/>
	</div>
	</div>`,
	created: function() {
		var self = this;	

		fetch(API_URL + '/api/rooms', {
			method: 'get',
			headers: {
				'Authorization' : 'Bearer '+localStorage.getItem('token')
			}
		})
		.then(function(response) {
			console.log(response);
			response.json().then(function(data) {
				if(response.status == 200) {
					self.rooms = data;
					self.isLoad = true;
				}
				else if(response.status == 401) {
					window.location.href = "/smarthouse/#auth";
				}
				else {
					alert(response.statusText);
				}
			})
		})
	}
});

Vue.component('room-devices', {
	data: function() {
		return {
			devices: null, 
			roomName: null,
			isLoad: false,
			roomId: window.location.hash.replace('#', '').split('?id=')[1],
		}
	},	
	template: `
		<div v-if="isLoad">
			<device-list :devices="devices" :title="this.roomName"/>
		</div>`,
	created: function() {
		var self = this;	

		fetch(API_URL + '/api/rooms/'+this.roomId, {
			method: 'get',
			headers: {
				'Authorization' : 'Bearer '+localStorage.getItem('token')
			}
		})
		.then(function(response) {
			response.json().then(function(data) {
				if(response.status == 200) {
					self.roomName = data.name;
					self.getDevices();
				}
				else if(response.status == 401)
					window.location.href = "/smarthouse/#auth";
				else 
					alert(response.statusText)
			})
		})
	},
	beforeDestroy() {	
		clearInterval(this.interval)
	},
	methods: {
		getDevices: function() {
			var self = this;	

			this.interval = setInterval(function(){
				console.log('room decies');
				fetch(API_URL + '/api/rooms/'+self.roomId+'/devices', {
					method: 'get',
					headers: {
						'Authorization' : 'Bearer '+localStorage.getItem('token')
					}
				})
				.then(function(response) {
					response.json().then(function(data) {
						if(response.status == 200) {
							self.devices = data;
							self.isLoad = true;
						}
						else if(response.status == 401)
							window.location.href = "/smarthouse/#auth";
						else 
							alert(response.statusText)
					})
				})
			}, 1000)
		}
	}
});

Vue.component('all-devices', {
	data: function() {
		return {
			devices: []
		}
	},
	template: '<device-list :devices="devices" title="Все устройства"/>',
	beforeDestroy() {	
		clearInterval(this.interval)
	},
	created: function() {
		var self = this;

		this.interval = setInterval(function() {
			fetch(API_URL + '/api/devices', {
				method: 'get',
				headers: {
					'Authorization' : 'Bearer ' + localStorage.getItem('token')
				}
			})
			.then(function(response) {
				response.json().then(function(data) {
					if(response.status == 200) 
						self.devices = data
					else if(response.status == 401) 
						window.location.href = "/smarthouse/#auth";
					else 
						alert(response.statusText)
				})
			})
		}, 1000);
	}
});


Vue.component('device-list', {
	props: ['devices', 'title'],
	data: function() {
		return {
			devices: [],
			title: null
		}
	},
	template: `
	<div>
		<div class="title">{{title}}</div>

			<div v-for="device in devices" href="#devices">
			<div class="row list__element ">
			<div class="col-3 col-md-2 align-self-center">
			<img src="img/lamp.png" class="list__img">
			</div>
			<div class="col-6 col-md-8 align-self-center">
			<div class="list__description">
			{{device.name}} <p class="d-none">(id {{device.id}})</p>
			</div>
			</div>
			<div class="col-3 col-md-2 align-self-center text-center">
			<div class="list__button">

			<div v-if="device.type_id == 5 || device.type_id == 6" class="d-inline-block">
				<button-device-thermostat :device_type="device.type_id" :device_id="device.id" :value="device.value"/>
			</div>
			<div v-else>
			<button-device-checkbox :device_type="device.type_id" :device_id="device.id" :value="device.value"/>
			</div>
			</div>
			</div>
			</div>

		</div>
	</div>`
});

Vue.component('button-device-checkbox', {
	props: ['device_type', 'device_id', 'value'],
	data: function() {
		return {
			type: this.device_type,
			id: this.device_id,
			value: this.value,
			reverseValue: {
				'close': 'open',
				'open': 'close',
				'on': 'off',
				'off': 'on'
			}
		}		
	},
	template: `
	<label class="switch">
	<input type="checkbox" :checked="this.value == 'open' || this.value == 'on'">
	<span v-on:click="updateDevice" class="slider"></span>
	</label>`,
	methods: {
		updateDevice: function() {
			self = this;
			var newValue = eval('this.reverseValue.' + this.value)

			fetch(API_URL + '/api/devices/'+this.id, {
				method: 'PATCH',
				headers: {
					'Authorization': 'Bearer ' + localStorage.getItem('token'),
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					value: newValue
				})
			})
			.then(function(response) {
				response.json().then(function(data) {
					if(response.status == 200) 
						self.value = newValue;
					else if(response.status == 401)
						window.location.href = "/smarthouse/#auth";
					else 
						alert(response.statusText)
				})
			})
		}
	}
});

Vue.component('button-device-thermostat', {
	props: ['device_type', 'device_id', 'value'],
	data: function() {
		return {
			temperature: {
				min: 0,
				max: 100
			},
			thermostat: {
				min: 10,
				max: 30
			},
			value: null
		}
	},
	template: `
	<div class="temperature-button">
		<div class="button minus" v-on:click="minus">
		<span></span>
		</div>
		<input type="number" :value="this.value" min="this.6.min" max="this.6.max">
		<div class="button plus" v-on:click="plus">
		<span></span>
		</div>
	</div>`,
	methods: {
		plus: function() {
			if(this.device_type == 5) {
				if(this.value < this.temperature.max) {
					this.value++;
					this.updateDevice();
				}
			}
			if (this.device_type == 6) {
				if(this.value < this.thermostat.max) {
					this.value++;
					this.updateDevice();
				}
			}
		},
		minus: function() {
			if(this.device_type == 5) {
				if(this.value > this.temperature.min) {
					this.value--;
					this.updateDevice();
				}
			}
			if (this.device_type == 6) {
				if(this.value > this.thermostat.min) {
					this.value--;
					this.updateDevice();
				}
			}
		},
		updateDevice: function() {
			var self = this;

			fetch(API_URL + '/api/devices/'+this.device_id, {
				method: 'PATCH',
				headers: {
					'Authorization': 'Bearer ' + localStorage.getItem('token'),
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					value: self.value
				})
			})
			.then(function(response) {
				response.json().then(function(data) {
					if(response.status == 200)
						console.log('ok'); 	
					else if(response.status == 401)
						window.location.href = "/smarthouse/#auth";
					else 
						alert(response.statusText)
				})
			})
		},
	}
});

Vue.component('my-favorite', {
	data: function() {
		return {
			favorite: [],
			isLoad: false,
		}
	},
	template: `
	<div v-if="isLoad">
		<device-list v-if="favorite" :devices="favorite" title="Избранное"/>
		<p v-else>Здесь пока ничего нет</p>
	</div>`,
	beforeDestroy() {	
		clearInterval(this.interval)
	},
	created: function() {
		var self = this;

		this.interval = setInterval(function() {
			fetch(API_URL + '/api/devices', {
					method: 'get',
					headers: {
						'Authorization' : 'Bearer ' + localStorage.getItem('token')
					}
				})
				.then(function(response) {
					response.json().then(function(data) {
						if(response.status == 200) {
							self.favorite = [];
							self.isLoad = true;

							data.map(function(elem, index) {
								if(elem.favorite == 1) {
									self.favorite.push(elem);
								}
							});
						}
						else if(response.status == 401)
							window.location.href = "/smarthouse/#auth";
						else 
							alert(response.statusText)
					})
				})
		}, 1000)
	}
})

Vue.component('macros', {
	data: function() {
		return {
			newMacros: false,
			macros: []
		}
	},
	props: ['macros'],
	template: `
	<div>
		<h1>Макросы</h1>
			<div v-for="macro in macros" :key="macro.id" class="list__element">
			<div class="row">
			<div class="col-5 col-md-8 col-lg-9">{{macro.name}}</div>
			<div class="col-4 col-md-2 col-lg-1">
			<a href="" v-on:click.prevent="startMacros(macro.devices[0].macro_id)">Запустить</a>
			</div>
			<div class="col-3 col-md-2 col-lg-2">
			<a class="red" v-on:click.prevent="deleteMacros(macro.devices[0].macro_id)">Удалить</a>
			</div>
			</div>
			</div>
			
			<div v-if="this.newMacros">
				<create-new-macros/>
			</div>

			<div class="add_macros" v-on:click="createMacros">
			<span></span>
		</div>
	</div>`,
	created: function() {
		var self = this;

		fetch(API_URL + '/api/macros', {
			method: 'get',
			headers: {
				'Authorization' : 'Bearer ' + localStorage.getItem('token')
			}
		})
		.then(function(response) {
			response.json().then(function(data) {
				if(response.status == 200) 
					self.macros = data
				else if(response.status == 401)
					window.location.href = "/smarthouse/#auth";
				else 
					alert(response.statusText);
			})
		})
	},
	methods: {
		startMacros: function(id) {
			fetch(API_URL + '/api/macros/'+id, {
				method: 'get',
				headers: {
					'Authorization' : 'Bearer ' + localStorage.getItem('token')
				}
			})
			.then(function(response) {
				response.json().then(function(data) {
					if(response.status == 200) 
						alert('Макрос запущен');
					else if(response.status == 401)
						window.location.href = "/smarthouse/#auth";
					else 
						alert(response.statusText)
				})
			})
		},
		deleteMacros: function(id) {
			fetch(API_URL + '/api/macros/'+id, {
				method: 'DELETE',
				headers: {
					'Authorization' : 'Bearer ' + localStorage.getItem('token')
				}
			})
			.then(function(response) {
				response.json().then(function(data) {
					if(response.status == 200) 
						window.location.reload();
					else if(response.status == 401)
						window.location.href = "/smarthouse/#auth";
					else 
						alert(response.statusText)
				})
			})
		},
		createMacros: function() {
			this.newMacros = true;
		}
	}
});

Vue.component('create-new-macros', {
	data: function() {
		return {
			newMacros: {
				name: null,
				devices: [],
			},
			qty: 0,
			devices: [],
			values: {
				switch: {
					"вкл": "on",
					off: {
						name: 'Выкл',
						value: 'off'
					}
				}
			},
			selected: [],
		}
	},
	template: `
	<div class="list__element">
	<div class="row">
		<div class="col-12 col-md-3">
			<input v-model="newMacros.name" type="text" class="input_macros-name" placeholder="Введите название"/>
		</div>
		
		<div class="col-12 col-md-3">
			<select name="Выбрать устройство" data-device-id="0" class="select-device" @change="deviceSelected(0)">
				<option value="" selected disabled>Выбрать устройство</option>

				<option 
					v-for="device in devices" 
					:value="device.id" 
					:data-device-type="device.type_id">
					{{device.name}}
				</option>

			</select>
		</div>

		<div class="col-12 col-md-3">
			<select name="" class="select-state" data-device-value="0" @change="stateSelected(0)">
				<option value="" disabled selected>Выбрать состояние</option>
				<option v-for="select in selected[0]" :value="select.value">
					{{select.name}}
				</option>
			</select>
		</div>
		
		<div class="col-12 col-md-3 d-none d-md-block"><a href="" v-on:click.prevent="save">Сохранить</a></div>

	</div>

	<div class="row" v-for="q in qty">
		<div class="col-12 col-md-3 offset-0 offset-md-3">
			<select name="Выбрать устройство" :data-device-id="q" class="select-device" @change="deviceSelected(q)">
				<option value="" selected disabled>Выбрать устройство</option>
				
				<option 
				v-for="device in devices" 
				:value="device.id" 
				:data-device-type="device.type_id">
				{{device.name}}
				</option>

			</select>
		</div>

		<div class="col-12 col-md-3">
			<select name="" class="select-state" :data-device-value="q" @change="stateSelected(q)">
				<option value="" disabled selected>Выбрать состояние</option>
				<option v-for="select in selected[q]" :value="select.value">
					{{select.name}}
				</option>
			</select>
		</div>
	
	</div>
	<!--{{selected}}
	<div class="row">
		<a class="col-md-3 offset-3" v-on:click.prevent="qty++">Добавить</a>
	</div>-->

	<div class="d-block d-md-none text-center"><a href="" v-on:click.prevent="save">Сохранить</a></div>

</div>`,
	mounted: function() {
		var self = this;

		fetch(API_URL + '/api/devices', {
			method: 'get',
			headers: {
				'Authorization' : 'Bearer ' + localStorage.getItem('token'),
			}
		})
		.then(function(response) {
			response.json().then(function(data) {
				if(response.status == 200)
					self.devices = data;
				else if(response.status == 401)
					window.location.href = "/smarthouse/#auth";
				else 
					alert(response.statusText)
			})
		});
	},
	methods: {
		deviceSelected: function(index) {
    	var deviceId = document.querySelector('[data-device-id="'+index+'"]').value;
    	this.newMacros.devices[index] = {id: deviceId};
    	this.qty++;
    	var self = this;

    	this.devices.map(function(device) {
    		if(device.id == deviceId) {
    			//Перключатель замков и карнизов
    			if(device.type_id == 1 || 
    				 device.type_id == 4) {
    				self.selected[index] = [
    					{
    						name: 'Открыто',
    						value: 'open'
    					}, 
    					{
    						name: 'Закрыто',
    						value: 'close'
    					}
    				];
    			}
    			//Переключатель для люстр и светильников
    			if(device.type_id == 2 || 
    				 device.type_id == 3) {
    				self.selected[index] = [
    					{
    						name: 'Вкл',
    						value: 'on'
    					}, 
							{
    						name: 'Выкл',
    						value: 'off'
    					}, 
    				]
    			}

    			if(device.type_id == 5) {
    				var temp = [];
    				for(var i = -100; i <= 100; i++) {
    					temp.push({name: i, value: i});
    				}

    				self.selected[index] = temp;
    			}

    			if(device.type_id == 6) {
    				var temp = [];
    				for(var i = 10; i <= 30; i++) {
    					temp.push({name: i, value: i});
    				}

    				self.selected[index] = temp;
    			}
    		}
    	});
		},
		stateSelected: function(i) {
			var deviceValue = document.querySelector('[data-device-value="'+i+'"]').value;
			this.newMacros.devices[i].value = deviceValue;
		},
		save: function() {
			var self = this;
			if(!this.newMacros.name) {
				alert('Введите название макроса');
				return 0;
			}

			fetch(API_URL + '/api/macros', {
				method: 'POST',
				headers: {
					'Content-Type' : 'application/json',
					'Authorization' : 'Bearer ' + localStorage.getItem('token')
				},
				body: JSON.stringify(self.newMacros)
			})
			.then(function(response) {
				response.json().then(function(data) {
					if(response.status == 200) {
						alert('Макрос успешно создан');
						window.location.reload();
					}
					else if(response.status == 401)
						window.location.href = "/smarthouse/#auth";
					else 
						alert(response.statusText)
				})
			});
		}
	}
});

Vue.component('not-found', {
	template: `<center><h1>Page not found</h1></center>`
});

var app = new Vue({
	el: '#app',
	data: {
		currentRoute: window.location.hash.replace('#', '').split('?')[0],
	},
	computed: {
		ViewComponent() {
			return routes[this.currentRoute] || NotFound
		}
	},
	render: function (h) {
		return h(this.ViewComponent.template);
	}
})

window.addEventListener('popstate', () => {
	app.currentRoute = window.location.hash.replace('#', '').split('?')[0];
	changeMenuState();
});

document.getElementById('logout').onclick = function() {
	localStorage.removeItem('token');
	window.location.href = "/smarthouse/#auth";
};

changeMenuState = function() {
	if(app.currentRoute != '' && app.currentRoute != 'auth' && app.currentRoute != '#') {
		document.getElementById('menu').classList.add('back');
	} else {
		document.getElementById('menu').classList.remove('back');
	}
}

//шторка
for (i = 0; i < document.querySelectorAll('.menu-close').length; ++i) {
	document.querySelectorAll('.menu-close')[i].addEventListener("click", function() {
		var slide = document.getElementById('slide');
		if(slide.style.visibility == 'visible') {
			slide.style.visibility = 'hidden';
			slide.style.marginLeft = '-300px';
		}
	})
};

document.getElementById('menu').onclick = function(e) {
	var slide = document.getElementById('slide');

	if(!this.classList.contains('back') && slide.style.visibility == 'hidden'){
		slide.style.visibility = 'visible';
		slide.style.marginLeft = '0';
	} else {
		history.back('1');
	}
}

