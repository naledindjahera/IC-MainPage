// ==========================
// STATIC DEMO DATA
// ==========================

const homeData = {
  story: "Welcome to Inspired Creations. We create beautiful experiences through art, pottery, and meaningful connections. Our goal is to bring people together through creativity and unforgettable moments.",

  founder: "Founded with passion and purpose, our founder believes in the power of creativity to heal, connect, and inspire people from all walks of life.",

  gridImages: [
    { src: "images/pottery.png", link: "urpottery.html" },
    { src: "images/wine.jpg", link: "potterywine.html" },
    { src: "images/couple.jpg", link: "coupledn.html" },
    { src: "images/speed.jpg", link: "potteryspeed.html" }
  ],

  bottomImages: [
    "images/suv1.jpg",
  //  "images/art2.jpg",
  //  "images/art3.jpg",
    "images/suv2.jpg"
  ]
};

// ==========================
// LOAD CONTENT
// ==========================

function loadHomePage() {

  // TEXT
  document.getElementById("homeStory").innerText = homeData.story;
  document.getElementById("homeFounder").innerText = homeData.founder;

  // GRID IMAGES
  const grid = document.getElementById("homeGrid");
  grid.innerHTML = "";

  homeData.gridImages.forEach(item => {
    grid.innerHTML += `
      <div class="home-card" onclick="location.href='${item.link}'">
        <img src="${item.src}">
      </div>
    `;
  });

  // BOTTOM GALLERY
  const bottom = document.getElementById("homeBottomGallery");
  bottom.innerHTML = "";

  homeData.bottomImages.forEach(src => {
    bottom.innerHTML += `
      <div class="bottom-item">
        <img src="${src}">
      </div>
    `;
  });

}

// INIT
loadHomePage();