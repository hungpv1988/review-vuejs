import MockConstant from './MockConstant';

export function getAllCampaigns(){
    return [
        {
          "campaignId": 32,
          "campaignName": "HAPPY EKIDEN 2022",
          "logoUrl": "https://yourbib.xyz/v1/images/get-image/null04-12bmllvehlbival_original_image_1.png",
          "description": "Happy Ekiden 2022",
          "startLocation": "hà nội",
          "status": 1,
          "startDate": "2022-12-04 00:00:00.0"
        },
        {
          "campaignId": 26,
          "campaignName": "RUN FOR A GREEN LIFE (OCEAN PARK 2) 11-2022",
          "logoUrl": "http://146.190.192.127:8080/v1/images/get-image/nullpnryzglvdqlogo.png",
          "description": "Run for a green life (Ocean park 2) 11-2022",
          "startLocation": "hà nội",
          "status": 1,
          "startDate": "2022-11-20 00:00:00.0"
        },
        {
          "campaignId": 25,
          "campaignName": "TRE MARATHON (ECOPARK 2022)",
          "logoUrl": "http://146.190.192.127:8080/v1/images/get-image/nullxaubjlmwhwlogo.png",
          "description": "Ecopark 2022",
          "startLocation": "hà nội",
          "status": 1,
          "startDate": "2022-11-19 00:00:00.0"
        },
        {
          "campaignId": 28,
          "campaignName": "CHẠY VÌ VN KHÔNG CÓ BẠO LỰC VỚI PHỤ NỮ VÀ TRẺ EM GÁI",
          "logoUrl": "https://yourbib.xyz/v1/images/get-image/nullmaajnapurxtype-giai-chay-jpg-removebg-preview.png",
          "description": "Chạy vì VN không có bạo lực với phụ nữ và trẻ em gái",
          "startLocation": "hà nội",
          "status": 1,
          "startDate": "2022-02-02 00:00:00.0"
        }
      ];
}
// fail to work, cannot understand -> can be deleted
export function getImagesByCampaigns(campaignid) {
    // const campaigns = getAllCampaigns();
    // const matchingCamp = campaigns.find(cam => parseInt(cam.campaignId) === parseInt(campaignid)); 
    // if (matchingCamp === null || matchingCamp === undefined){
    //     return [];
    // }

    const campImages = [];
    for(var i =0; i < MockConstant().multipler * parseInt(campaignid); i++){
        campImages.push( {
            "thumbnail": "https://yourbib.xyz/v1/images/get-image/null04-12zvjfyidwumthumbnail-LIN_0229.JPG",
            "imageUrl": "https://yourbib.xyz/v1/images/get-image/null04-12uowysqtncpfullhd-LIN_0229.JPG",
            "imageWithLogoUrl": "https://yourbib.xyz/v1/images/get-image/null04-12jaeaivxzkpwatermark-LIN_0229.JPG"
          });
    };

    return images;
}
// fail to work, cannot understand -> can be deleted
export function getImagesByBib(campaignid, bib) {
    const campaigns = getAllCampaigns();
    
    const matchingCamp = campaigns.find(cam => parseInt(cam.campaignId) === parseInt(campaignid)); 
    if (!matchingCamp){
        return [];
    }

    var supportedBibs = MockConstant();
    if (!supportedBibs.find(bib))
    {
        return [];
    }
    
    const imgs = getImagesByCampaigns(campaignid);
    if (bib === 1) 
    {
        return imgs.slice(0, 50);
    }

    if (bib === 2) 
    {
        return imgs.slice(50, 70);
    }

    if (bib === 3) 
    {
        return imgs.slice(70, 90);
    }

    if (bib === 4) 
    {
        return imgs.slice(90, 100);
    }

    return imgs;
}

