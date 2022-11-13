<template>
    <div>
      
        <router-view></router-view>

    <div class="container-fluid">
            <div class="container">
                <div class="row">
                    <div class="col-lg-3 col-md-3 col-sm-4">    
                        <a href="/">
                            <div id="logo"> </div>
                            <!-- <img src="../assets/layout_vp_logo.png" /> -->
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
            </div>

            <div id="bib-search">
                <div class="container">
                    <div class="search-text">
                        Ghi Nhớ <br> Những <br> Khoảng Khắc
                    </div>
                </div>

                <div class="search-form">
                    <div class="container"> 
                            <div class="row">
                                <div class="col-sm-9">
                                    <div class="row">
                                        <div class="col-sm-6">
                                            <select class="form-control" v-model="raceid" ref="select">
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
                                    <button @click="moveToPage" class="btn btn-info form-control" style="color: #FFF">TÌM ẢNH &nbsp;  <i class="fas fa-search"></i> </button>
                                </div>
                            </div>
                    
                    </div>
                </div>
            </div>
        </div>    
    </div>
</template>

<style scoped>
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
    background-image: url("../assets/backgroundrepeat.jpg");
    background-repeat: repeat;
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
    background-color: rgba(26,26,26,.8);
    padding: 40px 0;
}

.search-form .form-control, .search-form button {
    font-size: 22px;
    height: 50px !important;
    margin-top: 10px;
    margin-bottom: 5px;
    margin-right: 10px;
}

.fa-search:before {
    content: "\f002";
}

.fas {
    font-weight: 900;
    font-family: "Font Awesome 5 Free";
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    display: inline-block;
    font-style: normal;
    font-variant: normal;
    text-rendering: auto;
    line-height: 1;
}
</style>
<script setup>
import {ref} from 'vue';
import { useRouter, useRoute } from 'vue-router';
const options = ref([
                        {text:"PVOIL VOC 2022",value:"1"},
                        {text:"Maraton LongBien 2022",value:"2"},
                        {text:"Halong 2022",value:"3"},
                        {text:"Hue 2022",value:"4"},
]);

const router = useRouter();
const route = useRoute();
const raceid = ref(options.value[0].value);
const bib = ref(null);
function moveToPage(){
     router.push({name: 'raceimage', query:{raceid: raceid.value, bib:bib.value}});
}

</script>
