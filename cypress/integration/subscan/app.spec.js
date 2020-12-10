describe('home page', () => {
  it('cypress works', () => {
    expect(true).to.equal(true)
  })
  it('successfully loads', () => {
    cy.visit('/')
  })
})
