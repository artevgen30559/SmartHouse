import Header from './header.js';
import Switch from './switchButton.js';
import Temperature from './temperature.js';

export default
Vue.component('room-devices', {
	data: function() {
		return {
			roomId: window.location.hash.replace('#', '').split('?id=')[1],
			roomName: null,
			devices: []
		}
	},
	template: `
	<div>
		<top-header></top-header>
		<div class="room__devices">
			<div class="container">
				<div class="devices">
					<div class="device" v-for="device of devices">
						<div class="device__name">
							<span>{{device.name}}</span>
						</div>
						<temperature-status v-if="device.type_id == 5 || device.type_id == 6" :device="device"></temperature-status>
						<switch-button :device="device" v-else></switch-button>
					</div>
				</div>
			</div>
		</div>
	</div>
	`,
	methods: {
		
	},
	created: function() {
		self = this;
		API(API_URL + 'rooms/' + self.roomId, 'GET', '', (result) => {
			self.roomName = result.name;
		});
		API(API_URL + 'rooms/' + self.roomId + '/devices', 'GET', '', (result) => {
			self.devices = result;
		});
		var update = setInterval(function() {
			API(API_URL + 'rooms/' + self.roomId + '/devices', 'GET', '', (result) => {
				self.devices = result;
			});
		}, 1000);
	},
	Destroyed: function() {
		clearInterval(update);
	}
});