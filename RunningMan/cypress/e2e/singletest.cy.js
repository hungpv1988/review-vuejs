// need to add test to search by image

describe('racedetails with beforeeach to setup common data', () => {  
  const baseUrl = Cypress.env('baseUrl'),
        getCampsUrl = Cypress.env('getCampsUrl'),
        searchImagesUrl = Cypress.env('searchImagesUrl') ; 
  let numberofPage, campName, total;
  const numberOfItemsPerPage = 40; // need to be in sync with code in GlobalConfig

  // set up common behaviors for page without caring about raceid
  beforeEach(() => {
    // should intercept and set alias before visiting the page because if visit the page, and set alias, then wait
    // so, in some cases, response is returned so quickly, so the flow is stuck because of cy.wait as it runs forever as the request is complete & no more one is made
    // https://egghead.io/blog/intercepting-network-requests-in-cypress
    // perhaps, if make a second call to request, need to use alias again and call wait command one more time (the same as the first one).
    cy.intercept(`${searchImagesUrl}*`).as('searchImages');
    cy.intercept(getCampsUrl).as('findCamps');
    cy.visit(baseUrl); 
 
    //cy.intercept('https://yourbib.xyz/v1/images/search-images*').as('searchImages');
    //cy.visit('http://127.0.0.1:5174');
    //cy.intercept('https://yourbib.xyz/v1/campaign/find').as('findCamps');

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

  it('should not make another request if back to a page cached', () => {
    let requestCounter = 0;
    const spy = cy.spy();
    var pageNumber = 2;
    cy.intercept({url: `${searchImagesUrl}*`, query: {page: ''.concat(pageNumber)}},  (req)=>{
      requestCounter++;
      // req.continue((res)=>{ // keep here as a template to use later on
          
      // });
    }, spy);
    
    cy.get('.page-item > a').eq(2).trigger('click');
    cy.get('.page-item.active').find('a').invoke('text').should('eq', pageNumber.toString());
    cy.get('#image-box').find('img').should('have.length', numberOfItemsPerPage); 
    cy.wait(500); // wait for response to be returned, otherwise, new request is made even if data from previous request has not retuend data, and causing inconsistency in state.items in AlbumInfo
    
    // visit page 03
    var newpageNumber = 3;
    cy.get('.page-item > a').eq(newpageNumber).trigger('click');
    cy.get('.page-item.active').find('a').invoke('text').should('eq', newpageNumber.toString());
    cy.wait(500); // wait for response to be returned
    
    cy.get('.page-item > a').eq(pageNumber).trigger('click');
    cy.get('.page-item.active').find('a').invoke('text').should('eq', pageNumber.toString());
    cy.get('#image-box').find('img').should('have.length', numberOfItemsPerPage); 
    //https://stackoverflow.com/questions/67643208/verify-number-of-times-request-was-made
    cy.wait(2000).then(() => {               // arbitrary wait since we don't know exactly
      expect(requestCounter).to.eq(1)       // navigate but cache data, no make more request
    });       
  });
})

