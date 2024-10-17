/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//

Cypress.Commands.add(
    'getByAttribute',
    { prevSubject: ['optional', 'element'] },
    (
        subject: void | Cypress.JQueryWithSelector<HTMLElement>,
        attribute: string,
        value: string,
        options?: Partial<Cypress.Loggable & Cypress.Timeoutable & Cypress.Withinable & Cypress.Shadow & { search: 'contains' | 'startsWith' | 'endsWith' }>
    ): Cypress.Chainable<Cypress.JQueryWithSelector<HTMLElement>> => {
        const search = options?.search
            ? { contains: '*', startsWith: '^', endsWith: '$' }[options.search]
            : ''
        if (subject) {
            options.withinSubject = subject;
        }
        return cy.get(`[${attribute}${search}="${value}"]`, options);
    }
)

Cypress.Commands.add(
    'getByDataTag',
    { prevSubject: ['optional', 'element'] },
    (
        subject: void | Cypress.JQueryWithSelector<HTMLElement>,
        value: string,
        options?: Partial<Cypress.Loggable & Cypress.Timeoutable & Cypress.Withinable & Cypress.Shadow & { search: 'contains' | 'startsWith' | 'endsWith' }>
    ): Cypress.Chainable<Cypress.JQueryWithSelector<HTMLElement>> => {
        if (subject) {
            options.withinSubject = subject;
        }
        return cy.getByAttribute(Cypress.env('dataTag'), value, options);
    }
)