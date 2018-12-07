const livezillaCookie = window.pb.livezilla.cookies.name;
const $cookiesLink = document.getElementById('livezilla.cookies.link');
const $cookiesStatus = document.getElementById('livezilla.cookies.status');

const liveZillaTracking = window.pb.livezilla.tracking.name;
const $trackingLink = document.getElementById('livezilla.tracking.link');
const $trackingStatus = document.getElementById('livezilla.tracking.status');

class pbLiveZilla {
  static status() {
    if (document.cookie.indexOf(livezillaCookie + '=true') > -1) {
      if ( $cookiesLink !== null ) $cookiesLink.style.display = 'none';
      if ( $cookiesStatus !== null ) $cookiesStatus.innerHTML = window.pb.livezilla.text.cookies.off;
    } else {
      if ( $cookiesStatus !== null ) $cookiesStatus.innerHTML = window.pb.livezilla.text.on;
    }

    if (document.cookie.indexOf(liveZillaTracking + '=true') > -1) {
      if ( $trackingLink !== null ) $trackingLink.style.display = 'none';
      if ( $trackingStatus !== null ) $trackingStatus.innerHTML = window.pb.livezilla.text.tracking.off;
    } else {
      if ( $trackingStatus !== null ) $trackingStatus.innerHTML = window.pb.livezilla.text.on;
    }
  }

  static disableCookies() {
    if (typeof LiveZilla == "undefined") { return alert(window.pb.livezilla.text.error.nochat); };

    LiveZilla.OptOutCookies();
    pbLiveZilla.setCookie(livezillaCookie, 'true', 100); /* set own cookie for status */
    pbLiveZilla.status();
  }

  static disableTracking() {
    if (typeof LiveZilla == "undefined") { return alert(window.pb.livezilla.text.error.nochat); };
    
    LiveZilla.OptOutTracking();
    pbLiveZilla.setCookie(liveZillaTracking, 'true', 100); /* set own cookie for status */
    pbLiveZilla.status();
  }

  static setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }
}


/* init (check every 500ms, retry 20 times) */
var timesRun = 0;
var maxRun = 20;
var checkExist = setInterval(function() {
    
    timesRun += 1;
    if(timesRun === maxRun) {
      console.log("LiveZilla NOT loaded");
      clearInterval(checkExist);
    }

    if (typeof LiveZilla != "undefined") {
      console.log("LiveZilla loaded");
      clearInterval(checkExist);
      pbLiveZilla.status();
    }
}, 500);
