<template>
    <div>
        <div>{{team}}</div>
        <div>{{domain}}</div>
        <div>{{office}}</div>
        <div v-for="item in items" :key="item.id">
            <div> {{item.name}}</div>
            <div> {{item.des }}</div>
        </div>

        <button  @click="welcome"> Welcome {{numberOfPeople}} members from {{team}} in {{office}}</button>
        <button @click="addTeammate">Add member - beta version</button>
    </div>
 </template>

<script>
import { reactive, computed } from '@vue/runtime-core';
    export default {
        props: ['office'],

        // pass props from parent
        setup(props)
        {
            console.log(props.office);
        },
        
        /**
            * Commenting multiple lines
            * Commenting multiple lines
         */
        data(){
            return {
                team: "Content Platform",
                domain: "CMS Core and Headless",
                items: reactive([
                            {"id": 1, "name": "hung phan", "desc": "handsome"},
                            {"id": 2, "name": "Thach Nguyen", "desc": "Rich"},
                            {"id": 3, "name": "Son Nguyen", "desc": "Wisdom"},
                            {"id": 4, "name": "Long Le", "desc": "King"}
                       ])
            }
        },

        methods:{
            welcome(){
                        alert("welcome people from "+ this.team + " in "+ this.office);
                     },
            addTeammate(){
                var id = this.items.length;
                this.items.push({"id": id, "name": "Member " + id, "desc": "Desc" + id});
            }
        },

        computed:{
            numberOfPeople(){
                return this.items.length;
            }
        },

        mounted(){
            this.items.push({"id": 5, "name": "Quan Tran", "desc": "little baby"});
        }
    }
</script>
