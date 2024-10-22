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

        it('Verify "Clear completed" button', () => {
            cy.getByDataTag('todo-item').each((_, i) => {
                // confirm todo count and content of to-be deleted todo
                // always delete top todo item
                cy.getByDataTag('todo-item')
                    .should('have.length', todos.length - i)
                    .first()
                    .as('currentTodo')
                    .getByDataTag('todo-title')
                    .should('contain.text', todos[i]);

                // toggle todo and clear completed
                Todo.toggleTodo('check', todos[i]);
                cy.get('@currentTodo').should('have.class', 'completed');
                cy.get('.clear-completed').click();

                // confirm removal of todo and remaining count
                cy.contains(todos[i]).should('not.exist');
                cy.getByDataTag('todo-item').should('have.length', todos.length - i - 1)
            })

            cy.getByDataTag('todo-item').should('not.exist');
        })

        it('Verify tabbed filtering', () => {
            Todo.toggleTodo('check', todos[0])

            // Default tab state
            cy.get('.filters')
                .contains('a', 'All')
                .should('have.class', 'selected');
            cy.get('.filters')
                .contains('a', 'Active')
                .as('activeTab')
                .should('not.have.class', 'selected');
            cy.get('.filters')
                .contains('a', 'Completed')
                .as('completedTab')
                .should('not.have.class', 'selected');

            // Check active tab
            cy.get('@activeTab').click();
            cy.get('@activeTab').should('have.class', 'selected');
            cy.getByDataTag('todo-title')
                .should('have.length', 2)
                .invoke('text')
                .should('not.contain', todos[0])
                .should('contain', todos[1])
                .should('contain', todos[2])

            // Check completed tab
            cy.get('@completedTab').click();
            cy.get('@completedTab').should('have.class', 'selected');
            cy.getByDataTag('todo-title')
                .should('have.length', 1)
                .invoke('text')
                .should('contain', todos[0])
                .should('not.contain', todos[1])
                .should('not.contain', todos[2])
            cy.get('.clear-completed').click();
            cy.getByDataTag('todo-item').should('not.exist');
        })

        it('Verify editing of todos', () => {
            const editText = ' edited'
            // Complete first todo in list (top in DOM)
            Todo.toggleTodo('check', todos[0]);

            cy.getByDataTag('todo-item')
                .should('have.length', todos.length)
                .each(($todo, i) => {
                    cy.wrap($todo)
                        .should('not.have.class', 'editing')
                        .getByDataTag('todo-title')
                        .should('contain.text', todos[i])
                        .dblclick();
                    cy.wrap($todo)
                        .should('have.class', 'editing')
                        .find('input.edit')
                        .type(`{moveToEnd}${editText}{enter}`);
                    cy.wrap($todo)
                        .should('not.have.class', 'editing')
                        .getByDataTag('todo-title')
                        .should('contain.text', todos[i] + editText);
                });
        })
    })
})