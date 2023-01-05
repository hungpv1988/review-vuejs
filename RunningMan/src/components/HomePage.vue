<template>
    <div>
        <!-- need this for tests to pass. Actually, we can remove router-view -->
        <router-view></router-view> 
    <!-- v-bind:style="{ backgroundImage: 'url(' + imagebg + ')' }"> -->
        <div class="container-fluid" id="main-container" >   
            <!-- <div class="container">
                <div class="row">
                    <div class="col-lg-3 col-md-3 col-sm-4">    
                        <a href="/">
                            <div id="logo"> </div>
                        </a>
                    </div>
                    <div class="col-lg-9 col-md-9 col-sm-8 " id="main-menu">  
                        <ul class="nav" style="float:right; margin-right:0px">
                            <li class="nav-item">
                                <a class="nav-link">  Tìm Ảnh </a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link"> Giải Đấu </a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link"> Giới Thiệu </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div> -->

            <div id="bib-search">
                <div class="container">
                    <div class="search-text">
                         YOUR <br> BEST MOMENTS
                    </div>
                </div>

                <div class="search-form">
                    <div class="container"> 
                            <div class="row">
                                <!-- consider to move to col-md-9, replace sm by md so that button will never lack space -->
                                <div class="col-sm-9">
                                    <div class="row">
                                        <div class="col-sm-6">
                                            <select class="form-control" v-model="raceid" id="raceList">
                                                <option v-for="option in options" :value="option.value" v-bind:key="option.value" >
                                                    {{option.text}}
                                                </option>
                                            </select>
                                        </div>
                                        <div class="col-sm-6">
                                            <input v-model="bib" id="bib"  type="text" class="form-control" name="bib" placeholder="Nhập số BIB" />
                                        </div>
                                    </div>
                                </div>

                                <div class="col-sm-3">
                                    <button id="btnMove" @click="moveToRaceDetails" class="form-control" style="background-color: #17b835; color: #FFF">TÌM ẢNH </button>
                                    <a href=""> go </a>
                                </div>
                            </div>
                    
                    </div>
                </div>
            </div>
        </div>    
    </div>
</template>

<style scoped>
#main-container { 
  background: url("/src/assets/DSC_3582h.jpg") no-repeat center center fixed; 
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
}


#bib-search {
    position: relative;
    /* background-image: url("../assets/backgroundrepeat.jpg");
    background-repeat: repeat; */
    background-size: 100%;
    height: 1200px;
}

#bib-search .search-text {
    padding-top: 10px;
    font-size: 55px;
    line-height: 60px;
    font-weight: bold;
    color: #FFF;
    text-shadow: -1px -1px 0 #333, 1px -1px 0 #333, -1px 1px 0 #333, 1px 1px 0 #333;
}

#bib-search .search-form {
    position: absolute;
    top: 240px;
    width: 100%;
    background-color: rgba(200,20,40,.4);
    padding: 40px 0;
}

.search-form .form-control, .search-form button {
    font-size: 22px;
    height: 50px !important;
    margin-top: 10px;
    margin-bottom: 5px;
    margin-right: 10px;
}
</style>
<script setup>
import {ref, onMounted} from 'vue';
import { useRouter, useRoute } from 'vue-router';
import {getCampaigns, getGlobalConfig} from '../services/DataService'


const {campaignsUrl} = getGlobalConfig();
const options = ref([                  
]);

const router = useRouter();
const route = useRoute();
// const route = useRoute(); keep here for code reference later on
const campaigns = ref([]);
const raceid = ref(1);
const bib = ref(null);
//const imagebg = "/src/assets/DSC_3582h.jpg"; -> no longer use background url. Comment here and not remove line for knowledge
// first phase in the flow. Load all races
onMounted(async() => {
  // just a simple fetching, so take it easy here
  getCampaigns(campaignsUrl).then(response => {
    response.data.campaigns
                 .forEach((item) => {
                        options.value.push({value: item.campaignId, text: item.campaignName});

                        // migrate data to campagins here so that we can retrieve alias later on when navigating to racedetails
                        campaigns.value.push({campaignId: item.campaignId, campaignName: item.campaignName, campaignAlias : item.alias});
                  });
    raceid.value = options.value[0].value;
  })
  .catch((error) =>{
    console.log(error);
  })
  .finally(() => {
    // should add metadata for sharing content here, but fb does not execute so that the code segment has been deleted, see git commit to take code if needed
  });
});

function moveToRaceDetails(){
    let query = {};
    if (bib.value){
        query.bib = bib.value;
    }
    
    const camp = campaigns.value.find(c => c.campaignId === raceid.value);
    router.push({
        name: 'racedetails',
        params: {raceid: raceid.value, racealias: camp.campaignAlias},
        query: query
    }).then((response) => {

  });
}
</script>
