export default
Vue.component('temperature-status', {
	props: ['device'],
	data: function() {
		return {
			temperature: {
				max: 100,
				min: -100
			},
			termostat: {
				max: 30,
				min: 0
			}
		}
	},
	template: `
	<div class="device__status">
		<div class="temperature">
			<div class="minus" @click="updateMinus">-</div>
			<div class="temperature__status">{{device.value}}</div>
			<div class="plus" @click="updatePlus">+</div>
		</div>
	</div>
	`,
	methods: {
		updatePlus: function() {
			self = this;
			if (self.device.type_id == 5) {
				if (self.device.value < self.temperature.max) {
					self.device.value++;
				}
			}
			if (self.device.type_id == 6) {
				if (self.device.value < self.termostat.max) {
					self.device.value++;
				}
			}
			this.updateValue;
		},
		updateMinus: function() {
			self = this;
			if (self.device.type_id == 5) {
				if (self.device.value > self.temperature.min) {
					self.device.value--;
				}
			}
			if (self.device.type_id == 6) {
				if (self.device.value > self.termostat.min) {
					self.device.value--;
				}
			}
			this.updateValue;
		}
	},
	computed:  {
		updateValue: function() {
			self = this;
			var body = JSON.stringify({
				value: self.device.value
			});
			API(API_URL + 'devices/' + self.device.id, 'PATCH', body, (result) => {
				return self.device.value;
				console.log(result);
			});
		}
	}
});