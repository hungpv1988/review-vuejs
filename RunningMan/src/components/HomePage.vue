<template>
    <div>
      
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
                                <div class="col-sm-9">
                                    <div class="row">
                                        <div class="col-sm-6">
                                            <select class="form-control" v-model="raceid">
                                                <option v-for="option in options" :value="option.value" v-bind:key="option.value" >
                                                    {{option.text}}
                                                </option>
                                            </select>
                                        </div>
                                        <div class="col-sm-6">
                                            <input v-model="bib"  type="text" class="form-control" name="bib" placeholder="Nhập số BIB" />
                                        </div>
                                    </div>
                                </div>

                                <div class="col-sm-3">
                                    <button @click="moveToPage" class="form-control" style="background-color: #17b835; color: #FFF">TÌM ẢNH </button>
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

#logo{
    height:80px;
    margin-top: 10px; 
    background-image: url("../assets/layout_vp_logo.png");
    background-repeat: no-repeat; 
    background-size: contain;
}
.nav {
    display: flex;
    flex-wrap: wrap;
    padding-left: 0px;
    margin-bottom: 0px;
    list-style: none;
}

#main-menu{
    height: 100px;
    line-height: 82px;
    text-align: right;
    font-size: 20px;
    text-transform: uppercase;
    font-weight: bold;
}

#main-menu .nav {
    float:right;
    margin-right:0px;
}

#main-menu .nav .nav-item {
    padding-left: 20px;
    padding-right: 20px;
}

.nav-link {
    display: block;
    padding: 0.5rem 1rem;
}
#main-menu a, #main-menu a:hover, #main-menu a:visited {
    color: #253C82;
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
import axios from "axios";  
const options = ref([
                       
]);

const router = useRouter();
// const route = useRoute(); keep here for code reference later on
const raceid = ref(1);
const bib = ref(null);
const imagebg = "/src/assets/DSC_3582h.jpg";
// first phase in the flow. Load all races
onMounted(async() => {
  // just a simple fetching, so take it easy here
    var apiEndpoint = "http://146.190.192.127:8080/v1/campaign/find";

   return await axios.get(apiEndpoint , {
    headers:{
      'X-Requested-With': 'XMLHttpRequest',
      'Access-Control-Allow-Origin' : '*',
      'Access-Control-Allow-Methods':'GET'
    }}).then(response => {
              var campaigns = response.data.campaigns;
              campaigns.forEach((item) => {
                options.value.push({value: item.campaignId, text: item.campaignName});
              });
              raceid.value = options.value[0].value;
          });
})

function moveToPage(){
     router.push({name: 'raceimages', query:{raceid: raceid.value, bib:bib.value}});
}

</script>
