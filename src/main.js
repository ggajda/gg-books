import { createApp } from 'vue'
import App from './App.vue'
import { Quasar, Notify } from 'quasar'
import quasarUserOptions from './quasar-user-options'

createApp(App).use(Quasar, { plugins: { Notify }, config: { notify: {} }}, quasarUserOptions).mount('#app')
