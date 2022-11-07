import axios from "axios";
import {ref} from "vue";

export function getGlobalConfig(){
  const startingPage = 1;
  const pageSize = 8;
  //remove campaignId
  const imageEndpoint = "http://146.190.192.127:8080/v1/images/get-images?campaignId=1";
  const localImageEndpoint = ""; // or "https://localhost:44301/Running/" if it's local api, not fixed data
  // remove campaignId & fbclid
  const searchEndpoint = "http://146.190.192.127:8080/v1/images/search-images?campaignId=1"; 
  const localSearchEndpoint = ""; // or "https://localhost:44301/Running/" + bip if it's local api, not fixed data
 
  return {startingPage, pageSize, imageEndpoint, localImageEndpoint};
}

export async function getData(url, pageNumber = 1, pageSize = 8){
   if (!url){ // local environment
      return GetMockData(pageNumber, pageSize);
   };
   
   url = url +'&page='+(pageNumber-1)+'&size='+ pageSize;
   // need paging from 1, not 0
   return await axios.get(url , {
    headers:{
      'X-Requested-With': 'XMLHttpRequest',
      'Access-Control-Allow-Origin' : '*',
      'Access-Control-Allow-Methods':'GET'
    }
 });
}

export async function searchBIP(url, bib, pageNumber, pageSize){
  if (!url){ // local environment
    return GetMockData(pageNumber, pageSize);
  };

 // let imageList = ref([]); //&page=0&size=10
  url = url+"&bib="+bib + "&page="+pageNumber+"&size="+pageSize;
  await axios.get(url , {
          headers:{
            'X-Requested-With': 'XMLHttpRequest',
            'Access-Control-Allow-Origin' : '*',
            'Access-Control-Allow-Methods':'GET'
          }
       })
}


function GetMockData(pageNumber, pageSize){
   var startIndex = (pageNumber-1)  * pageSize;
   var endIndex = pageNumber  * pageSize;
   var total = data.length;
   var slicedItems = data.slice(startIndex, endIndex); 
   return {data: { images: slicedItems, total: total  }};
}


const data = [
  {
    id: 1,
    index: 1,
    "thumbnail" : "https://cdn.img.bibpix.net/photos/thumb/6355cb92c293394eb36d4622/2a415bc0a2d3770763b87de2eb76153e.jpg?v=10",
    "imageUrl": "https://img.bibpix.net/photos/sample/6355cb92c293394eb36d4622/2a415bc0a2d3770763b87de2eb76153e.jpg?v=10"
  },
  {
    id: 2,
    index: 2,
    "thumbnail" : "https://cdn.img.bibpix.net/photos/thumb/6355cb92c293394eb36d4622/4d7f590f9e792075b9c05dffdb8af5f7.jpg?v=10",
    "imageUrl": "https://img.bibpix.net/photos/sample/6355cb92c293394eb36d4622/4d7f590f9e792075b9c05dffdb8af5f7.jpg?v=10"
  },
  {
    id: 3,
    index: 3,
    "thumbnail" : "https://cdn.img.bibpix.net/photos/thumb/6355cb92c293394eb36d4622/54d92cf9254c3a0a302cd5156921c289.jpg?v=10",
    "imageUrl": "https://img.bibpix.net/photos/sample/6355cb92c293394eb36d4622/54d92cf9254c3a0a302cd5156921c289.jpg?v=10"
  },
  {
    id: 4,
    index: 4,
    "thumbnail" : "https://cdn.img.bibpix.net/photos/thumb/6355cb92c293394eb36d4622/cddb6a91c39e24f392e07ed2b3c62d16.jpg?v=10",
    "imageUrl": "https://img.bibpix.net/photos/sample/6355cb92c293394eb36d4622/cddb6a91c39e24f392e07ed2b3c62d16.jpg?v=10"
  },
  {
    id: 5,
    index: 5,
    "thumbnail" : "https://cdn.img.bibpix.net/photos/thumb/6355cb92c293394eb36d4622/6fc3505469e467e108dee4d5ec98ab1b.jpg?v=10",
    "imageUrl": "https://img.bibpix.net/photos/sample/6355cb92c293394eb36d4622/6fc3505469e467e108dee4d5ec98ab1b.jpg?v=10"
  },
  {
    id: 6,
    index: 6,
    "thumbnail" : "https://cdn.img.bibpix.net/photos/thumb/6355cb92c293394eb36d4622/977ca74cad0bc8ba68f504ff3af35b32.jpg?v=10",
    "imageUrl": "https://img.bibpix.net/photos/sample/6355cb92c293394eb36d4622/977ca74cad0bc8ba68f504ff3af35b32.jpg?v=10"
  },
  {
    id: 7,
    index: 7,
    "thumbnail" : "https://cdn.img.bibpix.net/photos/thumb/6355cb92c293394eb36d4622/d8e2a30d5280c7a791173c0d93355415.jpg?v=10",
    "imageUrl": "https://lbmpix.race.vn/photo?race_id=lbm2022&result=0&bib_type=all&bib=*&page=62#cl-group-33"
  },
  {
    id: 8,
    index: 8,
    "thumbnail" : "https://cdn.img.bibpix.net/photos/thumb/6355cb92c293394eb36d4622/711e0a11e6bfb5c647559b214f3120aa.jpg?v=10",
    "imageUrl": "https://img.bibpix.net/photos/sample/6355cb92c293394eb36d4622/711e0a11e6bfb5c647559b214f3120aa.jpg?v=10"
  },
]