import { rest } from 'msw'
import {getAllCampaigns} from './MockDataService'
import {mockConstant} from './MockConstant'

export default [
  // findCampaignTest handler
  rest.get('https://yourbib.xyz/v1/campaign/find/test', (req, res, ctx) => {
    return res(
      ctx.json({
        message: 'it works :)'
      })
    )
  }),

  // findCampaign handler
  rest.get('https://yourbib.xyz/v1/campaign/find', (req, res, ctx) => {
    var campaigns = getAllCampaigns();
    return res(ctx.status(200), ctx.json({
     "campaigns": campaigns
    }))
  }),

 rest.get('https://yourbib.xyz/v1/images/search-images', (req, res, ctx) => {
    const campaignId = req.url.searchParams.get('campaignId');
    const bib = req.url.searchParams.has('bib') ? req.url.searchParams.get('bib') : null;
    const page = req.url.searchParams.get('page');
    const size = req.url.searchParams.get('size');
    let images = [];

    // images for camp
    for(var i =0; i < mockConstant().multipler * parseInt(campaignId); i++){
      images.push( {
          "thumbnail": "https://yourbib.xyz/v1/images/get-image/null04-12zvjfyidwumthumbnail-LIN_0229.JPG",
          "imageUrl": "https://yourbib.xyz/v1/images/get-image/null04-12uowysqtncpfullhd-LIN_0229.JPG",
          "imageWithLogoUrl": "https://yourbib.xyz/v1/images/get-image/null04-12jaeaivxzkpwatermark-LIN_0229.JPG"
        });
    };
    
    /* fail to do. bib === 1 false, but still enter if else. -> move this test to end-to-end
    if (bib === 1){
      returnedImages.push(images[0]);// =  images.slice(0, 50);
      returnedImages.push(images[1]);
      returnedImages.push(images[2]);
      console("bib = " + bib);
    }
    else if (bib===2){
     // returnedImages = images.slice(50, 70);
     returnedImages.push(images[0]);// =  images.slice(0, 50);
      console("bib = " + bib);
    }
    else if (bib===3){
      //returnedImages = images.slice(70, 90);
      returnedImages.push(images[0]);// =  images.slice(0, 50);
      console("bib = " + bib);
    }
   ....
*/
  

  const startIndex = (page-1) * size;
  const endIndex = page * size;
  const camp = getAllCampaigns().find(cam => parseInt(cam.campaignId) === parseInt(campaignId)); 
  return res(ctx.status(200), ctx.json({
    "raceId": campaignId,
    "name": camp.campaignName,
    "bib": bib,
    "campaignName": camp.campaignName,
    "total" : images.length,
    "images": images.slice(startIndex, endIndex)
  }))}
  )
];

