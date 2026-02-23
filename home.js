/* STORAGE KEYS */
const HOME_MEDIA_KEY = "homeGridMedia";
const HOME_STORY_KEY = "homeStoryText";
const HOME_FOUNDER_KEY = "homeFounderText";

/* ADMIN */
let homeAdmin = false;

function enableHomeAdmin(){
  homeAdmin = true;
  document.getElementById("homeAdminPanel").style.display = "flex";
  renderHomeGrid();
  renderBottomGrid();
}

function disableHomeAdmin(){
  homeAdmin = false;
  document.getElementById("homeAdminPanel").style.display = "none";
  renderHomeGrid();
  renderBottomGrid();
}

/* GRID MEDIA */
function getHomeMedia(){
  const data = localStorage.getItem(HOME_MEDIA_KEY);
  return data ? JSON.parse(data) : [];
}

function saveHomeMedia(items){
  localStorage.setItem(HOME_MEDIA_KEY, JSON.stringify(items));
}

function renderHomeGrid(){
  const container = document.getElementById("homeGrid");
  const items = getHomeMedia();
  container.innerHTML = "";

  items.forEach((item,index)=>{
    container.innerHTML += `
      <div class="home-card" onclick="location.href='${item.link}'">
        <img src="${item.src}">
        ${
          homeAdmin
          ? `<button class="delete-home" onclick="event.stopPropagation(); deleteHomeImage(${index})">×</button>`
          : ""
        }
      </div>
    `;
  });
}

function addHomeImage(event){
  const file = event.target.files[0];
  if(!file) return;

  const link = prompt("Enter page link (example: potterywine.html)");
  if(!link) return;

  const reader = new FileReader();
  reader.onload = ()=>{
    const media = getHomeMedia();
    media.push({src:reader.result, link});
    saveHomeMedia(media);
    renderHomeGrid();
  };
  reader.readAsDataURL(file);
}

function deleteHomeImage(index){
  const media = getHomeMedia();
  media.splice(index,1);
  saveHomeMedia(media);
  renderHomeGrid();
}

/* PARAGRAPHS */
function loadHomeText(){
  document.getElementById("homeStory").innerText =
    localStorage.getItem(HOME_STORY_KEY) ||
    "Your story goes here...";

  document.getElementById("homeFounder").innerText =
    localStorage.getItem(HOME_FOUNDER_KEY) ||
    "Founder description goes here...";
}

function editHomeStory(){
  const current = localStorage.getItem(HOME_STORY_KEY) || "";
  const text = prompt("Edit Our Story:", current);
  if(text !== null){
    localStorage.setItem(HOME_STORY_KEY,text);
    loadHomeText();
  }
}

function editHomeFounder(){
  const current = localStorage.getItem(HOME_FOUNDER_KEY) || "";
  const text = prompt("Edit Founder Section:", current);
  if(text !== null){
    localStorage.setItem(HOME_FOUNDER_KEY,text);
    loadHomeText();
  }
}

/* INIT */
loadHomeText();
renderHomeGrid();


/* ADMIN STATE */
let isAdmin = false;

/* TOGGLE DOT MENU */
function toggleAdminMenu(){
  const panel = document.getElementById("adminMenuPanel");
  panel.style.display =
    panel.style.display === "block" ? "none" : "block";
}

/* ENABLE / DISABLE ADMIN */
function enableAdmin(){
  isAdmin = true;
  document.querySelectorAll(".admin-only")
    .forEach(el => el.style.display="block");
}

function disableAdmin(){
  isAdmin = false;
  document.querySelectorAll(".admin-only")
    .forEach(el => el.style.display="none");
}


/* PARAGRAPH STORAGE */

/* LOAD PARAGRAPH */
function loadHomeStory(){
  const text =
    localStorage.getItem(HOME_STORY_KEY) ||
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";

  document.getElementById("homeStory").innerText = text;
}

/* OPEN MODAL */
function openParagraphModal(){
  const text =
    localStorage.getItem(HOME_STORY_KEY) || "";

  document.getElementById("paragraphTextarea").value = text;
  document.getElementById("paragraphModal").style.display="block";
}

/* CLOSE MODAL */
function closeParagraphModal(){
  document.getElementById("paragraphModal").style.display="none";
}

/* SAVE PARAGRAPH */
function saveParagraphModal(){
  const text =
    document.getElementById("paragraphTextarea").value;

  localStorage.setItem(HOME_STORY_KEY, text);
  loadHomeStory();
  closeParagraphModal();
}

/* INIT */
loadHomeStory();


let currentEditSection = "";

/* OPEN MODAL */
function openParagraphModal(section){
  currentEditSection = section;

  let text = "";

  if(section === "story"){
    text = localStorage.getItem("homeStoryText") || "";
  } else {
    text = localStorage.getItem("homeFounderText") || "";
  }

  document.getElementById("paragraphTextarea").value = text;
  document.getElementById("paragraphModal").style.display = "block";
}

/* CLOSE */
function closeParagraphModal(){
  document.getElementById("paragraphModal").style.display = "none";
}

/* SAVE */
function saveParagraphModal(){
  const text = document.getElementById("paragraphTextarea").value;

  if(currentEditSection === "story"){
    localStorage.setItem("homeStoryText", text);
  } else {
    localStorage.setItem("homeFounderText", text);
  }

  loadHomeText();
  closeParagraphModal();
}

/* LOAD TEXT */
function loadHomeText(){
  document.getElementById("homeStory").innerText =
    localStorage.getItem("homeStoryText") ||
    "Your story goes here...";

  document.getElementById("homeFounder").innerText =
    localStorage.getItem("homeFounderText") ||
    "Founder description goes here...";
}


function toggleAdminMenu(){
  const panel = document.getElementById("adminMenuPanel");
  panel.style.display =
    panel.style.display === "block" ? "none" : "block";
}




/* ================================
   BOTTOM IMAGE GALLERY (HOMEPAGE)
================================ */

const HOME_BOTTOM_KEY = "homeBottomImages";

/* GET */
function getBottomImages(){
  const data = localStorage.getItem(HOME_BOTTOM_KEY);
  return data ? JSON.parse(data) : [];
}

/* SAVE */
function saveBottomImages(images){
  localStorage.setItem(HOME_BOTTOM_KEY, JSON.stringify(images));
}

/* RENDER */
function renderBottomGrid(){
  const container = document.getElementById("homeBottomGallery");
  if(!container) return;

  const images = getBottomImages();
  container.innerHTML = "";

  images.forEach((src,index)=>{
    container.innerHTML += `
      <div class="bottom-item">
        <img src="${src}">
        ${
          homeAdmin
          ? `<button class="delete-bottom" onclick="deleteBottomImage(${index})">×</button>`
          : ""
        }
      </div>
    `;
  });
}

/* ADD IMAGE */
function addBottomImage(event){
  const file = event.target.files[0];
  if(!file) return;

  const reader = new FileReader();
  reader.onload = ()=>{
    const images = getBottomImages();
    images.push(reader.result);
    saveBottomImages(images);
    renderBottomGrid();
  };
  reader.readAsDataURL(file);
}

/* DELETE IMAGE */
function deleteBottomImage(index){
  const images = getBottomImages();
  images.splice(index,1);
  saveBottomImages(images);
  renderBottomGrid();
}

/* INIT */
renderBottomGrid();
renderHomeGrid();