const EVENTS_API = "http://localhost:3000/couples-events"
const MEDIA_API = "http://localhost:3000/couples-media"
const PARAGRAPH_API = "http://localhost:3000/couples-paragraph"

// FUNCTIONS
function openPotteryWineForm(){
  window.open(potteryWineForm, "_blank");
}

function openCouplesForm(){
  window.open(couplesForm, "_blank");
}

function openSpeedDatingForm(){
  window.open(speedDatingForm, "_blank");
}


function openEditEvents(){
  document.getElementById("editEventsModal").style.display = "block";
  document.querySelector(".admin-panel").style.display = "none";
  renderAdminEvents();
}


function closeEditEvents(){
  document.getElementById("editEventsModal").style.display = "none";

  if(isAdmin){
    document.querySelector(".admin-panel").style.display = "flex";
  }
}

const PRIVATE_KEY = "privateBooking";

function getPrivate(){
  const data = localStorage.getItem(PRIVATE_KEY);
  return data ? JSON.parse(data) : {
    link:"",
    available:true
  };
}

function savePrivate(obj){
  localStorage.setItem(PRIVATE_KEY, JSON.stringify(obj));
}



// STORAGE KEY
const STORAGE_KEY = "couplesEvents";

// DEFAULT EVENTS
const defaultEvents = [
  {
    date: "14 March 2026",
    time: "18h00",
    venue: "The Pottery Studio",
    price: "N$450",
    formLink: "PASTE_FORM_LINK_HERE",
    soldOut: true,
    closed: true
  },
  {
    date: "02 April 2026",
    time: "18h00",
    venue: "The Pottery Studio",
    price: "N$450",
    formLink: "PASTE_FORM_LINK_HERE",
    soldOut: false,
    closed: false
  },
  {
    date: "28 April 2026",
    time: "18h00",
    venue: "The Pottery Studio",
    price: "N$450",
    formLink: "PASTE_FORM_LINK_HERE",
    soldOut: false,
    closed: false
  }
];


async function getEvents(){

 const res = await fetch(EVENTS_API)
 const data = await res.json()

 return data

}

function saveEvents(events){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}



async function renderEvents(){

 const container = document.getElementById("eventsContainer");
 container.innerHTML = "";

 const events = await getEvents();

 events.forEach((event,index)=>{
    container.innerHTML += `
      <div class="event">
        <div class="dates">
          <h4>${event.date} <span>• ${event.price} per person</span></h4>
          <p>Time: ${event.time} • Venue: ${event.venue}</p>
        </div>

        <div class="slot ${event.soldOut ? "sold" : "available"}"></div>
        <div class="slot ${event.closed ? "sold" : "available"}"></div>

${
  event.soldOut || event.closed
  ? `<button class="book-btn" disabled style="opacity:0.5">Unavailable</button>`
  : `<button class="book-btn" onclick="window.open('${event.formLink}','_blank')">
  Book Now
</button>
`
}      </div>
    `;
  });
}


// INITIALIZE STORAGE FIRST TIME
if(!localStorage.getItem(STORAGE_KEY)){
  saveEvents(defaultEvents);
}

renderEvents();



function renderPrivateEvent(){
  const container = document.getElementById("privateEventContainer");
  const data = getPrivate();

  container.innerHTML = `
    <div class="private">

      <h3>Want a Private Event?</h3>

      ${
        data.available
        ? `<button class="book-btn" onclick="window.open('${data.link}','_blank')">
            Book Private Event
           </button>`
        : `<button class="book-btn" disabled style="opacity:0.5">
            Private Booking Unavailable
           </button>`
      }

    </div>
  `;
}


renderPrivateEvent();



async function renderAdminEvents(){

 const container = document.getElementById("adminEventsContainer");

 const events = await getEvents();

 container.innerHTML = "";

 events.forEach((event,index)=>{

   container.innerHTML +=  `
      <div class="event-edit">

        <p>${event.date}</p>

        <label>
          <input type="checkbox"
            ${event.soldOut ? "checked" : ""}
            onchange="toggleSoldOut(${index})">
          Sold Out
        </label>

        <label>
          <input type="checkbox"
            ${event.closed ? "checked" : ""}
            onchange="toggleClosed(${index})">
          Booking Closed
        </label>

        <button class="admin-btn" onclick="deleteEvent(${index})">
          Delete
        </button>

      </div>
    `;
  });
}


function toggleSoldOut(index){
  const events = getEvents();
  events[index].soldOut = !events[index].soldOut;
  saveEvents(events);
  renderEvents();
  renderAdminEvents();
}

function toggleClosed(index){
  const events = getEvents();
  events[index].closed = !events[index].closed;
  saveEvents(events);
  renderEvents();
  renderAdminEvents();
}






function deleteEvent(index){
  const events = getEvents();

  if(!confirm("Delete this event?")) return;

  events.splice(index,1);
  saveEvents(events);

  renderEvents();
  renderAdminEvents();
}



// TEMP ADMIN MODE (true = admin, false = client)
let isAdmin = false;

function enableAdmin(){
  isAdmin = true;
  document.querySelector(".admin-panel").style.display = "flex";
  renderMedia();   // refresh media with delete buttons
}

function disableAdmin(){
  isAdmin = false;
  document.querySelector(".admin-panel").style.display = "none";
  renderMedia();   // hide delete buttons
}


// PARAGRAPH STORAGE
const PARAGRAPH_KEY = "couplesParagraph";

async function loadParagraph(){

 const res = await fetch(PARAGRAPH_API)
 const data = await res.json()

 if(data && data.text){
  document.getElementById("storyParagraph").innerText = data.text
 }

}

async function saveParagraphModal(){

 const text = document.getElementById("paragraphTextarea").value

 if(!text.trim()){
  alert("Paragraph cannot be empty")
  return
 }

 await fetch(PARAGRAPH_API,{
  method:"POST",
  headers:{
   "Content-Type":"application/json"
  },
  body:JSON.stringify({text})
 })

 loadParagraph()
 closeParagraphModal()

}

function openParagraphEditor(){
  const text = localStorage.getItem(PARAGRAPH_KEY) || "";
  document.getElementById("paragraphTextarea").value = text;
  document.getElementById("paragraphModal").style.display = "block";
}

function closeParagraphModal(){
  document.getElementById("paragraphModal").style.display = "none";
}



loadParagraph();



const MEDIA_KEY = "couplesMedia";

async function getMedia(){

 const res = await fetch(MEDIA_API)
 const data = await res.json()

 return data

}

function saveMedia(items){
  localStorage.setItem(MEDIA_KEY, JSON.stringify(items));
}

async function renderMedia(){
  const container = document.getElementById("mediaGrid");
  if(!container) return;

const items = await getMedia();
  container.innerHTML = "";

  items.forEach((item,index)=>{

    container.innerHTML += `
      <div class="media-item ${index === 0 ? "big" : ""}">

        ${
          item.type === "image"
          ? `<img src="${item.src}">`
          : `<video src="${item.src}" autoplay loop muted playsinline></video>`
        }

        ${
          isAdmin
          ? `
          <button class="delete-media" onclick="deleteMedia(${index})">×</button>

          <label class="edit-media">
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


/* IMAGE */
await fetch(MEDIA_API,{
 method:"POST",
 headers:{
  "Content-Type":"application/json"
 },
 body:JSON.stringify({
  type:"image",
  src:reader.result
 })
})

/* VIDEO */
async function addVideo(){
  const file = document.getElementById("videoFile").files[0];
  if(!file) return;

  const reader = new FileReader();
  reader.onload = () => {
   const media = await getMedia();
    media.push({type:"video", src:reader.result});
    saveMedia(media);
    renderMedia();
  };
  reader.readAsDataURL(file);
}




function deleteMedia(index){
  const media = getMedia();
  
  if(!confirm("Delete this media?")) return;
  
  media.splice(index, 1);
  saveMedia(media);
  renderMedia();
}


window.onload = function(){
  renderMedia();
};


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

function savePrivateBooking(){
  const link = document.getElementById("privateLink").value;
  const available = document.getElementById("privateAvailable").checked;

  savePrivate({
    link,
    available
  });

  renderPrivateEvent();
  alert("Private booking updated!");
}



function toggleAdminMenu(){
  const panel = document.getElementById("adminMenuPanel");
  panel.style.display = panel.style.display === "block"
    ? "none"
    : "block";
}
