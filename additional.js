var imageArea = document.getElementById("imageArea");
var newDIV, oldDIV, newImage, newURL, curURL, divList;

function addImage() {
    var name = document.getElementById("textArea").value;
    if(name === null || name.trim() === "") return;
    oldDIV = newDIV;
    newDIV = document.createElement("div");
    newURL = document.createElement("a");
    newImage = document.createElement("img");
    curURL = "http://api.skype.com/users/" + name.trim() + "/profile/avatar";
    newURL.href = curURL;
    newURL.target = "_blank";
    newImage.src = curURL;
    newImage.height = "96";
    newImage.width = "96";
    newURL.appendChild(newImage);
    newURL.innerHTML += "<br>" + name;
    newDIV.appendChild(newURL);
    divList = imageArea.getElementsByTagName("div");
    if(divList.length > 83) divList[divList.length - 1].remove();
    //imageArea.appendChild(newDIV);
    imageArea.insertBefore(newDIV, oldDIV);
}
