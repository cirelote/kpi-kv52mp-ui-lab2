describe('Authentication Flow', () => {
  it('should login an existing user', () => {
    // Instead of registering through UI which can hit duplicate email errors,
    // we use a predefined fallback or we just test login with an invalid user to see error,
    // and then login with a valid one if we created it via API.
    const randomEmail = `test${Math.floor(Math.random() * 10000)}@example.com`;

    cy.request({
      method: 'POST',
      url: 'http://localhost:8000/api/users/register/',
      failOnStatusCode: false,
      body: {
        name: 'Test User',
        email: randomEmail,
        password: 'password123',
        gender: 'M',
        date_of_birth: '2000-01-01'
      }
    });

    // Login
    cy.visit('/login');
    cy.get('input[name="email"]').type(randomEmail);
    cy.get('input[name="password"]').type('password123');
    cy.contains('button', 'Увійти').click();

    // Should navigate to dashboard
    cy.url().should('eq', Cypress.config().baseUrl + '/');
    cy.contains('Мої завдання').should('be.visible');
  });

  it('should show error for invalid login', () => {
    cy.visit('/login');
    cy.get('input[name="email"]').type('invalid@example.com');
    cy.get('input[name="password"]').type('wrongpassword');
    
    cy.intercept('POST', '/api/users/login/').as('loginRequest');
    
    // Stub window.alert to assert it's called
    const stub = cy.stub();  
    cy.on('window:alert', stub);

    cy.contains('button', 'Увійти').click();
    
    cy.wait('@loginRequest').then(() => {
      expect(stub).to.be.called;
    });
  });
});
