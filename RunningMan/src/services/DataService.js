import axios from "axios";
import {ref} from "vue";

export function getGlobalConfig(){
  const startingPage = 1;
  const pageSize = 40;
  const baseUrl = "http://yourbib.xyz/v1/images/search-images"; //?campaignId=1
 
  return {startingPage, pageSize, baseUrl};
}

export async function getData(url, pageNumber = 1, pageSize = 8){ 
   url = url +'&page='+(pageNumber)+'&size='+ pageSize;
   // need paging from 1, not 0
   return await axios.get(url , {
    headers:{
      'X-Requested-With': 'XMLHttpRequest',
      'Access-Control-Allow-Origin' : '*',
      'Access-Control-Allow-Methods':'GET'
    }
 });
}

// obsolete as no separate endpoint for search bib
export async function searchBIP(url, bib, pageNumber, pageSize){
  url = url+"&bib="+bib + "&page="+pageNumber+"&size="+pageSize;
  return await axios.get(url , {
          headers:{
            'X-Requested-With': 'XMLHttpRequest',
            'Access-Control-Allow-Origin' : '*',
            'Access-Control-Allow-Methods':'GET'
          }
       })
}
