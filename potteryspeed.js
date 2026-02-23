const MEDIA_KEY="speedMedia";
const TEXT_KEY="speedText";
const FORM_KEY="speedForm";

let isAdmin=false;

/* MEDIA */
function getMedia(){
  return JSON.parse(localStorage.getItem(MEDIA_KEY))||[];
}

function saveMedia(data){
  localStorage.setItem(MEDIA_KEY,JSON.stringify(data));
}

function renderMedia(){
  const box=document.getElementById("speedMedia");
  box.innerHTML="";
  getMedia().forEach(item=>{
    box.innerHTML+=`
    <div class="media-box">
      ${item.type==="image"
        ?`<img src="${item.src}">`
        :`<video src="${item.src}" controls loop muted></video>`
      }
    </div>`;
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
 document.getElementById("formInput").value=
 localStorage.getItem(FORM_KEY)||"";
 document.getElementById("formModal").style.display="block";
}

function closeFormModal(){
 document.getElementById("formModal").style.display="none";
}

function saveForm(){
 localStorage.setItem(FORM_KEY,
 document.getElementById("formInput").value);
 closeFormModal();
}

function openSpeedFormLink(){
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
}

function disableAdmin(){
 isAdmin=false;
 document.getElementById("speedAdminPanel").style.display="none";
}

function toggleAdminMenu(){
 const p=document.getElementById("adminMenuPanel");
 p.style.display=p.style.display==="block"?"none":"block";
}

/* INIT */
renderMedia();
loadParagraph();