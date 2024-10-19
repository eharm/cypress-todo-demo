export class Todo {
    /**
     * Will add either a single or multiple items to the todo list
     * @param todo item(s) to add to todo list
     */
    static createTodo(...todo: string[]) {
        cy.wrap(todo).each((t: string, i) => {
            cy.get('.new-todo').type(t + '{enter}');

            cy.getByDataTag('todo-item')
                .should('have.length.at.least', i+1)
        })
    }

    /**
    * This will toggle a checkbox for one or multiple todo items. There is an assertion
    * on each check to confirm the expected state before and after check/uncheck
    * @param state The desired state of the checkbox
    * @param todoText The text of the todo to be check/unchecked
    */
    static toggleTodo(state: 'check' | 'uncheck', ...todoText: string[]) {
        cy.wrap(todoText).each((t: string) => {
            cy.getByDataTag('todo-item')
                .contains('label', t)
                .siblings('input')
                .as('curCbox')
                .should('have.length', 1)
                .should(
                    state === 'check'
                        ? 'not.be.checked'
                        : 'be.checked'
                ).then(($cbox) => {
                    if (state === 'check') {
                        cy.wrap($cbox, { log: false }).check();
                    } else {
                        cy.wrap($cbox, { log: false }).uncheck();
                    }
                });

            cy.get('@curCbox').should(
                state === 'check'
                    ? 'be.checked'
                    : 'not.be.checked'
            )
        })
    }
}