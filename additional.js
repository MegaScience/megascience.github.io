var name = document.getElementById("textArea");
var imageArea = document.getElementById("imageArea");
var newElement, newImage, imageAreaDivs;

function addImage() {
    if(name.value === null || name.value.trim() === "") return;
    newElement = document.createElement("div");
    newImage = document.createElement("img");
    newImage.src = "http://api.skype.com/users/" + name.value.trim() + "/profile/avatar";
    newElement.appendChild(newImage);
    newElement.innerHTML += "<br>" + name.value;
    imageAreaDivs = imageArea.getElementsByTagName("div");
    if(imageAreaDivs.length > 24) imageAreaDivs.last().remove();
    imageArea.appendChild(newElement);
}
