//const decompress = require('decompress');
//const unzip = ({ path, file }) => decompress("./cypress/downloads/timanh.zip", './cypress/downloads/' + "aaa")
// need to add test to search by image
const path = require("path");
var fs = require('fs');

describe('racedetails with beforeeach to setup common data', () => {  
  const baseUrl = Cypress.env('baseUrl'),
        getCampsUrl = Cypress.env('getCampsUrl'),
        searchImagesUrl = Cypress.env('searchImagesUrl') ; 
  let numberofPage, campName, total;
  const numberOfItemsPerPage = 40; // need to be in sync with code in GlobalConfig

  // set up common behaviors for page without caring about raceid
  beforeEach(() => {
  //  should intercept and set alias before visiting the page because if visit the page, and set alias, then wait
  //  so, in some cases, response is returned so quickly, so the flow is stuck because of cy.wait as it runs forever as the request is complete & no more one is made
  //   https://egghead.io/blog/intercepting-network-requests-in-cypress
  //  perhaps, if make a second call to request, need to use alias again and call wait command one more time (the same as the first one).
  //  cy.intercept(`${searchImagesUrl}*`).as('searchImages');
      // revisit page, and choose happy ekiden
      const womanEkidenId = 40;
    
      cy.intercept(`${searchImagesUrl}*`).as('searchImages');
      cy.intercept(getCampsUrl).as('findCamps');
      cy.visit(baseUrl);
      
      cy.wait('@findCamps');
      cy.get('#raceList').select(womanEkidenId.toString());
      cy.get('#btnMove').click();
      cy.wait('@searchImages');
  });

  // search by images timeout at home
  it('should search by image after visiting a page', () => {
    const searchFaceUrl = "https://timanh.com/v1/images/search-face";
    cy.intercept(`${searchFaceUrl}*`).as('searchFace');
    const bibSearchingType = '3'; // sync with code in RaceDetails.vue, searchType field
    cy.get('#search-type').select(bibSearchingType); 
    cy.get('input[type=file]').selectFile('cypress/fixtures/womenekiden.jpg')
    cy.get('#btnSearch').click(); 

    // At home, network is bad so slow and timeout, but it should work
    cy.wait('@searchFace').then(($intecerption) =>{
      expect($intecerption.response.body.total).to.equal(107);
      expect($intecerption.response.body.images.length).to.equal(40);
      
      // wait for images to be rendered. Expect above should be enough, but want to do more careful
      cy.wait(2000).then(() => {               // arbitrary wait since we don't know exactly
        cy.get('#image-box').find('img').should('have.length', 40); 
        cy.get('#statistic-box').should('contain', 107);
        cy.get('#image-uploaded').find('img').should('have.length', 1); 
      });       
    });  
  });

    // To test prefaceID has been deleted
  it('should search by image two time continuously and succeed', () => {
    const searchFaceUrl = "https://timanh.com/v1/images/search-face";
    cy.intercept(`${searchFaceUrl}*`).as('searchFace');
    const bibSearchingType = '3'; // sync with code in RaceDetails.vue, searchType field
    cy.get('#search-type').select(bibSearchingType); 
    cy.get('input[type=file]').selectFile('cypress/fixtures/womenekiden.jpg')
    cy.get('#btnSearch').click(); 

    // At home, network is bad so slow and timeout, but it should work
    cy.wait('@searchFace').then(($intecerption) =>{
      expect($intecerption.response.body.total).to.equal(107);
      expect($intecerption.response.body.images.length).to.equal(40);
      
      // wait for images to be rendered. Expect above should be enough, but want to do more careful
      cy.wait(2000).then(() => {               // arbitrary wait since we don't know exactly
        cy.get('#image-box').find('img').should('have.length', 40); 
        cy.get('#statistic-box').should('contain', 107);
        cy.get('#image-uploaded').find('img').should('have.length', 1); 
      });       
    });  

    cy.intercept(`${searchFaceUrl}*`).as('searchFace');
    cy.get('input[type=file]').selectFile('cypress/fixtures/womanekiden463.jpg')
    cy.get('#btnSearch').click(); 

    // At home, network is bad so slow and timeout, but it should work
    cy.wait('@searchFace').then(($intecerption) =>{
         // at present, at local, perhaps, we set faceMatchThreshold in dataservice 80 so it shows more result than timanhcom. The next time, if test fails, then pay close attention to this settings
      expect($intecerption.response.body.total).to.equal(59);
      expect($intecerption.response.body.images.length).to.equal(40);
      
      // wait for images to be rendered. Expect above should be enough, but want to do more careful
      cy.wait(2000).then(() => {               // arbitrary wait since we don't know exactly
        cy.get('#image-box').find('img').should('have.length', 40); 
        cy.get('#statistic-box').should('contain', 59);
        cy.get('#image-uploaded').find('img').should('have.length', 1); 
      });       
    });  

  });
  // check whether page item is rendered correctly. In UT, we validate page and ... already, so skip here.
  // this test is for a specific case event Happy Ekiden. (don't delete Happy Eriken)
  // when the race is deleted, need to update the test case
  // die for now as service does not returns as expected
  // search by images timeout at home
  it('should work correctly when searching different times and images', () => {
    // search by bib first
    var searchingType = '2'; // sync with code in RaceDetails.vue, searchType field
    const bib = '4-40'; //with woman ekiden, we have bib 4-40. Hard to know a bib exists in a race as our data is not full
    cy.get('#search-type').select(searchingType); 
    cy.get('#txtBib').type(bib); 
    cy.get('#btnSearch').click(); 
    //cy.wait('@searchImages');
    cy.get('#image-box').find('img').should('have.length', 40);  // label count says 41 on web, but actually, 40

    //search by image
    const searchFaceUrl = "https://timanh.com/v1/images/search-face";
    cy.intercept(`${searchFaceUrl}*`).as('searchFace');
    searchingType = '3'; // sync with code in RaceDetails.vue, searchType field
    cy.get('#search-type').select(searchingType); 
    cy.get('input[type=file]').selectFile('cypress/fixtures/womanekiden420.jpg')
    cy.get('#btnSearch').click(); 

    // At home, network is bad so slow and timeout, but it should work
    cy.wait('@searchFace').then(($intecerption) =>{
      expect($intecerption.response.body.total).to.equal(44); 
      expect($intecerption.response.body.images.length).to.equal(40); 
      cy.get('#image-uploaded').find('img').should('have.length', 1); 
      // wait for images to be rendered. Expect above should be enough, but want to do more careful
      cy.wait(2000).then(() => {               // arbitrary wait since we don't know exactly
        cy.get('#image-box').find('img').should('have.length', 40); 
        cy.get('#statistic-box').should('contain', 44)
        
      });       
    });  
    
    searchingType = "1"
    cy.get('#search-type').select(searchingType); 
    cy.get('#txtBib').should('have.text', '');
    cy.get('#btnSearch').click(); 
    cy.get('#statistic-box').should('contain', 11907)
    cy.get('#image-box').find('img').should('have.length', 40); 

    //back to search by bib
    searchingType = '2'; // sync with code in RaceDetails.vue, searchType field
    cy.get('#search-type').select(searchingType); 
    const newbib = '4-42'
    cy.get('#txtBib').clear();
    cy.get('#txtBib').type(newbib); 
    cy.get('#btnSearch').click(); 
    cy.get('#image-box').find('img').should('have.length', 40); 
    cy.get('#statistic-box').should('contain', 80); // not sure 80 is correct as count is wrong on server side, but it displays 80 for now
  });

})

