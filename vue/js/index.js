import Auth from './componenets/auth.js';
import Home from './componenets/home.js';
import RoomDevices from './componenets/roomDevices.js';
import Macros from './componenets/macros.js';

const routes = {
	'': Auth,
	'home': Home,
	'roomDevices': RoomDevices,
	'macros': Macros,
};

window.API_URL = 'http://localhost:8888/module3/server/api/';

window.API = function(url, method, data, callback) {
	let options = {
		method: method,
		headers: new Headers({'Content-Type': 'application/json'})
	};

	if (data) {
		options.body = data;
	}
	if (localStorage.getItem('token')) {
		options.headers.append('Authorization', 'Bearer ' + localStorage.getItem('token'));
	}
	fetch(url, options).then(function(response) {
		response.json().then(function(data) {
			callback(data);
		})
	}); 
}

window.app = new Vue({
	el: '#app',
	data: {
		currentRoute: window.location.hash.replace('#', '').split('?')[0]
	},
	computed: {
		viewComponent: function() {
			return routes[this.currentRoute]
		},
	},
	render: function(h) {
		return h(this.viewComponent)
	}
});

window.addEventListener('popstate', function() {
	app.currentRoute = window.location.hash.replace('#', '').split('?')[0];
});
