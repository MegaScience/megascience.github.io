var imageArea = document.getElementById("imageArea");
var newDIV, newImage, newURL, curURL, divList;

function addImage() {
    var name = document.getElementById("textArea").value;
    if(name === null || name.trim() === "") return;
    newDIV = document.createElement("div");
    newURL = document.createElement("a");
    newImage = document.createElement("img");
    curURL = "http://api.skype.com/users/" + name.trim() + "/profile/avatar";
    newURL.href = curURL;
    newImage.src = curURL;
    newImage.height = "96px";
    newImage.width = "96px";
    newURL.appendChild(newImage);
    newDIV.appendChild(newURL);
    newDIV.innerHTML += "<br>" + name;
    divList = imageArea.getElementsByTagName("div");
    if(divList.length > 53) divList[divList.length - 1].remove();
    imageArea.appendChild(newDIV);
}
