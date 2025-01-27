import News from './News.vue'

describe('<News />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-vue
    cy.mount(News)
  })
})