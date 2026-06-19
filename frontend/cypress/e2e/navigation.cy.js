describe('Navigation', () => {
  it('should navigate between pages', () => {
    cy.visit('/');
    
    // Go to about page
    cy.get('a[href="/about"]').first().click();
    cy.url().should('include', '/about');
    cy.contains('Про додаток').should('be.visible');

    // Go to login page
    cy.get('a[href="/login"]').first().click();
    cy.url().should('include', '/login');
    cy.contains('З поверненням').should('be.visible');

    // Go to register page
    cy.get('a[href="/register"]').first().click();
    cy.url().should('include', '/register');
    cy.contains('Створити акаунт').should('be.visible');
  });
});
