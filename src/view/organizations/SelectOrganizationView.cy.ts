import SelectOrganizationView from './SelectOrganizationView.vue'

describe('<SelectOrganizationView />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-vue
    cy.mount(SelectOrganizationView)
  })
})