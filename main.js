var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var stopState = 0;
var debug = 0;
var player = [];
var startTime = [1, 0];
var startVideo = ["qeMFqkcPYcg", "g1AJdg3zxlw"];
var video = [document.getElementById("video0"), document.getElementById("video1")];
//var time = [];
/*for (var i = 0; i < window.player.length; i++) {
    window.time.push({
        'h': document.getElementById("time" + i + "h"),
            'm': document.getElementById("time" + i + "m"),
            's': document.getElementById("time" + i + "s")
    });
}*/
var time = [{
    'h': document.getElementById("time0h"),
        'm': document.getElementById("time0m"),
        's': document.getElementById("time0s")
}, {
    'h': document.getElementById("time1h"),
        'm': document.getElementById("time1m"),
        's': document.getElementById("time1s")
}];
//var time = [document.getElementById("time0"), document.getElementById("time1")];
var mute = [document.getElementById("mute0"), document.getElementById("mute1")];
var playPause = document.getElementById("playPause");
var doubler = document.getElementById("doubler");
var perma = document.getElementById("perma");
var playerEvents = {
    'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
};

function onYouTubeIframeAPIReady() {
    if (window.debug) console.log("Side-by-Side Player: Parameters - " + window.location.href + " (Length: " + window.location.href.length + ")");
    if (window.location.href.length) {
        var tempParam = paramArray(window.location.href);
        if (tempParam.video0) window.startVideo[0] = tempParam.video0;
        if (tempParam.video1) window.startVideo[1] = tempParam.video1;
        if (tempParam.start0) window.startTime[0] = tempParam.start0;
        if (tempParam.start1) window.startTime[1] = tempParam.start1;
    }
    for (var i = 0; i < window.startVideo.length; i++) {
        window.player.push(new YT.Player('player' + i, {
            height: '100%',
            width: '100%',
            videoId: window.startVideo[i],
            playerVars: {
                'start': window.startTime[i],
                    'controls': 0,
                    'showinfo': 0,
                    'rel': 0,
                    'theme': "light"
            },
            events: playerEvents
        }));
        //time[i].value = window.startTime[i];
        sToHMS(window.startTime[i], i);
        window.video[i].value = window.startVideo[i];
    }
    writePerma();
}

function onPlayerReady(event) {
    //event.target.playVideo();
}

//var done = false;

function onPlayerStateChange(event) {
    switch (event.data) {
        case YT.PlayerState.ENDED:
            //stopVideos(event, 1);
            window.stopState = 1;
            stopVideos(event, 1);
            window.playPause.value = "Play";
            break;
        case YT.PlayerState.PLAYING:
            //if (!done) {
                //setTimeout(stopVideos, 6000);		
            //    window.done = true;
            //} else {
            //    playVideos(event);
            //}
            break;
        case YT.PlayerState.PAUSED:
            pauseVideos(event);
            break;
        case YT.PlayerState.BUFFERING:

            break;
        case YT.PlayerState.CUED:

            break;
    }
}

function toggleVideos() {
    if (window.playPause.value == "Pause") {
        pauseVideos();
        window.playPause.value = "Play";
    } else if (window.playPause.value == "Play") {
        playVideos();
        window.playPause.value = "Pause";
    } else {
        if (window.debug) console.log("Side-by-Side Player: Toggle broken. Defaulting.");
        pauseVideos();
        window.playPause.value = "Play";
    }
}

function toggleMute(c) {
    if (window.mute[c].value == "Mute") {
        window.player[c].mute();
        window.mute[c].value = "Unmute";
    } else if (window.mute[c].value == "Unmute") {
        window.player[c].unMute();
        window.mute[c].value = "Mute";
    } else {
        if (window.debug) console.log("Side-by-Side Player: window.Mute broken. Defaulting.");
        window.player[c].mute();
        window.mute[c].value = "Unmute";
    }
}

function playVideos(event) {
    var state;
    for (var i = 0; i < window.player.length; i++) {
        state = window.player[i].getPlayerState();
        if (event && event.target == window.player[i] || (state == 1)) continue;
        /*if (window.stopState)
			window.player[i].seekTo(window.time[i].value, !0);
		else
            window.player[i].playVideo();*/
        window.player[i].playVideo();
        if (window.stopState) player[i].seekTo(getSec(i), !0);
        //player[i].seekTo(window.player[i].getCurrentTime() + window.time[i].value, !0);
    }
    window.stopState = 0;
}

function pauseVideos(event) {
    var state;
    for (var i = 0; i < window.player.length; i++) {
        state = window.player[i].getPlayerState();
        if (event && event.target == window.player[i] || (state != 1)) continue;
        window.player[i].pauseVideo();
    }
}

//function stopVideos(event, seek) {
function stopVideos(event) {
    var state;
    for (var i = 0; i < window.player.length; i++) {
        state = window.player[i].getPlayerState();
        if (event && event.target == window.player[i] || (state == -1 || state === 0)) continue;
        //if (seek) window.player[i].seekTo(window.time[i].value, !0);
        //player[i].stopVideo();
        window.player[i].seekTo(window.player[i].getDuration(), !0);
    }
}

function setTimes() {
    for (var i = 0; i < window.player.length; i++) {
        window.startTime[i] = processTime(i);
        window.player[i].seekTo(window.startTime[i], !0);
        writePerma();
    }
}

function setVideos() {
    for (var i = 0; i < window.player.length; i++) {
        if (window.debug) console.log("Side-by-Side Player: Value" + i + " - " + window.video[i].value);
        var parts = parseVideoID(window.video[i].value);
        if (window.debug) console.log("Side-by-Side Player: Parts" + i + " - " + parts);
        var tempVideo = parts.id;
        if (window.debug) console.log("Side-by-Side Player: Video" + i + " - " + tempVideo);
        var tempTime = parts.time || processTime(i);
        if (window.debug) console.log("Side-by-Side Player: Time" + i + " - " + tempTime);
        //startTime[i] = processTime(i);
        if (tempVideo !== undefined) {
            window.player[i].loadVideoById(tempVideo, tempTime, "default");
            window.video[i].value = window.startVideo[i] = tempVideo;
            //time[i].value = window.startTime[i] = tempTime;
            sToHMS(tempTime, i);
            window.startTime[i] = tempTime;
            window.playPause.value = "Pause";
            writePerma();
        }
    }
}

function processTime(n) {
    var tempTime = getSec(n);
    if (!isNumber(tempTime)) tempTime = window.startTime[n];
    return tempTime;
}

// Implemented based on: http://stackoverflow.com/questions/3452546/javascript-regex-how-to-get-youtube-video-id-from-url
function parseVideoID(string) {
    //var webMatches = /.*(?:youtu\.be\/([a-zA-Z0-9_-]+)(?:\?.*)?|youtube\.com\/(?:embed\/|v\/|watch.*(?:\?|\&)v=)([a-zA-Z0-9_-]+)(?:(?:\?|\&|\#).*)?|^([a-zA-Z0-9_-]+)$)/gm;
    if (window.debug) console.log("Side-by-Side Player: Matched? " + string.match(/^([a-zA-Z0-9_-]+)$/m));
    if (string.match(/^([a-zA-Z0-9_-]+)$/m)) return {
        'id': string
    };
    if (string.indexOf("%2F")) string = decodeURIComponent(string);
    var videoID, tTime;
    if (window.debug) console.log("Side-by-Side Player: Ping.");
    var parameters = paramArray(string);
    if (window.debug) console.log("Side-by-Side Player: " + parameters);
    if (parameters.v) videoID = parameters.v;
    else {
        //var webMatches = /^.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?.*v=)([a-zA-Z0-9_-]+).*$/;
        //var webMatches = /^.*(?:youtu.be\/|v\/|u\/\w\/|embed\/)([a-zA-Z0-9_-]+).*$/;
        var pre = string.match(/^.*(?:youtu.be\/|v\/|u\/\w\/|embed\/)([a-zA-Z0-9_-]+).*$/m);
        if (pre) videoID = pre[1];
    }
    if (videoID) {
        if (parameters.start) tTime = Number(parameters.start);
        else if (parameters.t) tTime = hmsToS(parameters.t);
        if (window.debug) console.log("Side-by-Side Player: window.Time Parameter - " + parameters.t);
        if (window.debug) console.log("Side-by-Side Player: window.Video Parameter - " + videoID);
        return {
            'id': videoID,
                'time': tTime
        };
    } else return undefined;
}

function paramArray(url) {
    var paramList;
    if (url.indexOf("?") > -1) paramList = url.split("?")[1];
    else if (url.indexOf("#") > -1) paramList = url.split("#")[1];
    else return url;
    //var paramList = url.split("?")[1];
    var params = paramList.split(/[&#]/);
    var objects = {};
    for (var i = 0; i < params.length; i++) {
        var paramValue = params[i].split("=");
        objects[paramValue[0]] = paramValue[1];
    }
    return objects;
}

function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function processDoubler() {
    //var parameters = window.doubler.value.split("?")[1].split("&");
    var parameters = paramArray(window.doubler.value);
    window.video0.value = parseVideoID(parameters.video1).id;
    window.video1.value = parseVideoID(parameters.video2).id;
    sToHMS(parameters.start1, 0);
    sToHMS(parameters.start2, 0);
    writePerma();
}

function getSec(i) {
    var h = Number(time[i].h.value) || 0;
    var m = Number(time[i].m.value) || 0;
    var s = Number(time[i].s.value) || 0;

    return (h * 60 * 60) + (m * 60) + s;
}

function hmsToS(timeStamp) {
    if (timeStamp.match(/^\d+$/m)) return timeStamp;
    var h, m, s = 0;
    if (h == timeStamp.match(/(\d+)[hH]/)) h = Number(h[1]) || 0;
    if (m == timeStamp.match(/(\d+)[mM]/)) m = Number(m[1]) || 0;
    if (s == timeStamp.match(/(\d+)[sS]/)) s = Number(s[1]) || 0;

    return (h * 60 * 60) + (m * 60) + s;
}

function sToHMS(sec, i) {
    var sec_num = parseInt(sec || 0, 10);
    var h = Math.floor(sec_num / 3600);
    var m = Math.floor((sec_num - (h * 3600)) / 60);
    var s = sec_num - (h * 3600) - (m * 60);

    window.time[i].h.value = h;
    window.time[i].m.value = m;
    window.time[i].s.value = s;
}

function writePerma() {
    var website = window.location.href;
    if (website.indexOf("?") > -1) website = website.split("?")[0];
    var permaParam = "";
    for (var i = 0; i < window.player.length; i++) {
        if (i > 0) permaParam += "&";
        permaParam += "video" + i + "=" + window.startVideo[i] +
            "&start" + i + "=" + window.startTime[i];
    }
    window.perma.value = website + "?" + permaParam;
}
