window.addEventListener('load',function() {

    addJour = this.document.querySelectorAll('.addJour');
    console.log(addJour);
})

// 點擊加入行程抓到這個行程的資料
function fetchData() {
    let sliderItem = document.querySelector('.slider_item--active');
    curJour = +sliderItem.dataset["jour"];
    
    fetch(`./phps/fetchJour.php?find=${curJour}`).then(res => res.json())
    .then(data => {

        // 抓該行程的天數

        let dayArr = [];
        let dayNum = Math.max(...data.map(jour => +jour.journeySpotDay));
       

        for(let i = 1; i <= dayNum; i++ ) {
            let theData = data.filter(jour => jour.journeySpotDay == i);
            dayArr.push(theData);
        }
 
        
        // 寫入session storage
        sessionStorage.clear();
        dayArr.forEach((day,i) => {
             // 整理陣列裡物件順序
            day.sort((a,b) => +a.sequence - +b.sequence);
            sessionStorage.setItem(`day${i+1}`, JSON.stringify(day));
        });

        displaySide(curJour,dayNum);
        
    })

}
fetchData();

function sortTour() {
    sorts = document.querySelectorAll('.sort_item');
    mains = document.querySelectorAll('.tour_main');
    sorts.forEach(sort => sort.addEventListener('click',changeCity));
    
    
      function changeCity(e) {
        if(!e.target.classList.contains('sort_item')) return;
      sorts.forEach(tab => tab.classList.remove('sort_item--active'));
      mains.forEach(page => page.classList.remove('tour_main--active'));

      let curCity = e.target.dataset['sort'];
      let sort = document.querySelector(`.tour_side--${curCity}`);
      let mainPage = document.querySelector(`.tour_main--${curCity}`);
      
     
      e.target.classList.add('sort_item--active');
      mainPage.classList.add('tour_main--active');
      
  }
}
sortTour();


// 呈現該行程 tour_side
function displaySide(no,num) {
    let tourContent = document.querySelector('.tour_side--active .tour_content');
    let timelineBox = document.querySelector('.timeline_box');

    let tabs = '';

    for(let i = 1; i <= num; i++) {
        let dayData = JSON.parse(sessionStorage.getItem(`day${i}`));

        let timelinePage = document.querySelector(`.timeline_page--${i}`);

        tabs += `<div class="timeline_tab timeline_tab--${i}" data-tab="${i}">第${i}天</div>`;
        
    

        let items = dayData.map(day => {
            let {spotNo,sequence,spotName,spotImg} = day;

            let spotItem = `
            <li class="timeline_item tourBuild_item" data-no="${spotNo}" drag-handle>
            <div class="timeline_text">
                <div class="timeline_num">${sequence}</div>
                <div class="timeline_name">${spotName}</div>
            </div>
            <div class="timeline_img">
                <img src="${spotImg}" alt="">
            </div>
            </li>
            `
            return spotItem;
        }).join('');
        

        timelinePage.innerHTML = items;
    }
 
    timelineBox.innerHTML = tabs;

    changeTab();
}

// 切換行程天標籤
function changeTab() {
    tabs = document.querySelectorAll('.timeline_tab');
    pages = document.querySelectorAll('.timeline_page');
    tabs.forEach(tab => tab.addEventListener('click',changePage));
  
  }
changeTab();



function slideContent() {
  let seeDetailBtn = document.querySelector('#seeDetail');
  let box = document.querySelector('.tour_box');

  seeDetailBtn.addEventListener('click',() => {
    
    box.style.transform = `translateX(calc(-100% + 15px))`;
  })

  let arrowBtn = document.querySelector('#arrowBtn');
  arrowBtn.addEventListener('click',() => {
    box.style.transform = `translateX(0%)`;
  })
}
slideContent();

function changeTab() {
tabs = document.querySelectorAll('.timeline_tab');
pages = document.querySelectorAll('.timeline_page');
tabs.forEach(tab => tab.addEventListener('click',changePage));

    function changePage(e) {
    tabs.forEach(tab => tab.classList.remove('timeline_tab--active'));
    pages.forEach(page => page.classList.remove('timeline_page--active'));

    let curPage = Number(e.target.dataset['tab']);
    let tab = document.querySelector(`.timeline_tab--${curPage}`);
    let page = document.querySelector(`.timeline_page--${curPage}`);

    if(!tab || !page) return;
    tab.classList.add('timeline_tab--active');
    page.classList.add('timeline_page--active');
    }
}

changeTab();

function changeItem() {
  let sliderItem = document.querySelectorAll('.slider_item');
  
  sliderItem.forEach(item => item.addEventListener('click', turnActive));

  function turnActive(e) {
    sliderItem.forEach(item => item.classList.remove('slider_item--active'));

    if(!e.target.classList.contains('slider_item')) return;
    e.currentTarget.classList.add('slider_item--active');

    fetchData();

  }

}

changeItem();

function closePopup() {
      let closeBtn = document.querySelector('.btn--close');
      let tourBtn = document.querySelector('.tour_btn');
      let box = document.querySelector('.tour_side');

      closeBtn.addEventListener('click',(e) => {
        box.style.display = 'none';
      })

      tourBtn.addEventListener('click',() => {
        box.style.display = 'block';
      })
}

closePopup();

// 建立行程表單需要:
function popupSwitch() {
    let closeBtn = document.querySelector('.popup_close');
    let addBtn = document.querySelectorAll('.btn--add');

    let popup = document.querySelector('.popup');

    closeBtn.addEventListener('click',() => {
        popup.style.display = 'none';
    })

    addBtn.forEach(btn => btn.addEventListener('click',() => {
      popup.style.display = 'flex';
    }));

    
}
popupSwitch();

function slidePage() {
    let nextBtn = document.querySelector('#slide-next');
    let arrowBtn = document.querySelector('#arrowBtn');
    let box = document.querySelector('.tourForm_box');

    nextBtn.addEventListener('click',() => {
    let form = document.querySelector('.tourForm_form');
    if(form.tourName.value) {
        box.style.transform = `translateX(calc(-100% - 20px))`;
    }  
    
    })

    arrowBtn.addEventListener('click',() => {
    box.style.transform = `translateX(0%)`;
    })

}
slidePage();

// 讓popup的資料為fetch回來的資料
function tourForm() {
    let data = JSON.parse(sessionStorage.getItem("day1"));
    
    tourName.value = '';
}

tourForm()

// 傳回資料
// 