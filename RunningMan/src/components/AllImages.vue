<template>
    <div>
      <div class="row" style="margin-top: 20px"> 
             <div class="col-md-6" style="margin-bottom: 1rem"> Có <strong>142,461</strong> ảnh của bạn, trong tổng số <strong>142,461</strong> ảnh </div>
   
              <div class="col-md-6">
                <nav aria-label="Page navigation">  
                     <ul class="pagination" style="float: right">
                        <li class="page-item active">
                            <a class="page-link" href="/photo?race_id=lbm2022&amp;result=0&amp;bib_type=all&amp;bib=*&amp;page=0">1</a>
                        </li>
                        <li class="page-item ">
                            <a class="page-link" href="/photo?race_id=lbm2022&amp;result=0&amp;bib_type=all&amp;bib=*&amp;page=1">2</a>
                        </li>
                        <li class="page-item ">
                            <a class="page-link" href="/photo?race_id=lbm2022&amp;result=0&amp;bib_type=all&amp;bib=*&amp;page=2">3</a>
                        </li>
                        <li class="page-item">
                            <a class="page-link" href="#">...</a>
                        </li>
                        <li class="page-item">
                            <a class="page-link" href="/photo?race_id=lbm2022&amp;result=0&amp;bib_type=all&amp;bib=*&amp;page=2967" aria-label="Next">
                                <span aria-hidden="true">»</span>
                            </a>
                        </li>
                    </ul>
                </nav>
             </div> 
      </div>

        <div> 
            <nav aria-label="Page navigation"> 
                 <ul class="pagination" style="float: right"> 
                    <li v-for='index in numberOfPage' :key='index' class="page-item" >
                        <a class="page-link" href="/photo?race_id=lbm2022&amp;result=0&amp;bib_type=all&amp;bib=*&amp;page=0">{{index}}</a>    
                    </li>
                 </ul>
            </nav>
        </div>

        <div class="row">
            <div class="col-sm-6 col-md-3 col-lg-2" v-for="item in state.items" :key="item.id">
                <a data-fancybox="imggroup" v-bind:href="item.imageUrl"> 
                    <img v-bind:src="item.thumbnail" class="img-fluid img-thumbnail">
                </a>
            </div>
        </div>
    </div>
</template>

<script setup>
import {computed, reactive, ref} from 'vue'
import {getData} from '../services/DataService'
import Paginate from 'vuejs-paginate'

let pageNumber = 1
const pageSize = 2
var res = getData(pageNumber, pageSize);
const numberOfPage = res.totalItems / pageSize;

const state = reactive(res.items);
// remember to cache items after reload news


</script>

