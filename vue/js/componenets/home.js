import Header from './header.js';

export default
Vue.component('homepage', {
	data: function() {
		return {
			rooms: [],
			devices: []
		}
	},
	template: `
	<div>
		<top-header></top-header>
		<section class="rooms">
			<div class="container">
				<div class="room" v-for="room in rooms">
					<a :href="'#roomDevices?id='+room.id">
						<div class="room__info">
							<div class="info__name">
								<span>{{room.name}}</span>
							</div>
							<div class="info__preview">
								<img src="imgs/5.png">
							</div>
						</div>
					</a>
				</div>
			</div>
		</section>
	</div>
	`,
	created: function() {
		API(API_URL + 'rooms', 'GET', '', (result) => {
			this.rooms = result;
		});
		API(API_URL + 'devices', 'GET', '', (result) => {
			this.devices = result;
		});
	}
});