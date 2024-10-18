import { Todo } from "../pages/todo.po";

describe('Verification of todo MVC Project', () => {
    const todos = [
        'Write first Cypress test',
        'Write second Cypress test',
        'Write third Cypress test'
     ];
    
    beforeEach(() => {
        cy.visit('/');
    })

    it('Verify creation of todos', () => {
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
    
    describe('Page functionality with existing todos', () => {
        beforeEach(() => {
            Todo.createTodo(...todos);
        })

        it('Verify check/uncheck functionality', () => {
            // Confirm unchecked state
            cy.getByDataTag('todo-item')
                .first()
                .as('firstTodo')
                .should('not.have.class', 'completed')
                .find('label')
                .as('firstTodoLabel')
                .should('contain.text', todos[0])
            cy.getByDataTag('todo-count')
                .should('contain.text', `${todos.length} items left`);
            cy.get('.clear-completed').should('not.exist');

            // Check first todo
            Todo.toggleTodo('check', todos[0]);

            // Confirm checked state
            cy.get('@firstTodo').should('have.class', 'completed');
            cy.get('@firstTodoLabel').should('contain.text', todos[0]);
            cy.getByDataTag('todo-count')
                .should('contain.text', `${todos.length - 1} items left`);
            cy.get('.clear-completed').should('be.visible');

            // Uncheck first todo
            Todo.toggleTodo('uncheck', todos[0]);

            // Confirm unchecked state
            cy.get('@firstTodo').should('not.have.class', 'completed');
            cy.get('@firstTodoLabel').should('contain.text', todos[0]);
            cy.getByDataTag('todo-count')
                .should('contain.text', `${todos.length} items left`);
            cy.get('.clear-completed').should('not.exist');
        })
    })
})