var name = document.getElementById("textArea");
var imageArea = document.getElementById("imageArea");
var newElement, newImage, imageAreaDivs, nameString;

function addImage() {
    nameString = name.value;
    if(nameString === null || nameString.trim() === "") return;
    newElement = document.createElement("div");
    newImage = document.createElement("img");
    newImage.src = "http://api.skype.com/users/" + nameString.trim() + "/profile/avatar";
    newElement.appendChild(newImage);
    newElement.innerHTML += "<br>" + nameString;
    imageAreaDivs = imageArea.getElementsByTagName("div");
    if(imageAreaDivs.length > 24) imageAreaDivs.last().remove();
    imageArea.appendChild(newElement);
}
