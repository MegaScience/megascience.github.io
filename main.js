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
var time = [];
/*for (var i = 0; i < player.length; i++) {
    time.push({
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
    if (debug) console.log("Side-by-Side Player: Parameters - " + window.location.href + " (Length: " + window.location.href.length + ")");
    if (window.location.href.length) {
        var tempParam = paramArray(window.location.href);
        if (tempParam.video0) startVideo[0] = tempParam.video0;
        if (tempParam.video1) startVideo[1] = tempParam.video1;
        if (tempParam.start0) startTime[0] = tempParam.start0;
        if (tempParam.start1) startTime[1] = tempParam.start1;
    }
    for (var i = 0; i < startVideo.length; i++) {
        player.push(new YT.Player('player' + i, {
            height: '100%',
            width: '100%',
            videoId: startVideo[i],
            playerVars: {
                'start': startTime[i],
                    'controls': 0,
                    'showinfo': 0,
                    'rel': 0,
                    'theme': "light"
            },
            events: playerEvents
        }));
        //time[i].value = startTime[i];
        sToHMS(startTime[i], i);
        video[i].value = startVideo[i];
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
            stopState = 1;
            stopVideos(event, 1);
            playPause.value = "Play";
            break;
        case YT.PlayerState.PLAYING:
            //if (!done) {
                //setTimeout(stopVideos, 6000);		
            //    done = true;
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
    if (playPause.value == "Pause") {
        pauseVideos();
        playPause.value = "Play";
    } else if (playPause.value == "Play") {
        playVideos();
        playPause.value = "Pause";
    } else {
        if (debug) console.log("Side-by-Side Player: Toggle broken. Defaulting.");
        pauseVideos();
        playPause.value = "Play";
    }
}

function toggleMute(c) {
    if (mute[c].value == "Mute") {
        player[c].mute();
        mute[c].value = "Unmute";
    } else if (mute[c].value == "Unmute") {
        player[c].unMute();
        mute[c].value = "Mute";
    } else {
        if (debug) console.log("Side-by-Side Player: Mute broken. Defaulting.");
        player[c].mute();
        mute[c].value = "Unmute";
    }
}

function playVideos(event) {
    var state;
    for (var i = 0; i < player.length; i++) {
        state = player[i].getPlayerState();
        if (event && event.target == player[i] || (state == 1)) continue;
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
        startTime[i] = processTime(i);
        player[i].seekTo(startTime[i], !0);
        writePerma();
    }
}

function setVideos() {
    for (var i = 0; i < player.length; i++) {
        if (debug) console.log("Side-by-Side Player: Value" + i + " - " + video[i].value);
        var parts = parseVideoID(video[i].value);
        if (debug) console.log("Side-by-Side Player: Parts" + i + " - " + parts);
        var tempVideo = parts.id;
        if (debug) console.log("Side-by-Side Player: Video" + i + " - " + tempVideo);
        var tempTime = parts.time || processTime(i);
        if (debug) console.log("Side-by-Side Player: Time" + i + " - " + tempTime);
        //startTime[i] = processTime(i);
        if (tempVideo !== undefined) {
            player[i].loadVideoById(tempVideo, tempTime, "default");
            video[i].value = startVideo[i] = tempVideo;
            //time[i].value = startTime[i] = tempTime;
            sToHMS(tempTime, i);
            startTime[i] = tempTime;
            playPause.value = "Pause";
            writePerma();
        }
    }
}

function processTime(n) {
    var tempTime = getSec(n);
    if (!isNumber(tempTime)) tempTime = startTime[n];
    return tempTime;
}

// Implemented based on: http://stackoverflow.com/questions/3452546/javascript-regex-how-to-get-youtube-video-id-from-url
function parseVideoID(string) {
    //var webMatches = /.*(?:youtu\.be\/([a-zA-Z0-9_-]+)(?:\?.*)?|youtube\.com\/(?:embed\/|v\/|watch.*(?:\?|\&)v=)([a-zA-Z0-9_-]+)(?:(?:\?|\&|\#).*)?|^([a-zA-Z0-9_-]+)$)/gm;
    if (debug) console.log("Side-by-Side Player: Matched? " + string.match(/^([a-zA-Z0-9_-]+)$/m));
    if (string.match(/^([a-zA-Z0-9_-]+)$/m)) return {
        'id': string
    };
    if (string.indexOf("%2F")) string = decodeURIComponent(string);
    var videoID, tTime;
    if (debug) console.log("Side-by-Side Player: Ping.");
    var parameters = paramArray(string);
    if (debug) console.log("Side-by-Side Player: " + parameters);
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
        if (debug) console.log("Side-by-Side Player: Time Parameter - " + parameters.t);
        if (debug) console.log("Side-by-Side Player: Video Parameter - " + videoID);
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
    //var parameters = doubler.value.split("?")[1].split("&");
    var parameters = paramArray(doubler.value);
    video0.value = parseVideoID(parameters.video1).id;
    video1.value = parseVideoID(parameters.video2).id;
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
    var h = m = s = 0;
    if (h = timeStamp.match(/(\d+)[hH]/)) h = Number(h[1]) || 0;
    if (m = timeStamp.match(/(\d+)[mM]/)) m = Number(m[1]) || 0;
    if (s = timeStamp.match(/(\d+)[sS]/)) s = Number(s[1]) || 0;

    return (h * 60 * 60) + (m * 60) + s;
}

function sToHMS(sec, i) {
    var sec_num = parseInt(sec || 0, 10);
    var h = Math.floor(sec_num / 3600);
    var m = Math.floor((sec_num - (h * 3600)) / 60);
    var s = sec_num - (h * 3600) - (m * 60);

    time[i].h.value = h;
    time[i].m.value = m;
    time[i].s.value = s;
}

function writePerma() {
    var website = window.location.href;
    if (website.indexOf("?") > -1) website = website.split("?")[0];
    var permaParam = "";
    for (var i = 0; i < player.length; i++) {
        if (i > 0) permaParam += "&";
        permaParam += "video" + i + "=" + startVideo[i] +
            "&start" + i + "=" + startTime[i];
    }
    perma.value = website + "?" + permaParam;
}
