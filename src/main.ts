import {createApp} from 'vue'
import './index.css'
import App from './App.vue'
import {router} from './router'
import {createPinia} from 'pinia';
import keycloakIns, {initializeKeycloak} from "./lib/keycloak";
import {keycloakDisabled} from "./const.ts";
import {useIndexStore} from "./stores";

const MODE = import.meta.env.MODE;

const pinia = createPinia();
console.log(MODE);


const startApp = async () => {
    const app = createApp(App)
        .use(pinia);
    if (!keycloakDisabled) {
        app.provide("$keycloak", keycloakIns);
        await initializeKeycloak(keycloakIns);
    }

    app.use(router);
    const indexStore = useIndexStore();
    if (indexStore.selectedOrganization === null) {
        await router.push('/organizations/select');
    }
    app.mount('#app');
}

startApp();