// ***********************************************************
// This example support/component.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import "./commands";

import "../plugins/tailwind";
import { mount } from "cypress/vue";
// Augment the Cypress namespace to include type definitions for
// your custom command.
// Alternatively, can be defined in cypress/support/component.d.ts
// with a <reference path="./component" /> at the top of your spec.

Cypress.Commands.add("mount", (component, options = {}) => {
  // Setup options object
  options.global = options.global || {};
  options.global.plugins = options.global.plugins || [];
  // Add router plugin
  options.global.plugins.push({
    install(app) {
      app.use(options.router);
    },
  });

  return mount(component, options);
});
