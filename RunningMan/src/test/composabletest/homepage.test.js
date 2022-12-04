import { mount, flushPromises } from "@vue/test-utils";
import HomePage from "src/components/HomePage.vue";
import RaceImages from "../../components/RaceImages.vue";
import { describe, it, expect } from "vitest";
import {setupMockServerForFindCampaignRest} from '../commonservice/MockServer';
import routes from '../commonservice/routes';
import { createRouter, createWebHistory } from 'vue-router'


setupMockServerForFindCampaignRest();

describe("HomePage.vue", () => {
  it("should render components as expected", async () => {
    // should include router to be able to debug
    const wrapper = mount(HomePage);
    await flushPromises();

    var cbRaces = wrapper.find("#raceList");
    var txtBib =  wrapper.find("#bib");
    var btnMove = wrapper.find("#btnMove");

    // assert
    expect(txtBib.element.placeholder).toBe("Nhập số BIB");
    
    // assert button
    expect(btnMove.exists()).toBe(true)
    expect(btnMove.element.className).toBe('form-control');

    // assert combo races. In handler.js, we mock 4 campaigns so that we need to verify that all rendered well
    var options = cbRaces.element.options; 
    expect(options[0].value).toBe('32');
    expect(options[0].text).toBe("HAPPY EKIDEN 2022");

    expect(options[1].value).toBe('26');
    expect(options[1].text).toBe("RUN FOR A GREEN LIFE (OCEAN PARK 2) 11-2022");

    expect(options[2].value).toBe('25');
    expect(options[2].text).toBe("TRE MARATHON (ECOPARK 2022)");

    expect(options[3].value).toBe('28');
    expect(options[3].text).toBe("CHẠY VÌ VN KHÔNG CÓ BẠO LỰC VỚI PHỤ NỮ VÀ TRẺ EM GÁI");

    expect(wrapper.html()).toContain('BEST MOMENTS'); // router navigates to raceimage
  });

  it("should navigate to race details after clicking on button", async () => {
    const router = createRouter({
      history: createWebHistory(),
      routes
    })
    router.push('/');
  // need this to guarantee initial navigation is done
  // https://test-utils.vuejs.org/guide/advanced/vue-router.html#using-a-real-router
    await router.isReady();
    await flushPromises();

    const wrapper = mount(HomePage, {
      global: {
        plugins: [router]
      }
    });
    await flushPromises();
    
    var btnMove = await wrapper.find("#btnMove");
    await btnMove.trigger('click');
  // flush so that Dom can be updated
    await flushPromises();

  //assert
    expect(wrapper.html()).toContain('Tất cả ảnh'); // router navigates to raceimage
    expect(wrapper.findComponent(RaceImages).exists()).toBe(true);
  });

  it("should navigate to raceimages in line with chosen options in dropdownlist after clicking on the button", async () => {
    const router = createRouter({
      history: createWebHistory(),
      routes
    })
    router.push('/');
    // need this to guarantee initial navigation is done
    // https://test-utils.vuejs.org/guide/advanced/vue-router.html#using-a-real-router
    await router.isReady();
    await flushPromises();

    const wrapper = mount(HomePage, {
      global: {
        plugins: [router]
      }
    });
    await flushPromises();
      
    var btnMove = await wrapper.find("#btnMove");
    var cbRaces = await wrapper.find("#raceList") ;    
    cbRaces.setValue(cbRaces.element.options[0].value);
    await btnMove.trigger('click');
    await flushPromises();

    //assert
    var currentRoute = router.currentRoute.value;
    var raceName = cbRaces.element.options[0].text;
    var raceId = cbRaces.element.value;

    expect(wrapper.html()).toContain('Tất cả ảnh'); // router navigates to raceimage
    expect(wrapper.findComponent(RaceImages).exists()).toBe(true);
    expect(wrapper.html()).toContain(raceName); // router navigates to raceimage
    expect(currentRoute.query.raceid).equal(raceId);
    expect(currentRoute.query.bib).toBe(undefined); // no fill big
    expect(currentRoute.name).equal("raceimages");
  });

  it("should navigate to raceimages with the correct bib filled after clicking on the button", async () => {
    const router = createRouter({
      history: createWebHistory(),
      routes
    })
    router.push('/');
    // need this to guarantee initial navigation is done
    // https://test-utils.vuejs.org/guide/advanced/vue-router.html#using-a-real-router
    await router.isReady();
    await flushPromises();

    const wrapper = mount(HomePage, {
      global: {
        plugins: [router]
      }
    });
    await flushPromises();

    var btnMove = await wrapper.find("#btnMove");
    var cbRaces = await wrapper.find("#raceList") ;
    var txtBib =  wrapper.find("#bib");
    cbRaces.setValue(cbRaces.element.options[1].value);
    txtBib.setValue('12345');
    await btnMove.trigger('click');
    // flush so that Dom can be updated
    await flushPromises();

    //assert
    var raceName = cbRaces.element.options[1].text;
    var raceId = cbRaces.element.value;
    var currentRoute = router.currentRoute.value;

    expect(wrapper.html()).toContain('Tất cả ảnh'); // router navigates to raceimage
    expect(wrapper.findComponent(RaceImages).exists()).toBe(true);
    expect(wrapper.html()).toContain(raceName); // router navigates to raceimage
    expect(currentRoute.query.raceid).equal(raceId);
    expect(currentRoute.query.bib).equal(txtBib.element.value);
    expect(currentRoute.name).equal("raceimages");
  });
});

