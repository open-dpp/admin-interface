import { mount } from "cypress/vue";

type MountParams = Parameters<typeof mount>;
type OptionsParam = MountParams[1] & { router?: Router };

declare global {
  namespace Cypress {
    interface Chainable {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mount(component: any, options?: OptionsParam): Chainable<any>;
    }
  }
}
