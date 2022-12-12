describe('homepage', () => {
  const baseUrl = Cypress.env('baseUrl') ;
  beforeEach(() => {
    cy.visit(baseUrl); // move to configuration
   // those two lines below is to wait for api to return data
   // but with cypress, it has a retry mechanism, so if data is not returned and other commands run fail
   // it would trigger a retry, and assert again. Then, it succeed. So we do not need two lines 
   // But if want to be safe, then, use two lines, and (could be good to move wait to test) add then after wait.
   // cy.intercept('https://yourbib.xyz/v1/campaign/find').as('findCamps');
   // cy.wait('@findCamps');
  });

  it('should setup the page succesfully', () => {
    cy.get('#btnMove').should('include.text', 'TÌM ẢNH');
    cy.get('#raceList').then(($combo => {
        // perhaps, can intercept and wait https://yourbib.xyz/v1/campaign/find
        // then, assert the number of options and camp returned, but keep this simple 
        assert.equal($combo.children.length > 0, true);
    }));
    cy.get('#bib').invoke('attr', 'placeholder').should('eq', 'Nhập số BIB');
  });

  it('should succesfully move to race details without bib ', () => {
    // set selected the second option as index starts from 0
    const selectedIndex = 1;
    cy.get('#raceList').select(selectedIndex);
    const promise = cy.get('#raceList').invoke('val');
    cy.get('#btnMove').trigger('click');
    promise.then((selectedValue) =>{
      cy.url().should('include', `/races/${selectedValue}`);
      // perhaps, later on capture all data returned by findCamp, and assert alias as well
    });
  });

  it('should succesfully move to race details with bib ', () => {
    // set selected the second option
    const selectedIndex = 1;
    const bib = '1234';
    cy.get('#raceList').select(selectedIndex);
    cy.get('#bib').type(bib);
    const promise = cy.get('#raceList').invoke('val');
    cy.get('#btnMove').trigger('click');
    promise.then((selectedValue) =>{
      // perhaps, later on capture all data returned by findCamp, and assert alias as well
      cy.url().should('include', `/races/${selectedValue}`);
      cy.url().should('include', `?bib=${bib}`);
    });
  });
})