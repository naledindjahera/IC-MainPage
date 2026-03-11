const TEAM_KEY = "aboutTeam";
const INTRO_KEY = "aboutIntro";

let aboutAdmin = false;
let currentMemberIndex = null;
let newMemberMedia = null;


/* GET DATA */

function getTeam(){
return JSON.parse(localStorage.getItem(TEAM_KEY)) || [];
}

function saveTeam(items){
localStorage.setItem(TEAM_KEY,JSON.stringify(items));
}


/* RENDER TEAM */

function renderTeam(){

const container = document.getElementById("teamContainer");
container.innerHTML = "";

const members = getTeam();

members.forEach((member,index)=>{

container.innerHTML += `

<div class="member">

<div class="photo">

${
member.type === "video"
? `<video src="${member.src}" autoplay muted loop></video>`
: `<img src="${member.src}">`
}

${
aboutAdmin
? `
<button class="delete-btn"
onclick="deleteMember(${index})">×</button>

<button class="edit-btn"
onclick="editMember(${index})">✎</button>
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

function addTeamMember(e){

const file = e.target.files[0];
if(!file) return;

const reader = new FileReader();

reader.onload = ()=>{

newMemberMedia = {
src:reader.result,
type:file.type.startsWith("video")?"video":"image"
};

currentMemberIndex=null;

document.getElementById("memberName").value="";
document.getElementById("memberText").value="";

document.getElementById("teamModal").style.display="block";

};

reader.readAsDataURL(file);

}


/* EDIT MEMBER */

function editMember(index){


const members = getTeam();

currentMemberIndex = index;

document.getElementById("memberName").value =
members[index].name;

document.getElementById("memberText").value =
members[index].text;

newMemberMedia = {
src: members[index].src,
type: members[index].type
};

document.getElementById("teamModal").style.display = "block";

}

/* SAVE */

function saveTeamMember(){

const name = document.getElementById("memberName").value;
const text = document.getElementById("memberText").value;

const members = getTeam();

if(currentMemberIndex === null){

members.push({
src: newMemberMedia.src,
type: newMemberMedia.type,
name,
text
});

}else{

members[currentMemberIndex].name = name;
members[currentMemberIndex].text = text;

if(newMemberMedia){
members[currentMemberIndex].src = newMemberMedia.src;
members[currentMemberIndex].type = newMemberMedia.type;
}

}

saveTeam(members);
renderTeam();
closeTeamModal();

document.querySelector('#aboutAdminPanel input[type="file"]').value = "";

}


function replaceTeamMedia(e){

const file = e.target.files[0];
if(!file) return;

const reader = new FileReader();

reader.onload = ()=>{

newMemberMedia = {
src: reader.result,
type: file.type.startsWith("video") ? "video" : "image"
};

};

reader.readAsDataURL(file);

}


/* DELETE */

function deleteMember(index){

const members=getTeam();

members.splice(index,1);

saveTeam(members);

renderTeam();

}


/* MODAL CLOSE */

function closeTeamModal(){
document.getElementById("teamModal").style.display="none";
}


/* INTRO */

function openIntroEditor(){

const text =
localStorage.getItem(INTRO_KEY) || "";

document.getElementById("introInput").value=text;

document.getElementById("introModal").style.display="block";

}

function closeIntroModal(){
document.getElementById("introModal").style.display="none";
}

function saveIntro(){

const text =
document.getElementById("introInput").value;

localStorage.setItem(INTRO_KEY,text);

loadIntro();

closeIntroModal();

}

function loadIntro(){

document.querySelector(".intro p").innerText =
localStorage.getItem(INTRO_KEY) ||
"Write about the business here.";

}




/* ADMIN */

function enableAdmin(){

aboutAdmin = true;

document.getElementById("aboutAdminPanel").style.display = "flex";

renderTeam();

}

function disableAdmin(){

aboutAdmin = false;

document.getElementById("aboutAdminPanel").style.display = "none";

renderTeam();

}


/* MENU */

function toggleAdminMenu(){

const panel=document.getElementById("adminMenuPanel");

panel.style.display =
panel.style.display==="block" ? "none":"block";

}

function openAddMemberModal(){

currentMemberIndex = null;
newMemberMedia = null;

document.getElementById("memberName").value = "";
document.getElementById("memberText").value = "";

document.getElementById("teamModal").style.display = "block";

}


/* INIT */

renderTeam();
loadIntro(); 