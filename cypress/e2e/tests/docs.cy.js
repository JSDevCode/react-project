describe('Docs page', () => {
    beforeEach(() => {
        cy.request('POST', 'http://localhost:3000/test/seed');
        cy.visit('http://localhost:5173/')
    })

    it('shows page title', () => {
        cy.get('h1').should('contain', 'Documents')
    })

    it('shows a button with text', () => {
        cy.get('#add-btn').should('have.text', 'Add new')
    })

    it('leads to add form', () => {
        cy.get('#add-btn').click()
        cy.url().should('include', '/add')
    })
})

describe('Show docs', () => {
    beforeEach(() => {
        cy.visit('http://localhost:5173/')
  })

    it('shows table headers', () => {
        cy.get('table').should('contain.text', 'ID')
        cy.get('table').should('contain.text', 'Title')
        cy.get('table').should('contain.text', 'Content')
    })

    it('shows at least one doc', () => {
        cy.get('table tbody tr').should('have.length.above', 0)

    })

    describe('navigates to search page and finds document by ID', () => {
        beforeEach(() => {
            cy.visit('http://localhost:5173/')
        })

        it('fetches first document ID and displays it on search page', () => {
            cy.visit('http://localhost:5173/')

            // Hämtar första cellen som innehåller id.
            cy.get('table tbody tr').first().find('td')

            .first().invoke('text').then($id => {

            cy.get('header nav').first()
            .should('contain', 'Search')
            .click()

            cy.visit('http://localhost:5173/search')

            cy.url().should('include', '/search')

            cy.get('h1').should('have.text', 'Search for a document')

            cy.get('.search-container').should('exist')

            cy.get('input').should('exist')

            cy.get('input').type($id)

            // Klickar på 'search' knappen om den finns.
            cy.get('button').should('have.text', 'Search')
            .click()

            cy.get('table tbody tr').first().find('td')
            .first().should('have.text', $id)

            })

        })
    })


    describe('update button', () => {
        beforeEach(() => {
            cy.visit('http://localhost:5173/')
        })

        it('shows a button with text', () => {
            cy.get('table tbody tr').first().find('.update-btn')
            .should('have.text', 'Update')
        })

        it('lead to update form', () => {
            // Hämtar id från första raden
            cy.get('table tbody tr').first().find('td')
            .first().invoke('text').then($id => {
                cy.get('table tbody tr').first().find('.update-btn')
                .click()
                // Kontrollerar att url blir rätt
                cy.url().should('include', `/update/${$id}`)
                // Kontrollerar att formuläret existerar
                cy.get('.update-container').should('exist')
                cy.get('h2').should('have.text', `Update document ${$id}`)
                cy.get('input').should('exist')
                cy.get('textarea').should('exist')
                cy.get('button').should('exist')

                // Uppdaterar fältet med text
                cy.get('input').clear().type('Updated title')
                cy.get('textarea').clear().type('Updated content')
                cy.get('button').should('have.text', 'Save')
                .click()
                // Navigerar till huvudsidan
                cy.url().should('include', '/')
                // Kontrollerar att dokumentet har uppdaterats
                cy.get('table tbody tr').first().find('td')
                .eq(0).should('have.text', $id)

                cy.get('table tbody tr').first().find('td')
                .eq(1).should('have.text', 'Updated title')

                cy.get('table tbody tr').first().find('td')
                .eq(2).should('have.text', 'Updated content')

            })

            })
    })
})

describe('delete button', () => {
    beforeEach(() => {
        cy.visit('http://localhost:5173/')
  })

    it('shows a button with text', () => {
        cy.get('table tbody tr').first().find('.delete-btn')
        .should('have.text', 'Delete')
    })

    // Man måste ha exakt två dokument i testdatabasen för det här testet.
    it('deletes the first row', () => {
        cy.get('table tbody tr').then($rows => {
            if ($rows.length) {
                cy.get('table tbody tr').first().find('.delete-btn').click()
                // Kontrollerar att antal docs har minskat med 1 (2 docs från början).
                cy.get('table tbody tr').should('have.length', 1)
            }
        })
    })
})

describe('Add doc page', () => {
    beforeEach(() => {
        cy.visit('http://localhost:5173/add')
    })

    it('shows page title', () => {
        cy.get('h1').should('contain', 'Add New Document')
    })

    it('has input and textarea', () => {
        cy.get('.add-container').should('exist')
        cy.get('input[type="text"]').should('exist')
        cy.get('textarea').should('exist')
        cy.get('#submit').should('exist')
        .and('have.text', 'Add')
    })


    it('leads to the main page', () => {
        cy.get('input[type="text"]').type('Test title')
        cy.get('textarea').type('Test content')
        cy.get('#submit').click()
        cy.url().should('include', '/')
        cy.get('table tbody tr').should('have.length', 2)
    })
})
