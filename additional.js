var imageArea = document.getElementById("imageArea");
var newElement, newImage, imageAreaDivs;

function addImage() {
    var name = document.getElementById("textArea").value;
    if(name === null || name.trim() === "") return;
    newElement = document.createElement("div");
    newImage = document.createElement("img");
    newImage.src = "http://api.skype.com/users/" + name.trim() + "/profile/avatar";
    newElement.appendChild(newImage);
    newElement.innerHTML += "<br>" + name;
    imageAreaDivs = imageArea.getElementsByTagName("div");
    if(imageAreaDivs.length > 24) imageAreaDivs.last().remove();
    imageArea.appendChild(newElement);
}
