/* STORAGE KEYS */
const TOP_MEDIA_KEY = "urTopMedia";
const BOTTOM_MEDIA_KEY = "urBottomMedia";
const STORY_KEY = "urStory";

/* ADMIN */
let isAdmin = false;

/* TOGGLE ADMIN */
function enableAdmin(){
  isAdmin = true;
  document.getElementById("urAdminPanel").style.display="flex";
  renderTopMedia();
  renderBottomGallery();
}

function disableAdmin(){
  isAdmin = false;
  document.getElementById("urAdminPanel").style.display="none";
  renderTopMedia();
  renderBottomGallery();
}

/* ADMIN DOTS */
function toggleAdminMenu(){
  const panel = document.getElementById("adminMenuPanel");
  panel.style.display =
    panel.style.display === "block" ? "none" : "block";
}

/* ---------- TOP MEDIA ---------- */

function getTopMedia(){
  return JSON.parse(localStorage.getItem(TOP_MEDIA_KEY)) || [];
}

function saveTopMedia(items){
  localStorage.setItem(TOP_MEDIA_KEY, JSON.stringify(items));
}

function renderTopMedia(){
  const grid = document.getElementById("topMediaGrid");
  const items = getTopMedia();
  grid.innerHTML="";

  items.forEach((item,i)=>{
    grid.innerHTML+=`
      <div class="media-item ${i===0?"big":""}">
        ${
          item.type==="image"
          ? `<img src="${item.src}">`
          : `<video src="${item.src}" autoplay loop muted></video>`
        }
        ${isAdmin?`<button class="delete-btn" onclick="deleteTopMedia(${i})">×</button>`:""}
      </div>
    `;
  });
}

function addTopImage(e){
  const file=e.target.files[0];
  if(!file) return;

  const reader=new FileReader();
  reader.onload=()=>{
    const media=getTopMedia();
    media.push({type:"image",src:reader.result});
    saveTopMedia(media);
    renderTopMedia();
  };
  reader.readAsDataURL(file);
}

function addSlideshow(e){
  const file=e.target.files[0];
  if(!file) return;

  const reader=new FileReader();
  reader.onload=()=>{
    const media=getTopMedia();
    media.push({type:"video",src:reader.result});
    saveTopMedia(media);
    renderTopMedia();
  };
  reader.readAsDataURL(file);
}

function deleteTopMedia(i){
  const media=getTopMedia();
  media.splice(i,1);
  saveTopMedia(media);
  renderTopMedia();
}

/* ---------- STORY ---------- */

function loadStory(){
  document.getElementById("urStory").innerText=
    localStorage.getItem(STORY_KEY) ||
    "Tell your pottery story here...";
}

function openStoryEditor(){
  document.getElementById("storyTextarea").value =
    localStorage.getItem(STORY_KEY) || "";
  document.getElementById("storyModal").style.display="block";
}

function closeStoryEditor(){
  document.getElementById("storyModal").style.display="none";
}

function saveStory(){
  const text=document.getElementById("storyTextarea").value;
  localStorage.setItem(STORY_KEY,text);
  loadStory();
  closeStoryEditor();
}

/* ---------- BOTTOM GALLERY ---------- */

function getBottomMedia(){
  return JSON.parse(localStorage.getItem(BOTTOM_MEDIA_KEY)) || [];
}

function saveBottomMedia(items){
  localStorage.setItem(BOTTOM_MEDIA_KEY, JSON.stringify(items));
}

function renderBottomGallery(){
  const grid=document.getElementById("bottomGallery");
  const items=getBottomMedia();
  grid.innerHTML="";

  items.slice(0,14).forEach((src,i)=>{
    grid.innerHTML+=`
      <div class="media-item">
        <img src="${src}">
        ${isAdmin?`<button class="delete-btn" onclick="deleteBottomImage(${i})">×</button>`:""}
      </div>
    `;
  });
}

function addBottomImage(e){
  const file=e.target.files[0];
  if(!file) return;

  const reader=new FileReader();
  reader.onload=()=>{
    const items=getBottomMedia();
    if(items.length>=14){
      alert("Maximum 14 images");
      return;
    }
    items.push(reader.result);
    saveBottomMedia(items);
    renderBottomGallery();
  };
  reader.readAsDataURL(file);
}

function deleteBottomImage(i){
  const items=getBottomMedia();
  items.splice(i,1);
  saveBottomMedia(items);
  renderBottomGallery();
}

/* INIT */
loadStory();
renderTopMedia();
renderBottomGallery();
