// by default, skip all tests here to boost performance, need to turn of manually
// remember to test again time need to wait after handling things ok
// remember to delete timanh.zip and timanh folder in downloads
// downloading is uncertain, so assert should be flexible. Some time, miss one or two files even if the file has been downloaded
// The same for searching by image. It can be searched, downloaded. But the number is hard to assert. So, observe and see that it has been download, and assert show some numbers seem to be ok for now
// if download is in progress and assert come first, then the folder timanh.zip may not be avaliable, extend time await
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

  it('should be able to download images from timanh when searching bib - happy ekiden', () => {
    // revisit page, and choose happy ekiden
    const happyEkidenId = 32;
    cy.intercept(`${searchImagesUrl}*`).as('searchImages');
    cy.intercept(getCampsUrl).as('findCamps');
    cy.visit(baseUrl);
    
    cy.wait('@findCamps');
    cy.get('#raceList').select(happyEkidenId.toString());
    cy.get('#btnMove').click();
    cy.wait('@searchImages');

    const bibSearchingType = '2'; // sync with code in RaceDetails.vue, searchType field
    const bib = '1252-1'; //with happy ekiden, we have bib 1234. Hard to know a bib exists in a race as our data is not full
    cy.get('.page-item > a').eq(2).trigger('click');
    cy.intercept(`${searchImagesUrl}*`).as('loadPage');
    cy.wait('@loadPage');
    cy.get('#search-type').select(bibSearchingType); 
    cy.get('#txtBib').type(bib); 
    cy.get('#btnSearch').click(); 
    cy.get('#image-box').find('img').should('have.length', 39); 
  
    let numberofImagesDownloaded = 0;
    // all request to download file .jpg by js. May need to change as jpg is not the only format, but keep it here for now
    cy.intercept('*.JPG', (req)=>{
      if (req.headers['sec-fetch-mode'] === 'cors'){
        req.continue((res) => {
          //if ((res.statusCode == 200) && (res.headers['access-control-allow-origin'] == '*') ){ // too much strict
          if (res.statusCode == 200){
           numberofImagesDownloaded++; // count the number of images downloaded successfully
          }
          // a note here is that it's not stable for downloading. Download may be fail although it's rare
       })
      }
    });

    cy.get('#btnDownload').trigger('click');
    cy.wait(12000).then(() => {               // arbitrary wait since we don't know exactly when download is done. Can increase 2000 to 10000 for certainty
        cy.task('unzipping', {path: 'cypress/downloads/', file :'timanh.zip'}).then(()=>{
          cy.task('count', 'cypress/downloads/timanh').then((count) => {
              expect(count).to.equal(numberofImagesDownloaded); // 39 files in folder unless failing to download a file
              //expect(count).to.equal(39);
          })          
        })
    });       
  });

  it('should be able to download images from timanh when searching by image and also different location other than timanh.com', () => {
    // revisit page, and choose happy ekiden
    const womanEkidenId = 40;
    
    cy.intercept(`${searchImagesUrl}*`).as('searchImages');
    cy.intercept(getCampsUrl).as('findCamps');
    cy.visit(baseUrl);
    
    cy.wait('@findCamps');
    cy.get('#raceList').select(womanEkidenId.toString());
    cy.get('#btnMove').click();
    cy.wait('@searchImages');

    const searchFaceUrl = "https://timanh.com/v1/images/search-face";
    
    cy.intercept(`${searchFaceUrl}*`).as('searchFace');
    const bibSearchingType = '3'; // sync with code in RaceDetails.vue, searchType field
    cy.get('#search-type').select(bibSearchingType); 
    cy.get('input[type=file]').selectFile('./cypress/fixtures/womanekiden463.jpg')
    cy.get('#btnSearch').click(); 

    let numberofImagesDownloaded = 0;
    // At home, network is bad so slow and timeout, but it should work
    cy.wait('@searchFace').then(($intecerption) =>{
      // at present, at local, perhaps, we set faceMatchThreshold in dataservice 80 so it shows more result than timanhcom. The next time, if test fails, then pay close attention to this settings
      expect($intecerption.response.body.total).to.equal(59); 
      expect($intecerption.response.body.images.length).to.equal(40);
      
      // wait for images to be rendered. Expect above should be enough, but want to do more careful
      cy.wait(1000).then(() => {               // arbitrary wait since we don't know exactly

        // all request to download file .jpg by js. May need to change as jpg is not the only format, but keep it here for now
        cy.intercept('*.JPG', (req)=>{
          if (req.headers['sec-fetch-mode'] === 'cors'){
            req.continue((res) => {
              //if ((res.statusCode == 200) && (res.headers['access-control-allow-origin'] == '*') ){ // too much strict
              if (res.statusCode == 200){
                 numberofImagesDownloaded++; // count the number of images downloaded successfully
              }
          })
          }
        });
  
      cy.get('#btnDownload').trigger('click');
      cy.wait(18000).then(() => {               // arbitrary wait since we don't know exactly when download is done
          cy.task('unzipping', {path: 'cypress/downloads/', file :'timanh.zip'}).then(()=>{
            cy.task('count', 'cypress/downloads/timanh').then((count) => {
                expect(count).to.equal(numberofImagesDownloaded); // around 59 images so perhaps, take time. And node env runs does not stable, dont know why but numberofImagesDownloaded sometiems different from count, perhaps, failing download
            })          
          })
      });            
    });       
  });   
  });
})

