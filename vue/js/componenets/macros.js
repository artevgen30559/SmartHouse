import Header from './header.js';

export default
Vue.component('macros', {
	data: function() {
		return {
			macros: [],
			isCreate: false,
			qty: 0
		}
	},
	template: `
	<div>
		<top-header></top-header>
		<section class="macros">
			<div class="container">
				<div class="macro" v-for="macro of macros" :id="macro.id">
					<div class="macro__name">{{macro.name}}</div>
					<div class="macro__start" @click="macroStart(macro.id)">Запуск</div>
				</div>
				<new-macro v-if="isCreate" :qty="this.qty"></new-macro>
			</div>
		</section>
		<button class="add-macro" @click="createMacros">Добавить макрос</button>
	</div>
	`,
	methods: {
		macroStart: function(id) {
			var macroActive = $('.macro[id |= ' + id + ']');
			if (!macroActive.hasClass('active')) {
				API(API_URL + 'macros/' + id, 'GET', '', (result) => {
					console.log(result);
					macroActive.toggleClass('active');
				});
			} else {
				macroActive.toggleClass('active');
			}
		},
		createMacros: function() {
			this.isCreate = true;
			this.qty++;
		}
	},
	created: function() {
		self = this;
		API(API_URL + 'macros', 'GET', '', (result) => {
			self.macros = result;
			console.log(result);
		});
	}
});


Vue.component('new-macro', {
	props: ['qty'],
	data: function() {
		return {
			selectQty: 1,
			allDevices: [],
			selected: null,
			values: {
				value: '',
				name: ''
			}
		}
	},
	template: `
	<div class="new-macro">
		<div class="new-macro__macro" v-for="q of qty">
			<div class="info">
				<input type="text" class="new-macro__name" placeholder="Введите название">
				<div class="new-macro__parametrs" v-for="q of selectQty">
					<select class="new-macro__new-device" v-model="selected" @change="deviceSelected">
						<option class="new-device__name" disabled selected>Выберите устройство</option>
						<option v-for="device of allDevices" :value="{type_id: device.type_id}" class="new-device__name">{{device.name}}</option>
					</select>
					<select class="new-macro__new-value">
						<option value="1" class="new-value__name" disabled>Выберите значение</option>
						<option v-for="value of values" :value="value.value" class="new-value__name">{{value.name}}</option>
					</select>
				</div>
				<div class="more-device" @click="selectQty++">Еще</div>
			</div>
			<button class="new-macro-create">Готово</button>
		</div>
	</div>
	`,
	methods: {
		deviceSelected: function() {
			console.log(this.selected);
			if (this.selected.type_id == 1 || this.selected.type_id == 4) {
				this.values = [
					{
						name: 'Открыть',
						value: 'open'
					},
					{
						name: 'Закрыть',
						value: 'close'
					}
				];
			}
			if (this.selected.type_id == 2 || this.selected.type_id == 3) {
				this.values = [
					{
						name: 'Вкл',
						value: 'On'
					},
					{
						name: 'Выкл',
						value: 'Off'
					}
				];
			}
		}
	},
	mounted: function() {
		self = this;
		API(API_URL + 'devices', 'GET', '', (result) => {
			self.allDevices = result;
		});
	}
});