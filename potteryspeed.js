const MEDIA_KEY="speedMedia";
const TEXT_KEY="speedText";
const FORM_KEY="speedForm";
const STATUS_KEY="speedRegistrationStatus";


let isAdmin=false;

/* MEDIA */
function getMedia(){
  return JSON.parse(localStorage.getItem(MEDIA_KEY))||[];
}

function saveMedia(data){
  localStorage.setItem(MEDIA_KEY,JSON.stringify(data));
}

function renderMedia(){
  const container = document.getElementById("speedMedia");
  container.innerHTML = "";

  const items = getMedia();

  items.forEach((item,index)=>{

    container.innerHTML += `
      <div class="media-item">

        ${
          item.type === "image"
          ? `<img src="${item.src}">`
          : `<video src="${item.src}" autoplay loop muted playsinline></video>`
        }

        ${
          isAdmin
          ? `
          <button class="delete-btn" onclick="deleteMedia(${index})">×</button>

          <label class="edit-btn">
            ✎
            <input type="file" hidden 
              accept="${item.type === "image" ? "image/*" : "video/*"}"
              onchange="replaceMedia(event, ${index})">
          </label>
          `
          : ""
        }

      </div>
    `;
  });
}


function addSpeedImage(e){
  const file=e.target.files[0];
  const reader=new FileReader();
  reader.onload=()=>{
    const m=getMedia();
    m.push({type:"image",src:reader.result});
    saveMedia(m);
    renderMedia();
  };
  reader.readAsDataURL(file);
}

function addSpeedVideo(e){
  const file=e.target.files[0];
  const reader=new FileReader();
  reader.onload=()=>{
    const m=getMedia();
    m.push({type:"video",src:reader.result});
    saveMedia(m);
    renderMedia();
  };
  reader.readAsDataURL(file);
}

/* PARAGRAPH */
function loadParagraph(){
 document.getElementById("speedParagraph").innerText=
 localStorage.getItem(TEXT_KEY)||"Your speeddating story goes here...";
}

function openParagraphModal(){
 document.getElementById("paragraphInput").value=
 localStorage.getItem(TEXT_KEY)||"";
 document.getElementById("paragraphModal").style.display="block";
}

function closeParagraphModal(){
 document.getElementById("paragraphModal").style.display="none";
}

function saveParagraph(){
 localStorage.setItem(TEXT_KEY,
 document.getElementById("paragraphInput").value);
 loadParagraph();
 closeParagraphModal();
}

/* FORM */
function openFormModal(){

  hideAdminPanel();

  document.getElementById("formInput").value =
    localStorage.getItem(FORM_KEY) || "";

  const status = localStorage.getItem(STATUS_KEY) || "open";

  document.getElementById("registrationToggle").checked =
    status === "closed";

  document.getElementById("formModal").style.display = "block";
}

function closeFormModal(){

  document.getElementById("formModal").style.display = "none";

  showAdminPanel();
}

function saveForm(){

  const link = document.getElementById("formInput").value;
  const isClosed = document.getElementById("registrationToggle").checked;

  localStorage.setItem(FORM_KEY, link);
  localStorage.setItem(STATUS_KEY, isClosed ? "closed" : "open");

  updateRegisterButton();

  closeFormModal();
}

function openSpeedFormLink(){
  const status=localStorage.getItem(STATUS_KEY)||"open";

  if(status==="closed"){
    alert("Registration is currently closed.");
    return;
  }

  const link=localStorage.getItem(FORM_KEY);

  if(!link){
    alert("Form coming soon!");
    return;
  }

  window.open(link,"_blank");
}

/* ADMIN */
function enableAdmin(){
 isAdmin=true;
 document.getElementById("speedAdminPanel").style.display="flex";
 renderMedia();
}

function disableAdmin(){
 isAdmin=false;
 document.getElementById("speedAdminPanel").style.display="none";
 renderMedia();
}

function toggleAdminMenu(){
 const p=document.getElementById("adminMenuPanel");
 p.style.display=p.style.display==="block"?"none":"block";
}



function updateRegisterButton(){
  const button=document.querySelector(".join button");
  const status=localStorage.getItem(STATUS_KEY)||"open";

  if(status==="closed"){
    button.innerText="Unavailable";
    button.disabled=true;
    button.style.background="#D79F90";
    button.style.cursor="not-allowed";
  }else{
    button.innerText="Register Now";
    button.disabled=false;
    button.style.background="#8E1913";
    button.style.cursor="pointer";
  }
}


function deleteMedia(index){

  const media = getMedia();

  media.splice(index,1);

  saveMedia(media);
  renderMedia();
}

function replaceMedia(e,index){

  const file = e.target.files[0];
  if(!file) return;

  const reader = new FileReader();

  reader.onload = ()=>{

    const media = getMedia();

    media[index] = {
      type: file.type.startsWith("video") ? "video" : "image",
      src: reader.result
    };

    saveMedia(media);
    renderMedia();
  };

  reader.readAsDataURL(file);
}

renderMedia();
loadParagraph();
updateRegisterButton();