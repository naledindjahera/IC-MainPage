const SUPABASE_URL = "https://lfxaxlaifgempwcvwbkb.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmeGF4bGFpZmdlbXB3Y3Z3YmtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5NDEyODYsImV4cCI6MjA4OTUxNzI4Nn0.9OdazsuuO3SK6f1bjrRRJijMGzsOVhG0Dg7Cc_Id1aE";

console.log("about.js loaded");

let supabase = null;
if (window.supabase) {
  supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
} else {
  console.error("Supabase library not loaded. Admin features may not work.");
}

let aboutAdmin = false;
let currentMemberIndex = null;
let newMemberMedia = null;


/* GET TEAM DATA */
async function getTeam(){
  if (!supabase) return [];
  const { data, error } = await supabase.from("team").select("*");
  if(error){ console.error(error); return []; }
  return data;
}


/* RENDER TEAM */
async function renderTeam(){
  const container = document.getElementById("teamContainer");
  container.innerHTML = "";
  const members = await getTeam();

  members.forEach((member, index) => {
    container.innerHTML += `
      <div class="member">
        <div class="photo">
          ${member.type === "video"
            ? `<video src="${member.src}" autoplay muted loop></video>`
            : `<img src="${member.src}">`
          }
${aboutAdmin
  ? `
    <button class="delete-btn" onclick="deleteMember('${member.id}')">×</button>
    <button class="edit-btn" onclick="editMember('${member.id}','${member.name.replace(/'/g, '\\\'')}','${member.text.replace(/'/g, '\\\'')}','${member.src}','${member.type}')">✎</button>
  `
  : ""
}
        </div>
        <div class="member-text">
          <h3>${member.name}</h3>
          <p>${member.text}</p>
        </div>
      </div>
    `;
  });
}


/* ADD MEMBER */
async function addTeamMember(e){
  if (!supabase) { alert("Supabase not available"); return; }
  const file = e.target.files[0];
  if(!file) return;

  const fileName = Date.now() + "_" + file.name;

  const { data, error } = await supabase.storage
    .from("team-media")
    .upload(fileName, file);

  if(error){ alert("Upload failed"); console.error(error); return; }

  const { data: publicUrlData } = supabase.storage
    .from("team-media")
    .getPublicUrl(fileName);

  newMemberMedia = {
    src: publicUrlData.publicUrl,
    type: file.type.startsWith("video") ? "video" : "image"
  };

  document.getElementById("teamModal").style.display = "block";
}

function editMember(id, name, text, src, type){

  currentMemberIndex = id;

  document.getElementById("memberName").value = name;
  document.getElementById("memberText").value = text;

  newMemberMedia = { src, type };

  document.getElementById("teamModal").style.display = "block";
}

/* SAVE MEMBER */
async function saveTeamMember(){

  if (!supabase) { alert("Supabase not available"); return; }

  const name = document.getElementById("memberName").value;
  const text = document.getElementById("memberText").value;

  if(!name || !text || !newMemberMedia){
    alert("Please add media, name and text");
    return;
  }

  // 👉 EDIT MODE
  if(currentMemberIndex){

    await supabase
      .from("team")
      .update({
        name,
        text,
        src: newMemberMedia.src,
        type: newMemberMedia.type
      })
      .eq("id", currentMemberIndex);

  } 
  // 👉 ADD MODE
  else {

    await supabase
      .from("team")
      .insert([{
        src: newMemberMedia.src,
        type: newMemberMedia.type,
        name,
        text
      }]);
  }

  currentMemberIndex = null;

  renderTeam();
  closeTeamModal();
}

/* DELETE MEMBER */
async function deleteMember(id){
  if (!supabase) { alert("Supabase not available"); return; }
  if(!confirm("Delete this member?")) return;
  await supabase.from("team").delete().eq("id", id);
  renderTeam();
}


/* MODAL CLOSE */
function closeTeamModal(){
  document.getElementById("teamModal").style.display = "none";
  currentMemberIndex = null;
}

function selectMedia(e){
  const file = e.target.files[0];
  if(!file) return;

  newMemberMedia = {
    src: URL.createObjectURL(file),
    type: file.type.startsWith("video") ? "video" : "image"
  };
} 

/* ADMIN ENABLE */
function enableAdmin(){
  aboutAdmin = true;
  localStorage.setItem("isAdmin", "true");
  document.getElementById("aboutAdminPanel").style.display = "flex";
  alert("Admin mode enabled 🔥");
  renderTeam();
  
}

/* ADMIN DISABLE */                         // ✅ Fixed: was "wwindow"
function disableAdmin(){
  aboutAdmin = false;
  localStorage.removeItem("isAdmin");
  document.getElementById("aboutAdminPanel").style.display = "none";
  renderTeam();
}


/* MENU */
function toggleAdminMenu(){
  const panel = document.getElementById("adminMenuPanel");
  panel.style.display = panel.style.display === "block"
    ? "none"
    : "block";
}



function openAddMemberModal(){

  currentMemberIndex = null; // 🔥 important
  newMemberMedia = null;

  document.getElementById("memberName").value = "";
  document.getElementById("memberText").value = "";

  document.getElementById("teamModal").style.display = "block";
}


/* INTRO */
async function loadIntro(){
  if (!supabase) return;
  const { data, error } = await supabase.from("about").select("*").single();
  if(data){
    document.getElementById("aboutIntroText").innerHTML = `<p>${data.text}</p>`;
  }
}

async function saveIntro(){
  if (!supabase) { alert("Supabase not available"); return; }
  const text = document.getElementById("introInput").value;
  const { data } = await supabase.from("about").select("*");

  if(data.length === 0){
    await supabase.from("about").insert([{ text }]);
  } else {
    await supabase.from("about").update({ text }).eq("id", data[0].id);
  }

  document.getElementById("aboutIntroText").innerHTML = `<p>${text}</p>`;
  closeIntroModal();
}

function openIntroEditor(){
  const currentText = document.getElementById("aboutIntroText").innerText;
  document.getElementById("introInput").value = currentText;
  document.getElementById("introModal").style.display = "block";
}

function closeIntroModal(){
  document.getElementById("introModal").style.display = "none";
}




/* INIT */
(async () => {
  if(localStorage.getItem("isAdmin") === "true"){
    enableAdmin();
  }
  await renderTeam();
  await loadIntro();
})();