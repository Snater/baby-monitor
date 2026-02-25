describe('Form', () => {
	it('adds a meal', () => {
		cy.intercept('api/get?*').as('get');

		cy.visit('/');

		cy.contains('No data yet to display the chart.')
			.should('be.visible');

		cy.get('button')
			.contains('90 ml')
			.click();

		cy.get('[alt="loading"]')
			.should('be.visible');

		cy.wait('@get')
			.then(({request, response}) => {
				const url = new URL(request.url);
				const date = new Date(url.searchParams.get('date') ?? '');
				const now = new Date();

				expect(`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`)
					.to.equal(`${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`);

				expect(response?.body.length).to.equal(1);

				expect(response?.body[0].amount).to.equal(90);
				expect(response?.body[0].time.split('T')[0]).to.equal(new Date().toISOString().split('T')[0]);

				const timestamp = new Date(response?.body[0].time).getTime();
				const nowTimeStamp = now.getTime();

				expect(timestamp).to.be.lessThan(nowTimeStamp + 60000);
				expect(timestamp).to.be.greaterThan(nowTimeStamp - 120000);
			});

		cy.get('[alt="loading"]')
			.should('not.exist');

		cy.contains('No data yet to display the chart.')
			.should('not.exist');

		cy.get('[aria-label="Vega visualization"]')
			.should('be.visible');
	});
});