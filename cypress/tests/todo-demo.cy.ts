describe('Verification of free todo MVC Project', () => {
    const todos = [
        'Write first Cypress test',
        'Write second Cypress test',
        'Write third Cypress test'
     ];
    
    beforeEach(() => {
        cy.visit('/');
    })

    it('Create todos', () => {
        // Check header
        cy.get('header h1').should('contain.text', 'todos');

        cy.wrap(todos).each((todo: string, i) => {
            // enter todo
            cy.get('.new-todo').type(todo + '{enter}');

            // confirm todos are active and counts match
            cy.getByDataTag('todo-item')
                .should('have.length', i+1)
                .last()
                .should('not.have.class', 'completed')
                .should('have.text', todo);

            // confirm updated todo count
            cy.getByDataTag('todo-count')
                .invoke('text')
                .invoke('trim')
                .invoke('replace', /\s+/, ' ')
                .should('match', new RegExp(`${i+1} item${i === 0 ? '' : 's'} left`))
        })
    })


})