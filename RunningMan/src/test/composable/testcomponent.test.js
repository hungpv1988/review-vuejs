import { mount, flushPromises } from "@vue/test-utils";
// the folder components here is to try out test framework, need to create simple components
// to try test api. This file is an example
import TestComponent from "../components/TestComponent.vue";
import { describe, it, expect } from "vitest";
import {setupMockServerForFindCampaignRest} from '../commonservice/MockServer';
import { setupServer } from 'msw/node';
import { rest } from 'msw';

setupMockServerForFindCampaignRest();

describe("HomePageTest.vue", () => {
  it.skip("should render components as expected", async () => {
    //setupMockServerForFindCampaignRest();
    const wrapper = mount(TestComponent);
   

    // https://v1.test-utils.vuejs.org/guides/#testing-asynchronous-behavior
    // https://test-utils.vuejs.org/guide/advanced/async-suspense.html#a-simple-example-updating-with-trigger
    // call this function to input element to update data
    await flushPromises();  //or  await nextTick()
    var cbRaces = wrapper.find("#raceList");
    var txtBib = wrapper.find("#bib");
    var btnMove = wrapper.find("#btnMove");
    var txtTest = wrapper.find("#txtTest").element.value;
  });
});
