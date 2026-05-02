describe('Log', () => {
	it('navigates through the log', () => {
		cy.visit('/demo');

		cy.url()
			.should('match', /\/demo-/);

		cy.get('[aria-label="Vega visualization"]')
			.should('be.visible');

		cy.get('table tbody tr')
			.should('have.length.greaterThan', 0);

		cy.get('[aria-label="next day"]')
			.should('be.disabled');

		cy.get('[aria-label="previous day"]')
			.should('not.be.disabled')
			.click();

		cy.get('[aria-label="next day"]')
			.should('not.be.disabled');

		cy.get('table tbody tr')
			.should('have.length.greaterThan', 0);

		cy.get('[aria-label="next day"]')
			.click();

		cy.get('[aria-label="next day"]')
			.should('be.disabled');
	});

	it('deletes a log entry', () => {
		cy.visit('/demo');

		cy.get('[aria-label="Vega visualization"]')
			.should('be.visible');

		cy.get('table tbody tr')
			.first()
			.find('td')
			.first()
			.invoke('text')
			.then(time => {
				cy.get('[aria-label="Delete"]').first().click({ force: true });
				cy.get('table tbody').should('not.contain', time);
			});
	});
});