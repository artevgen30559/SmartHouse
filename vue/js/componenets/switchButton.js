export default
Vue.component('switch-button', {
	props: ['device'],
	data: function() {
		return {
			devices: [],
			reverseValue: {
				'close': 'open',
				'open': 'close',
				'on': 'off',
				'off': 'on'
			}
		}
	},
	template: `
	<div class="device__status">
		<input type="checkbox" class="status__checkbox" :id="device.id" :checked="device.value == 'on' || device.value == 'open'">
		<label :for="device.id" class="status__slider" @click="updateValue"></label>
	</div>
	`,
	methods: {
		updateValue: function() {
			self = this;
			var body = JSON.stringify({
				value: self.reverseValue[self.device.value]
			});
			API(API_URL + 'devices/' + self.device.id, 'PATCH', body, (result) => {
				self.device.value = self.reverseValue[self.device.value];
			});
		}
	},
	created: function() {

	}
});