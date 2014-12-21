var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var stopState = 0;
var debug = 1;
var done = false;
var playerSettings = function (videoID, time, volume, mute) {
    this.videoID = videoID || "qeMFqkcPYcg";
    this.time = time || 0;
    this.volume = volume || 100;
    this.mute = mute || 0;
};
//var def = new playerSettings();
var init = [];
init.push(new playerSettings("qeMFqkcPYcg", 1));
init.push(new playerSettings("g1AJdg3zxlw"));
var settings = [];
settings.push(new playerSettings("qeMFqkcPYcg", 1));
settings.push(new playerSettings("g1AJdg3zxlw"));
var player = [];
var elements = {
    playPause: {
        text: document.getElementById("playPause"),
        icon: document.getElementById("playPauseIcon")
    },
    doubler: document.getElementById("doubler"),
    perma: document.getElementById("perma"),
    title: document.getElementById("title"),
    player: []
};
var playerElements = function (i) {
    this.videoID = document.getElementById("video" + i);
    this.volume = document.getElementById("volume" + i);
    this.mute = {
        text: document.getElementById("mute" + i),
        icon: document.getElementById("muteIcon" + i)
    };
    this.time = {
        h: document.getElementById("timeHours" + i),
        m: document.getElementById("timeMinutes" + i),
        s: document.getElementById("timeSeconds" + i)
    };
};
var playerEvents = {
    'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange,
        'onError': onPlayerError
};
var titles = {};
document.getElementById("lastModified").innerHTML += " " + document.lastModified;
window.addEventListener("hashchange", updateVideo, false);

function onYouTubeIframeAPIReady() {
    if (debug) debugInfo("Website - " + window.location.href);
    var tempParam = paramArray(window.location.href);
    if (debug) debugInfo("Parameters (Object) - " + tempParam);
    for (var i = 0; i < settings.length; i++) {
        //if (debug) debugInfo("Players? " + i);
        elements.player[i] = new playerElements(i);
        if (tempParam) {
            if (('video' + i) in tempParam) settings[i].videoID = tempParam['video' + i];
            if (('start' + i) in tempParam) settings[i].time = Number(tempParam['start' + i]);
            if (('volume' + i) in tempParam) settings[i].volume = Number(tempParam['volume' + i]);
            if (('mute' + i) in tempParam) settings[i].mute = Number(tempParam['mute' + i]);
        }
        player.push(new YT.Player('player' + i, {
            height: '100%',
            width: '100%',
            videoId: settings[i].videoID,
            playerVars: {
                'start': settings[i].time,
                    'controls': 0,
                    'showinfo': 0,
                    'rel': 0,
                    'modestbranding': 1,
                    'theme': "light"
            },
            events: playerEvents
        }));
        player[i].num = i;
        elements.player[i].videoID.value = settings[i].videoID;
        elements.player[i].volume.value = settings[i].volume;
        //time[i].value = settings[i].time;
        sToHMS(settings[i].time, i);
    }
    writePerma(1);
}

function onPlayerReady(event) {
    event.target.setVolume(settings[event.target.num].volume);
    if (settings[event.target.num].mute) toggleMute(event.target.num, 1);
    //event.target.playVideo();
    titles[event.target.num] = event.target.getVideoData().title;
    writeTitle();
}

function onPlayerStateChange(event) {
    switch (event.data) {
        case YT.PlayerState.ENDED:
            //stopVideos(event, 1);
            stopState = 1;
            stopVideos(event, 1);
            //elements.playPause.value = "Play";
            elements.playPause.text.innerHTML = "Play";
            elements.playPause.icon.classList.remove("fa-youtube-play");
            elements.playPause.icon.classList.add("fa-pause");
            break;
        case YT.PlayerState.PLAYING:
            //if (!done) {
            //setTimeout(stopVideos, 6000);        
            //    done = true;
            //} else {
            playVideos(event);
            //}
            titles[event.target.num] = event.target.getVideoData().title;
            writeTitle();
            break;
        case YT.PlayerState.PAUSED:
            pauseVideos(event);
            break;
        case YT.PlayerState.BUFFERING:
            playVideos(event);
            break;
        case YT.PlayerState.CUED:

            break;
    }
}

function onPlayerError(event) {
    event.target.brokenVideo = 1;
    titles[event.target.num] = "";
    event.target.iframe = event.target.getIframe();
    event.target.iframe.classList.add("brokenVideo");
}

function toggleVideos() {
    //switch (elements.playPause.value) {
    switch (elements.playPause.text.innerHTML) {
        case "Play":
            playVideos();
            //elements.playPause.value = "Pause";
            elements.playPause.text.innerHTML = "Pause";
            elements.playPause.icon.classList.remove("fa-youtube-play");
            elements.playPause.icon.classList.add("fa-pause");
            break;
        case "Pause":
        default:
            pauseVideos();
            //elements.playPause.value = "Play";
            elements.playPause.icon.classList.remove("fa-pause");
            elements.playPause.icon.classList.add("fa-youtube-play");
            elements.playPause.text.innerHTML = "Play";
            break;
    }
}

function toggleMute(i, force) {
    if (force !== undefined) settings[i].mute = (settings[i].mute == 1 ? 0 : 1);
    switch (settings[i].mute) {
        case 1:
            player[i].unMute();
            settings[i].mute = 0;
            elements.player[i].mute.icon.classList.remove("fa-volume-down");
            elements.player[i].mute.icon.classList.add("fa-volume-off");
            elements.player[i].mute.text.innerHTML = "Mute";
            break;
        case 0:
        default:
            player[i].mute();
            settings[i].mute = 1;
            elements.player[i].mute.icon.classList.remove("fa-volume-off");
            elements.player[i].mute.icon.classList.add("fa-volume-down");
            elements.player[i].mute.text.innerHTML = "Unmute";
            break;
    }
    writePerma();
}

function setVolume(i) {
    if (debug) debugInfo("Volume Value: " + elements.player[i].volume.value);
    settings[i].volume = elements.player[i].volume.value;
    player[i].setVolume(settings[i].volume);
    writePerma();
}

function playVideos(event) {
    var state;
    for (var i = 0; i < player.length; i++) {
        state = player[i].getPlayerState();
        if (event && event.target == player[i] || (state == 1 || state == 3)) continue;
        /*if (stopState)
                        player[i].seekTo(time[i].value, !0);
                    else
                        player[i].playVideo();*/
        player[i].playVideo();
        if (stopState) player[i].seekTo(getSec(i), !0);
        //player[i].seekTo(player[i].getCurrentTime() + time[i].value, !0);
    }
    stopState = 0;
}

function pauseVideos(event) {
    var state;
    for (var i = 0; i < player.length; i++) {
        state = player[i].getPlayerState();
        if (event && event.target == player[i] || (state != 1)) continue;
        player[i].pauseVideo();
    }
}

//function stopVideos(event, seek) {
function stopVideos(event) {
    var state;
    for (var i = 0; i < player.length; i++) {
        state = player[i].getPlayerState();
        if (event && event.target == player[i] || (state == -1 || state === 0)) continue;
        //if (seek) player[i].seekTo(time[i].value, !0);
        //player[i].stopVideo();
        player[i].seekTo(player[i].getDuration(), !0);
    }
}

function setTimes() {
    for (var i = 0; i < player.length; i++) {
        settings[i].time = getSec(i);
        player[i].seekTo(settings[i].time, !0);
        //elements.playPause.value = "Pause";
        elements.playPause.text.innerHTML = "Pause";
        elements.playPause.icon.classList.remove("fa-youtube-play");
        elements.playPause.icon.classList.add("fa-pause");
        writePerma();
    }
}

function setVideos() {
    for (var i = 0; i < player.length; i++) {
        //if (debug) debugInfo("Value" + i + " - " + elements.player[i].videoID.value);
        var parts = parseIDField(elements.player[i].videoID.value);
        if (parts.videoID === undefined) return;
        //if (debug) debugInfo("Parts" + i + " - " + parts);
        //if (debug) debugInfo("Video" + i + " - " + tempVideo);
        if (parts.time === undefined) parts.time = getSec(i);
        if (debug) debugInfo("parts.time - " + parts.time);
        //if (debug) debugInfo("Time" + i + " - " + parts.time);
        //settings[i].time = getSec(i);
        if (player[i].brokenVideo) {
            player[i].iframe.classList.remove("brokenVideo");
            player[i].brokenVideo = 0;
        }
        player[i].loadVideoById(parts.videoID, parts.time, "default");
        elements.player[i].videoID.value = settings[i].videoID = parts.videoID;
        //time[i].value = settings[i].time = parts.time;
        sToHMS(parts.time, i);
        settings[i].time = parts.time;
        //elements.playPause.value = "Pause";
        elements.playPause.text.innerHTML = "Pause";
        elements.playPause.icon.classList.remove("fa-youtube-play");
        elements.playPause.icon.classList.add("fa-pause");
        writePerma();
    }
}

// Implemented based on: http://stackoverflow.com/questions/3452546/javascript-regex-how-to-get-youtube-video-id-from-url
function parseIDField(string) {
    //var webMatches = /.*(?:youtu\.be\/([a-zA-Z0-9_-]+)(?:\?.*)?|youtube\.com\/(?:embed\/|v\/|watch.*(?:\?|\&)v=)([a-zA-Z0-9_-]+)(?:(?:\?|\&|\#).*)?|^([a-zA-Z0-9_-]+)$)/gm;
    if (debug) debugInfo("Matched? " + string.match(/^([a-zA-Z0-9_-]+)$/m));
    var output = {};
    if (string.match(/^([a-zA-Z0-9_-]+)$/m)) {
        output.videoID = string;
        return output;
    }
    if (string.indexOf("%2F")) string = decodeURIComponent(string);
    if (debug) debugInfo("Ping.");
    var parameters = paramArray(string);
    if (debug) debugInfo(parameters);
    if (parameters.v !== undefined) output.videoID = parameters.v;
    else {
        //var webMatches = /^.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?.*v=)([a-zA-Z0-9_-]+).*$/;
        //var webMatches = /^.*(?:youtu.be\/|v\/|u\/\w\/|embed\/)([a-zA-Z0-9_-]+).*$/;
        var match = string.match(/^.*(?:youtu.be\/|v\/|u\/\w\/|embed\/)([a-zA-Z0-9_-]+).*$/m);
        if (match && match[1] !== undefined) output.videoID = match[1];
    }
    if (output.videoID !== undefined) {
        if (parameters.start !== undefined) output.time = Number(parameters.start);
        else if (parameters.t !== undefined) output.time = hmsToS(parameters.t);
        if (debug) debugInfo("Time Parameter - " + parameters.t);
        if (debug) debugInfo("Video Parameter - " + output.videoID);
        return output;
    } else return undefined;
}

function paramArray(url, format) {
    var paramList;
    if (url.indexOf("?") > -1) paramList = url.split("?")[1];
    else if (url.indexOf("#") > -1) paramList = url.split("#")[1];
    else return false;
    //var paramList = url.split("?")[1];
    var params = paramList.split(/[#&]/);
    var objects = {};
    for (var i = 0; i < params.length; i++) {
        if (!params[i].length) continue;
        var paramValue = params[i].split("=");
        if (format !== undefined) {
            var found = false;
            for (j = 0; j < format.length; j++) {
                if (paramValue[0].match(format[j])) {
                    found = true;
                    break;
                }
            }
            if (!found) continue;
        }
        objects[paramValue[0]] = paramValue[1];
    }
    return objects;
}

function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}

function processDoubler() {
    //var parameters = elements.doubler.value.split("?")[1].split("&");
    var parameters = paramArray(elements.doubler.value);
    if (parameters.video1) video0.value = parseIDField(parameters.video1).videoID;
    if (parameters.video2) video1.value = parseIDField(parameters.video2).videoID;
    if (parameters.start1) sToHMS(parameters.start1, 0);
    if (parameters.start2) sToHMS(parameters.start2, 1);
    writePerma();
}

function getSec(i) {
    var obj = {};
    for (var prop in elements.player[i].time)
    obj[prop] = Number(elements.player[i].time[prop].value) || 0;

    return calcSec(obj);
}

function hmsToS(timeStamp) {
    if (timeStamp.match(/^\d+$/m)) return timeStamp;
    var obj = {};
    var testObj = {
        h: /(\d+)[hH]/,
        m: /(\d+)[mM]/,
        s: /(\d+)[sS]/
    };
    var temp;
    for (var reg in testObj) {
        temp = timeStamp.match(testObj[reg]);
        if (temp) obj[reg] = Number(temp[1]) || 0;
    }

    return calcSec(obj);
}

function calcSec(obj) {
    return ((obj.h || 0) * 60 * 60) + ((obj.m || 0) * 60) + (obj.s || 0);
}

function sToHMS(sec, i) {
    var obj = {};
    var sec_num = parseInt(Number(sec) || 0, 10);
    obj.h = Math.floor(sec_num / 3600);
    obj.m = Math.floor((sec_num - (obj.h * 3600)) / 60);
    obj.s = sec_num - (obj.h * 3600) - (obj.m * 60);

    for (var prop in elements.player[i].time)
    elements.player[i].time[prop].value = obj[prop];
}

function writePerma(first) {
    var website = window.location.href;
    if (website.indexOf("?") > -1 || website.indexOf("#") > -1) website = website.split(/[?#]/)[0];
    if (debug) debugInfo("Website: " + website);
    var permaParam = [];
    if (debug) debugInfo("Player Length? " + player.length);
    for (var i = 0; i < player.length; i++) {
        //if(settings[i] == init[i]) continue;
        //if (JSON.stringify(settings[i]) === JSON.stringify(init[i])) continue;
        /*if (def.videoID != settings[i].videoID) permaParam.push("video" + i + "=" + settings[i].videoID);
                    if (def.time != settings[i].time) permaParam.push("start" + i + "=" + settings[i].time);
                    if (def.volume != settings[i].volume) permaParam.push("volume" + i + "=" + settings[i].volume);
                    if (def.mute != settings[i].mute) permaParam.push("mute" + i + "=" + settings[i].mute);*/
        if (init[i].videoID != settings[i].videoID) permaParam.push("video" + i + "=" + settings[i].videoID);
        if (init[i].time != settings[i].time) permaParam.push("start" + i + "=" + settings[i].time);
        if (init[i].volume != settings[i].volume) permaParam.push("volume" + i + "=" + settings[i].volume);
        if (init[i].mute != settings[i].mute) permaParam.push("mute" + i + "=" + settings[i].mute);
    }
    if (debug) debugInfo("Perma Length? " + permaParam.length);
    if (permaParam.length) elements.perma.value = website + "?" + permaParam.join("&");
    else elements.perma.value = website;
    if (!first) writeTitle();
}

function writeTitle() {
    var sortable = [];
    for (var name in titles)
    if (titles[name].length) sortable.push([name, titles[name]]);
    sortable.sort(function (a, b) {
        return a[0] - b[0]
    });
    var end = [];
    for (var i = 0; i < sortable.length; i++)
    end.push(sortable[i][1]);
    elements.title.innerHTML = end.join(" and ") + " - Side-by-Side Player";
}

function updateVideo() {
    var tempParam = paramArray(window.location.hash, [/video[0-9]+/, /start[0-9]+/, /volume[0-9]+/, /mute[0-9]+/]);
    if (!isEmpty(tempParam)) {
        for (var i = 0; i < player.length; i++) {
            //if (debug) debugInfo("Before settings: " + JSON.stringify(settings[i]));
            if (('video' + i) in tempParam) settings[i].videoID = tempParam['video' + i];
            if (('start' + i) in tempParam) settings[i].time = Number(tempParam['start' + i]);
            if (('volume' + i) in tempParam) settings[i].volume = Number(tempParam['volume' + i]);
            if (('mute' + i) in tempParam) settings[i].mute = Number(tempParam['mute' + i]);
            if (player[i].brokenVideo) {
                player[i].iframe.classList.remove("brokenVideo");
                player[i].brokenVideo = 0;
            }
            player[i].loadVideoById(settings[i].videoID, settings[i].time, "default");
            player[i].setVolume(settings[i].volume);
            if (settings[i].mute) toggleMute(i, 1);
            //if (debug) debugInfo("After settings: " + JSON.stringify(settings[i]));
        }
        writePerma();
    }
}

function debugInfo(text) {
    console.log("Side-by-Side Player: " + text);
}
