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
    cy.get('meta').then(($metaElements) =>{ 
        assert.equal(isMetaElementExistedAndValid('og:url', 'https://timanh.com'), true);
        assert.equal(isMetaElementExistedAndValid('og:type', 'article'), true);
        assert.equal(isMetaElementExistedAndValid('og:title', 'Những khoảnh khắc'), true);
        assert.equal(isMetaElementExistedAndValid('og:image', 'https://timanh.com/assets/anhnenmoi.jpg'), true);
        assert.equal(isMetaElementExistedAndValid('og:description', 'Tìm lại những khoảnh khắc rực rỡ nhất'), true);
        
        function isMetaElementExistedAndValid(ogProperty, contentValue){
          for(var i=0;i<$metaElements.length;i++){
            var element = $metaElements[i];
            if ((element.getAttribute('property') === ogProperty) && (element.getAttribute('content') === contentValue)){
                return true;
            }
          }

          return false;
        }
    });
  });

  it('should succesfully move to race details without bib ', () => {
    // set selected the second option as index starts from 0
    const selectedIndex = 1;
    cy.get('#raceList').select(selectedIndex);
    const promise = cy.get('#raceList').invoke('val');
    cy.get('#btnMove').trigger('click');
    cy.get('#btnDownload').should('not.exist');
    promise.then((selectedValue) =>{
      cy.url().should('include', `/races/${selectedValue}`);
      // perhaps, later on capture all data returned by findCamp, and assert alias as well
    });
  });

  it('should succesfully move to race details with  bib ', () => {
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

  it('should display download button if move to race details with correct bib ', () => {
    // set selected the second option
    const selectedIndex = 1;
    const bib = '1234';
    cy.get('#raceList').select(selectedIndex);
    cy.get('#bib').type(bib);
    const promise = cy.get('#raceList').invoke('val');
    cy.get('#btnMove').trigger('click');
  });

  it('should not display download button if move to race details with correct bib ', () => {
    // set selected the second option
    const selectedIndex = 1;
    const bib = '123424242342342434';
    cy.get('#raceList').select(selectedIndex);
    cy.get('#bib').type(bib);
    const promise = cy.get('#raceList').invoke('val');
    cy.get('#btnMove').trigger('click');
    cy.get('#btnDownload').should('not.exist');
  });
})