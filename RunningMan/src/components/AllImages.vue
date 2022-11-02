<template>
    <div class="flex-container row" style="margin: 15px 15px 15px 15px;" >
        <div class="col-sm-6 col-md-3 col-lg-2" v-for="item in state.items" :key="item.id">
            <a data-fancybox="imggroup" v-bind:href="item.imageUrl" > 
                <img v-bind:src="item.thumbnail">
            </a>
        </div>
    </div>
</template>


<script setup>
import {computed, reactive, ref} from 'vue'
import  ImageComponent  from './ImageComponent.vue'
import {getData, searchBIP} from '../services/DataService'
import axios from "axios";

const searchKeywork = ref(null);
const state = reactive({items: getData()})

</script>

