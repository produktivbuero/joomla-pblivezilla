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
    }

    if (document.cookie.indexOf(liveZillaTracking + '=true') > -1) {
      if ( $trackingLink !== null ) $trackingLink.style.display = 'none';
      if ( $trackingStatus !== null ) $trackingStatus.innerHTML = window.pb.livezilla.text.tracking.off;
    }
  }

  static disableCookies() {
    LiveZilla.OptOutCookies();
    pbLiveZilla.setCookie(livezillaCookie, 'true', 100); /* set own cookie for status */
    pbLiveZilla.status();
  }

  static disableTracking() {
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


/* init (check every 500ms) */
var checkExist = setInterval(function() {
   if (typeof LiveZilla != "undefined") {
      console.log("LiveZilla loaded.");
      clearInterval(checkExist);

      pbLiveZilla.status();
   }
}, 500);
