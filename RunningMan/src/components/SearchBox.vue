<template>
    <div class="container-fluid" id="#search-box">
       <div class="row">
          <div class="col-md-7">
            <div class="row">
                <div class="col-md-5" style="margin-bottom: 5px;">
                    <select class="form-control" id="search-type" v-model="searchType" @change="onSearchTypeChange">
                      <!-- <option value="1">Tất cả ảnh</option>
                      <option value="2">Tìm kiếm theo bib</option>
                      <option value="3">Tìm kiếm theo ảnh</option> -->
                      <option v-for="option in searchingTypes" :value="option.value" v-bind:key="option.value" >
                        {{option.text}}
                      </option>
                    </select>                  
                </div>
                
                <div class="col-md-7" style="margin-bottom: 5px;">  
                    <input class="form-control" id="txtBib" :disabled="searchType == 1" type="text" v-model="searchValue" v-if="searchType != 3"   />
                    <input class="form-control" @change="storeFile"  type="file" id="formFile" v-if="searchType == 3" /> 
                </div>
            </div>   
          </div>
          <div class="col-md-2">
              <button class="form-control" id="btnSearch" @click="$emit('searchImages', searchType, searchValue, file)">Tìm ảnh</button>
          </div>
          <div class="col-md-2" v-if="props.enableDownload">
            <a class="btn btn-info form-control" id="btnDownload"  @click=" $emit('downloadImages')">Tải ảnh về</a>
          </div>
       </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
const props = defineProps(['searchType', 'searchValue', 'allowType', 'enableDownload']);
const searchType = ref(props.searchType); // default value of int should be zero, would be setup in the next following lines
const searchValue = ref(props.searchValue); // don't set as null. Value cannot be updated. If primitive type: string, int, let's set a default value.
const file = ref(null);
// by default, we support search all & search by bib
const searchingTypes = ref([{"text":"Tất cả ảnh", "value": 1}, {"text":"Tìm kiếm theo bib", "value": 2}]);

//searchType change, we might need to setup againt searchValu as it has a default value for searchType 01
async function onSearchTypeChange(event){
    var searchType = event.currentTarget.value;
    if (searchType == "1") {// searchType for race
        searchValue.value = "*";
        file.value = null;
    }
    else if (searchType == "2"){
        searchValue.value = "";
        file.value = null;
    }
    else if (searchType == "3"){
        searchValue.value = "";
    }
}

function storeFile(event){
    file.value = event.target.files[0];
};

// watch change in imageList (after click on another page or click a new search criteria, data would be fetch in RaceImages and pass down to the component as a property) & update things accroi
watch(
  () => props.allowType,
  // allowType only is changed one time. After fetching data by search endpoint, RaceImages receive allowType and pass to SearchBox
  // basically, a wrong design. OnMounted of SearchBox should handle this, and perhaps, SearchBox can be changed to RaceInfo including general introduction of the race
  (newVal) =>{
   // 0 là ko gì cả, 1 là search bib, 2 là search face, 3 là search cả bib lẫn face
   // by default, we support bib searching & * (all images)
    if (newVal == 3){
        searchingTypes.value.push({"text":"Tìm kiếm theo ảnh", "value": 3});
    } 
  }
 )  ;
</script>