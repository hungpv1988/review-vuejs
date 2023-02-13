<template>
     <div class="row" id="#menu">
        <div class="col-lg-2 col-md-3 col-sm-4">    
                <a href="/">
                    <div id="logo"> 
                        <img width="40%" height="40%" src="../assets/timanhlogo.png" />
                    </div>
                </a>
        </div>

        <div class="col-lg-10 col-md-9 col-sm-8" id="main-menu">  
            <ul class="nav" >
                <li>
                    <a class="nav-link">  Sự Kiên Đang Mở </a>
                </li>
                <li>
                    <a class="nav-link"> Thông Tin Các Giải </a>
                </li>
                <li>
                    <a class="nav-link"> Giới Thiệu </a>
                </li>
            </ul>
        </div>  
    </div>
</template>
<style scoped>


@media (min-width: 0px) {
  li:nth-child(1){
      display: none;
  } 
  
  li:nth-child(2){
      display: none;
  } 

  li:nth-child(3){
      display: none;
  } 
}

@media (min-width: 576px) { 
  #main-menu { /* use for menu: su kien dang dien ra, gioi thieu...*/
          height: 60px;
          line-height: 60px;
          text-align: right;
          font-size: 14px;
          text-transform: uppercase;
          font-weight: bold;
    }
  li:nth-child(2){ /* hide the second menu item as the screen becomes smaller */
      display: block;
  } 

  li:nth-child(3){ /* hide the third menu item as the screen becomes smaller */
      display: block;
  } 
}

@media (min-width: 768px) {  
  #main-menu { /* use for menu: su kien dang dien ra, gioi thieu...*/
          height: 60px;
          line-height: 60px;
          text-align: right;
          font-size: 14px;
          text-transform: uppercase;
          font-weight: bold;
    }

  li:nth-child(1){ /* hide the first menu item as the screen becomes smaller */
      display: block;
  } 
}

@media (min-width: 992px) { 
    #main-menu { /* use for menu: su kien dang dien ra, gioi thieu...*/
          height: 100px;
          line-height: 82px;
          text-align: right;
          font-size: 20px;
          text-transform: uppercase;
          font-weight: bold;
    }
}

 @media (min-width: 1024px) {
  #app {
    display: grid;
    /* grid-template-columns: 1fr 1fr; */
    padding: 0 2rem;
  }
}
</style>
