const GALLERY_KEY = "galleryItems";
let galleryAdmin = false;
let currentEditIndex = null;
let newImageData = null;

/* GET DATA */
function getGalleryItems(){
  return JSON.parse(localStorage.getItem(GALLERY_KEY)) || [];
}

/* SAVE */
function saveGalleryItems(items){
  localStorage.setItem(GALLERY_KEY, JSON.stringify(items));
}

/* RENDER */
function renderGallery(){
  const container = document.getElementById("galleryContainer");
  container.innerHTML = "";

  const items = getGalleryItems();

  items.forEach((item,index)=>{

    container.innerHTML += `
      <div class="gallery-item ${index % 2 ? "reverse" : ""}">
        
        <div class="image-box">
          <img src="${item.image}">

          ${
            galleryAdmin
            ? `
              <button class="delete-btn" onclick="deleteGalleryItem(${index})">×</button>
              <button class="edit-btn" onclick="editGalleryText(${index})">✎</button>
            `
            : ""
          }

        </div>

        <div class="text-box">
          <h3>${item.title}</h3>
          <p>${item.text}</p>
        </div>

      </div>
    `;
  });
}

/* ADD ITEM */
function addGalleryItem(e){

  const file = e.target.files[0];
  if(!file) return;

  const reader = new FileReader();

  reader.onload = ()=>{

    newImageData = reader.result;
    currentEditIndex = null;

    document.getElementById("editTitleInput").value = "";
    document.getElementById("editTextInput").value = "";

    document.getElementById("editGalleryModal").style.display = "block";

  };

  reader.readAsDataURL(file);
}

/* DELETE */
function deleteGalleryItem(index){
  const items = getGalleryItems();
  items.splice(index,1);
  saveGalleryItems(items);
  renderGallery();
}


function editGalleryText(index){

  const items = getGalleryItems();

  currentEditIndex = index;

  document.getElementById("editTitleInput").value =
    items[index].title;

  document.getElementById("editTextInput").value =
    items[index].text;

  document.getElementById("editGalleryModal").style.display = "block";

}

/* ADMIN */
function enableAdmin(){
  galleryAdmin = true;
  document.getElementById("galleryAdminPanel").style.display="flex";
  renderGallery();
}

function disableAdmin(){
  galleryAdmin = false;
  document.getElementById("galleryAdminPanel").style.display="none";
  renderGallery();
}

/* DOT MENU */
function toggleAdminMenu(){
  const panel = document.getElementById("adminMenuPanel");
  panel.style.display =
    panel.style.display === "block" ? "none" : "block";
}


function closeGalleryEdit(){
  document.getElementById("editGalleryModal").style.display = "none";
}

function saveGalleryEdit(){

  const title = document.getElementById("editTitleInput").value;
  const text = document.getElementById("editTextInput").value;

  const items = getGalleryItems();

  if(currentEditIndex === null){

    items.push({
      image: newImageData,
      title,
      text
    });

  }else{

    items[currentEditIndex].title = title;
    items[currentEditIndex].text = text;

  }

  saveGalleryItems(items);

  renderGallery();

  closeGalleryEdit();

}

function replaceGalleryImage(e){

const file = e.target.files[0];
if(!file) return;

const reader = new FileReader();

reader.onload = ()=>{
newImageData = reader.result;
};

reader.readAsDataURL(file);

}

/* INIT */
renderGallery();