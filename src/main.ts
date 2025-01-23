import { createApp } from "vue";
import "./index.css";
import App from "./App.vue";
import { router } from "./router";
import { createPinia } from "pinia";
import keycloakIns, { initializeKeycloak } from "./lib/keycloak";
import { keycloakDisabled } from "./const.ts";
import {useIndexStore} from "./stores";
import { plugin, defaultConfig } from '@formkit/vue';
import { genesisIcons } from '@formkit/icons'
import { rootClasses } from '../formkit.theme.ts';
import { de } from '@formkit/i18n';
import { createMultiStepPlugin } from '@formkit/addons';
import '@formkit/addons/css/multistep';
import { createAutoAnimatePlugin } from '@formkit/addons';
import {useOrganizationsStore} from "./stores/organizations.ts";

const MODE = import.meta.env.MODE;

const pinia = createPinia();
console.log(MODE);

const startApp = async () => {
  const app = createApp(App).use(pinia);
  app.use(plugin, defaultConfig({
    config: {
      rootClasses
    },
    icons: {
      ...genesisIcons
    },
    locales: { de },
    locale: 'de',
    plugins: [
        createMultiStepPlugin(),
        createAutoAnimatePlugin()
    ]
  }));
  if (!keycloakDisabled) {
    app.provide("$keycloak", keycloakIns);
    await initializeKeycloak(keycloakIns);
  }

  app.use(router);
  const indexStore = useIndexStore();
  const organizationsStore = useOrganizationsStore();
  await organizationsStore.fetchOrganizations();
  const lastSelectedOrganization = indexStore.selectedOrganization;
  if (!organizationsStore.organizations.find(organization => organization.id === lastSelectedOrganization)) {
    indexStore.selectOrganization(null);
  }
  if (indexStore.selectedOrganization === null) {
      await router.push('/organizations');
  }
  app.mount("#app");
};

startApp();
