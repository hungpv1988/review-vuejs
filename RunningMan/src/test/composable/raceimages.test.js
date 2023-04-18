import { mount, flushPromises } from "@vue/test-utils";
import HomePage from "src/components/HomePage.vue";
import { describe, it, expect, beforeEach } from "vitest";
import {setupMockServerForFindCampaignRest} from '../commonservice/MockServer';
import {mockConstant} from '../commonservice/MockConstant';
import routes from '../commonservice/routes';
import { createRouter, createWebHistory } from 'vue-router';
import {getGlobalConfig} from '../../services/DataService';
import {getAllCampaigns} from '../commonservice/mockDataService';



setupMockServerForFindCampaignRest();

const router = createRouter({
  history: createWebHistory(),
  routes
});

const allCamp = getAllCampaigns();
var raceName = allCamp[0].campaignName,
    raceId = allCamp[0].campaignId,
    raceAlias = allCamp[0].alias;

describe("races.vue", () => {
  beforeEach(async () => {
  //  const query = {raceid: raceId}; // first race is 32, and mocked in handler to return data
    router.push(
      {
        name: 'racedetails', 
        params: {raceid: raceId, racealias: raceAlias},
      });
    await router.isReady();
    await flushPromises();
  });

  // should render as expected when visit with bib, but can move to end-to-end
  it("should render searching types as expected", async () => {
    const raceIdSupportingSearchByImage = getAllCampaigns()[1].campaignId
    const wrapper = mount(HomePage, {
      global: {
        plugins: [router]
      }
    });
    await flushPromises();
      
    var currentRoute = router.currentRoute.value;
    var imgs = wrapper.find("#image-box").findAll("img");
    const apiConstants = mockConstant();
    var allImagesReturnedFromApi = raceId * apiConstants.multipler; // in MockDataService, we return campId * 4 images
    var pageSize = getGlobalConfig().pageSize; // 40
    
    // number of image dispalyed, total images, & campaign name.
    expect(wrapper.find('#campaign-name').text()).toContain(raceName); // router navigates to raceimage
    expect(wrapper.find('#statistic-box').text()).toContain(allImagesReturnedFromApi); // all images
    expect(imgs.length).equal(40); // id is 32, it should be 128 images returned, but paging is 40

    //  paging
    const wrapperText = wrapper.find('#paging-box').text();
    expect(wrapperText).toContain("Prev"); 
    expect(wrapperText).toContain("Next");   
    const numeberOfPage = Math.ceil(allImagesReturnedFromApi/ pageSize);
    expect(wrapperText).toContain(1); // page 01
    expect(wrapperText).toContain(2); // page 02
    expect(wrapperText).toContain(3); // page 03
    expect(wrapperText).toContain('…'); //... if there is only 4 pages, than ... not exists
    expect(wrapperText).not.toContain(4); // pre 1 2 3 ... numeberOfPage, 
    expect(wrapperText).toContain(numeberOfPage); //...
    expect(wrapper.find('#paging-box').text()).toContain(Math.ceil(allImagesReturnedFromApi/ pageSize)); 

   // expect(parseInt(currentRoute.query.raceid)).equal(campId);
    expect(parseInt(currentRoute.params.raceid)).equal(raceId);

    expect(currentRoute.query.bib).toBe(undefined); // no fill bib
    expect(currentRoute.name).equal("racedetails");
  });

  it("should paginate as expected", async () => {
    const wrapper = mount(HomePage, {
      global: {
        plugins: [router]
      }
    });
    await flushPromises();

    const allPageItem = wrapper.findAll(".page-item").length; // pre 1 2 3 .... last_page next
    // index 0: pre, index 1: page 01, index 2: page 02. Click on page 02
    // page 02
    await wrapper.findAll(".page-item")[2].find("a").trigger("click"); 
    await flushPromises();
    expect(wrapper.findAll(".page-item")[2].classes()).toContain("active"); // page 02 is active now

    // next. At the end
    await wrapper.findAll(".page-item")[allPageItem-1].find("a").trigger("click"); // next button
    await flushPromises();
    expect(wrapper.findAll(".page-item")[3].classes()).toContain("active"); //  page 03 is active now

    // pre
    await wrapper.findAll(".page-item")[0].find("a").trigger("click"); // pre button
    await flushPromises();
    expect(wrapper.findAll(".page-item")[2].classes()).toContain("active"); //  page 02 is active now

    // last page
    await wrapper.findAll(".page-item")[allPageItem-2].find("a").trigger("click"); // last page 
    await flushPromises();
    expect(wrapper.findAll(".page-item")[allPageItem-2].classes()).toContain("active"); //  last page is active now
  });

  // fail to make this work. Take too much time and effort so give up -> should move to end-to-end
  // should use this test to validate component interaction
  it("should behave as expected when component interacts with each other", async () => {
    const wrapper =  mount(HomePage, {
      global: {
        plugins: [router]
      }
    });
    await flushPromises();
    var txtBib = await wrapper.find("#txtBib") ; 
    expect(txtBib.element.disabled).toBe(true);
    expect(txtBib.element.value).toBe("*");
    
    // test interaction when search all image
    var cbSearchType = await wrapper.find("#search-type") ;   
    cbSearchType.setValue(cbSearchType.element.options[0].value); // search by bib
    txtBib = await wrapper.find("#txtBib") ; 
    expect(txtBib.element.disabled).toBe(true);
    expect(txtBib.element.value).toBe("*");
    var btnDownload = await wrapper.find("#btnDownload");
    expect(btnDownload.exists()).toBe(false); //  Do not allow download if search all, should not be exist

    // test interaction when search by bib
    cbSearchType.setValue(cbSearchType.element.options[1].value); // search by bib
    txtBib = await wrapper.find("#txtBib") ; 
    expect(txtBib.element.disabled).toBe(false); 
    await txtBib.setValue('4'); // see the list of supported bib in MockConstant
    await wrapper.find("#btnSearch").trigger('click');
    await flushPromises();
    var currentRoute = router.currentRoute.value;
    expect(currentRoute.query.bib).equal(txtBib.element.value);
    btnDownload = await wrapper.find("#btnDownload");
    expect(btnDownload.exists()).toBe(true); //   allow download if search by bib, should not be exist
    
    // test interaction when search by image can be done in IT as it's easier to setup

    // test interaction when search all image
    var cbSearchType = await wrapper.find("#search-type") ;   
    cbSearchType.setValue(cbSearchType.element.options[0].value); // search by bib
    txtBib = await wrapper.find("#txtBib") ; 
    expect(txtBib.element.disabled).toBe(true);
    expect(txtBib.element.value).toBe("*");
    await wrapper.find("#btnSearch").trigger('click');
    await flushPromises();
    var btnDownload = await wrapper.find("#btnDownload");
    expect(btnDownload.exists()).toBe(false); //  Do not allow download if search all, should not be exist
  });
});



