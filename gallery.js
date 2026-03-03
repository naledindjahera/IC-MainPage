const GALLERY_KEY = "galleryItems";
let galleryAdmin = false;

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
            ? `<button class="delete-btn" onclick="deleteGalleryItem(${index})">×</button>`
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

  const title = prompt("Enter heading:");
  if(!title) return;

  const text = prompt("Enter description:");
  if(!text) return;

  const reader = new FileReader();
  reader.onload = ()=>{
    const items = getGalleryItems();
    items.push({
      image: reader.result,
      title,
      text
    });
    saveGalleryItems(items);
    renderGallery();
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

/* ADMIN */
function enableGalleryAdmin(){
  galleryAdmin = true;
  document.getElementById("galleryAdminPanel").style.display="flex";
  renderGallery();
}

function disableGalleryAdmin(){
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

/* INIT */
renderGallery();