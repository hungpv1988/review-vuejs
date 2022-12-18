describe('racedetails', () => {  

  let numberofPage, campName, total;
  const numberOfItemsPerPage = 40; // need to be in sync with code
  beforeEach(() => {
    cy.intercept('https://yourbib.xyz/v1/images/search-images*').as('searchImages');
    cy.visit('http://127.0.0.1:5174');
    cy.intercept('https://yourbib.xyz/v1/campaign/find').as('findCamps');
 
    // default value of combo is 1 (wrong code, but not good time to fix) before fetching data
    // so we need to wait here for data to be loaded as a fix.
    cy.wait('@findCamps');
    cy.get('#btnMove').click();
    cy.wait('@searchImages', {timeout: 15000}).then(($intecerption) =>{
      numberofPage = Math.ceil($intecerption.response.body.total / numberOfItemsPerPage);
      total = $intecerption.response.body.total;
      campName = $intecerption.response.body.campaignName;
    });  
  });

  it('should setup the page correctly', () => {
    cy.get('#campaign-name').should('have.text', campName);
    cy.get('#image-box').find('img').should('have.length', numberOfItemsPerPage); 

    // check whether page item is rendered correctly. In UT, we validate page and ... already, so skip here.
    cy.get('#paging-box').get('.page-item').filter(`:contains("${numberofPage}")`).should('have.length', 1);
  });

  it('should navigate correctly when clicking on page item', () => {
    // the image page 01 is displayed when visiting racedetails 
    // we can get the current active a, then, setup to click on the next page, or next button
    // but no familiar with the framework yet, so setup looks complicated
    const nextPage = 2;
    cy.intercept('Get','https://yourbib.xyz/v1/images/search-images*', (req)=>{
      expect(parseInt(req.query.page)).to.equal(nextPage);
    });
    
    cy.get('.page-item > a').last().trigger('click'); // next button -> should move to page 02
    cy.get('.page-item.active').find('a').invoke('text').should('eq', nextPage.toString());
  });

  it('should search according to bib in general', () => {
    // the image page 01 is displayed when visiting racedetails 
    // we can get the current active a, then, setup to click on the next page, or next button
    // but no familiar with the framework yet, so setup looks complicated
    const bibSearchingType = '2'; // sync with code in RaceDetails.vue, searchType field
    const bib = 1234; //with happy ekiden, we have bib 1234. Hard to know a bib exists in a race as our data is not full
    cy.get('#search-type').select(bibSearchingType); 
    cy.get('#txtBib').type(bib); 
    cy.get('#btnSearch').click(); 
    cy.intercept('Get','https://yourbib.xyz/v1/images/search-images*', (req)=>{
      debugger;
      expect(parseInt(req.query.bib)).to.equal(bib); // make sure that bib is sent
      req.continue((res) => {
        expect(res.body.campaignName).to.equal(campName);
        // cannot expect in details as not sure about the data, but if res contains like this, than, perhaps, true
        expect(res.body).to.have.any.keys('bib');
        expect(res.body).to.have.any.keys('images');
        expect(res.body).to.have.any.keys('total');
      })
    });
  });

  // this test is for a specific case event Happy Ekiden. 
  // when the race is deleted, need to update the test case
  it('should search according to bib with a specific case', () => {
    // revisit page, and choose happy ekiden
    const happyEkidenId = 32;
    cy.intercept('https://yourbib.xyz/v1/images/search-images*').as('searchImages');
    cy.visit('http://127.0.0.1:5174');
    cy.intercept('https://yourbib.xyz/v1/campaign/find').as('findCamps');
    cy.wait('@findCamps');
    cy.get('#raceList').select(happyEkidenId.toString())//
    cy.get('#btnMove').click();
    cy.wait('@searchImages');

    const bibSearchingType = '2'; // sync with code in RaceDetails.vue, searchType field
    const bib = 1234; //with happy ekiden, we have bib 1234. Hard to know a bib exists in a race as our data is not full
    cy.get('#search-type').select(bibSearchingType); 
    cy.get('#txtBib').type(bib); 
    cy.get('#btnSearch').click(); 
    cy.get('#image-box').find('img').should('have.length', 33); // be carefull with 33, but have no choice as we cannot setup data as we wish now
  });
})