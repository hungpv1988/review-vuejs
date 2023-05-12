import axios from "axios";


export function getGlobalConfig(){
  const startingPage = 1;
  const pageSize = 40;
  const baseUrl = "https://timanh.com/v1/images/search-images"; 
  const campaignsUrl = "https://timanh.com/v1/campaign/find";
  const searchImageUrl = "https://timanh.com/v1/images/search-face";

  return {startingPage, pageSize, baseUrl, campaignsUrl, searchImageUrl};
}

const globalConfig = getGlobalConfig();
// replace the name to searchData
export async function searchData(searchCriteria){//(campId, bib, pageNumber = 1, pageSize = 8, searchType, asset){ 
  // add code segment to use post if searching by image 
  // think about searching by text/label
   const searchType = searchCriteria.searchType;
   const raceId = searchCriteria.raceid;

   if (searchType == 1 || searchType == 2){
      return searchByBIP(raceId, searchCriteria.searchValue, searchCriteria.pageNumber, searchCriteria.pageSize);
   }
   else {
      return searchByImage(raceId, searchCriteria.pageNumber, searchCriteria.pageSize, searchCriteria.asset, searchCriteria.previousFaceIds, searchCriteria.faceMatchThreshold);
   }
}

async function searchByBIP(raceId, bib, pageNumber, pageSize){
  var url = globalConfig.baseUrl.concat('?campaignId=' + raceId)   //cannot use syntax `?campaignId=${{campId}}`
                                .concat('&page=' + pageNumber)
                                .concat('&size=' + pageSize);
  if (bib && bib !== '*'){
    url = url.concat('&bib=' + bib);
  }

  return await axios.get(url , {
          headers:{
            'X-Requested-With': 'XMLHttpRequest',
            'Access-Control-Allow-Origin' : '*',
            'Access-Control-Allow-Methods':'GET'
          }
       })
}

// try to post to the endpoint to create a race to test
async function searchByImage(raceId, pageNumber, pageSize, file, previousFaceIds, faceMatchThreshold){
  const url = globalConfig.searchImageUrl;

  let formData = new FormData();
  formData.append("campaignId", raceId);
  formData.append("page", pageNumber);
  formData.append("size", pageSize);
  if (file){
    formData.append("image", file);
  }
  formData.append("faceMatchThreshold", faceMatchThreshold);
  formData.append("maxFaces", 50);
  if (previousFaceIds){
    formData.append("previousFaceIds", previousFaceIds);
  }
  
  const config = {
      headers: {
          'Access-Control-Allow-Origin' : '*'
      }
  }
  return await axios.post(url, formData, config);
}

export async function getCampaigns(url)
{ 
 return await axios.get(url , {
    headers:{
      'X-Requested-With': 'XMLHttpRequest',
      'Access-Control-Allow-Origin' : '*',
      'Access-Control-Allow-Methods':'GET'
  }})
}