const $cookiesLink = document.getElementById('livezilla.cookies.link');
const $cookiesStatus = document.getElementById('livezilla.cookies.status');
const $trackingLink = document.getElementById('livezilla.tracking.link');
const $trackingStatus = document.getElementById('livezilla.tracking.status');

class pbLiveZilla {
  static status() {
    if (LiveZilla.OptOutCookie) {
      if ( $cookiesLink !== null ) $cookiesLink.style.display = 'none';
      if ( $cookiesStatus !== null ) $cookiesStatus.innerHTML = window.pb.livezilla.cookies.off;
    }

    if (LiveZilla.OptOutTrack) {
      if ( $trackingLink !== null ) $trackingLink.style.display = 'none';
      if ( $trackingStatus !== null ) $trackingStatus.innerHTML = window.pb.livezilla.tracking.off;
    }
  }

  static disableCookies() {
    LiveZilla.OptOutCookies();
    pbLiveZilla.status();
  }

  static disableTracking() {
    LiveZilla.OptOutTracking();
    pbLiveZilla.status();
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
