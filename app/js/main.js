(function () {
console.log("start")
"use strict"

let headerBurger = document.querySelector('.global-burger__button');
let headerNavList = document.querySelector('.header-top__logo');
let headerLogo = document.querySelector('.header-top__nav');

let activateBurger = function () {
  headerBurger.classList.toggle("global-burger--active")
  headerNavList.classList.toggle("header-top__logo--disabled")
  headerLogo.classList.toggle("header-top__nav--active")
}

headerBurger.addEventListener('click', () => activateBurger());

function menuControl(menu) {
  var scrollPos = window.scrollY;
  var links = menu.querySelectorAll('a[href^="#"]');
  for (var i = 0; i < links.length; i++) {
    var currLink = links[i];
    var refElement = document.querySelector(currLink.getAttribute('href'));
    if (refElement.offsetTop <= scrollPos && refElement.offsetTop + refElement.clientHeight > scrollPos) {
      currLink.classList.add('active');
    } else {
      currLink.classList.remove('active');
    }
  }
}

const anchors = document.querySelectorAll('a[href*="#"]')

for (let anchor of anchors) {
  anchor.addEventListener('click', function (event) {
    event.preventDefault()

    const blockID = anchor.getAttribute('href')

    document.querySelector(blockID).scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
  })
}

window.addEventListener('scroll', trackScroll);
function trackScroll() {
  var scrolled = window.pageYOffset;
  var coords = document.documentElement.clientHeight;
  var goTopBtn = document.querySelector('.global__go-top-arrow');
  if (scrolled > coords) {
    goTopBtn.classList.add('global__go-top-arrow--show');
  }
  if (scrolled < coords) {
    goTopBtn.classList.remove('global__go-top-arrow--show');
  }
}


let swiper = new Swiper(".mySwiper", {
  // spaceBetween: 30,
  slidesPerView: 1,
  spaceBetween: 10,

  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },

  breakpoints: {
    1050: {
      spaceBetween: 10,
      slidesPerView: 2,
    }
  },
  mousewheel: true,
  keyboard: true,
});

let mainList = document.querySelector('.recepies__post-list');
let previewlist = document.querySelector('.recepies__post-previewlist');
let breakfast = previewlist.querySelector('.recepies-post--breakfast');
let lunch = previewlist.querySelector('.recepies-post--lunch');
let dinner = previewlist.querySelector('.recepies-post--dinner');
let sweets = previewlist.querySelector('.recepies-post--sweets');
let backLinks = document.querySelectorAll('.recepies-post__back-link');
let activePostNumber = 0;
let postClassArray = [
  "breakfast",
  "lunch",
  "dinner",
  "sweets"];

let changeClass = function (activatePostNumber) {
  for (let postClass of postClassArray) {
    mainList.classList.remove(postClass);
  }
  activePostNumber = activatePostNumber;
  mainList.classList.add(postClassArray[activatePostNumber]);
}
let nextPost = function () {
  let count = activePostNumber;
  if (activePostNumber < 3) {
    activePostNumber++;
  } else {
    activePostNumber = 0;
  }
  return (changeClass(activePostNumber))
}

breakfast.addEventListener('click', () => changeClass(0));
lunch.addEventListener('click', () => changeClass(1));
dinner.addEventListener('click', () => changeClass(2));
sweets.addEventListener('click', () => changeClass(3));
for (let backLink of backLinks) {
  backLink.addEventListener('click', () => nextPost());

}

})();    
