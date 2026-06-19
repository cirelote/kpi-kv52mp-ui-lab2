describe('Dashboard Flow', () => {
  const randomEmail = `dashboard${Math.floor(Math.random() * 10000)}@example.com`;

  before(() => {
    // Attempt to register, ignore if user already exists
    cy.request({
      method: 'POST',
      url: 'http://localhost:8000/api/users/register/',
      failOnStatusCode: false,
      body: {
        name: 'Dashboard User',
        email: randomEmail,
        password: 'password123',
        gender: 'M',
        date_of_birth: '2000-01-01'
      }
    }).then(() => {
      // Login via API
      cy.request({
        method: 'POST',
        url: 'http://localhost:8000/api/users/login/',
        body: {
          email: randomEmail,
          password: 'password123'
        }
      }).then((resp) => {
        window.localStorage.setItem('access_token', resp.body.access);
        window.localStorage.setItem('refresh_token', resp.body.refresh);
      });
    });
  });

  // Keep session alive
  beforeEach(() => {
    // Preserve local storage / session manually if needed, or Cypress 12+ handles sessions differently.
    // In this simple test, if cookies/localStorage are cleared, we might need cy.session.
    // Assuming localStorage token is kept or we just run all tests in one block for simplicity.
  });

  it('should create, toggle, and delete a task', () => {
    cy.visit('/');
    cy.contains('Мої завдання').should('be.visible');

    const taskName = `New Task ${Math.floor(Math.random() * 1000)}`;

    // Create a task
    cy.get('input[placeholder="Що потрібно зробити?"]').type(taskName);
    cy.contains('button', 'Додати').click();

    // Verify task is added
    cy.contains(taskName).should('be.visible');

    // Toggle task (it should have a line-through)
    cy.intercept('PATCH', '/api/tasks/*').as('toggleTask');
    // Find the list item containing the task name, then find its checkbox
    cy.contains(taskName).parents('li').find('input[type="checkbox"]').check();

    cy.wait('@toggleTask');

    // Verify task is checked
    cy.contains(taskName).parents('li').find('input[type="checkbox"]').should('be.checked');

    // Delete task
    cy.intercept('DELETE', '/api/tasks/*').as('deleteTask');
    cy.contains(taskName).parents('li').find('button[aria-label="delete"]').click();

    cy.wait('@deleteTask');

    // Verify task is removed
    cy.contains(taskName).should('not.exist');
  });
});
