const $cookiesLink = document.getElementById('livezilla.cookies.link');
const $cookiesStatus = document.getElementById('livezilla.cookies.status');
const $trackingLink = document.getElementById('livezilla.tracking.link');
const $trackingStatus = document.getElementById('livezilla.tracking.status');

class pbLiveZilla {
  static status() {
    if ( $cookiesLink !== null ) {
    if (LiveZilla.OptOutCookie) {
        $cookiesLink.innerHTML = window.pb.livezilla.cookies.enable;
        $cookiesStatus.innerHTML = window.pb.livezilla.status.disabled;
      } else {
        $cookiesLink.innerHTML = window.pb.livezilla.cookies.disable;
        $cookiesStatus.innerHTML = window.pb.livezilla.status.enabled;
      }
      console.log("Opt Out Cookie: " + LiveZilla.OptOutCookie);
    }

    if ( $trackingLink !== null ) {
      if (LiveZilla.OptOutTrack) {
        $trackingLink.innerHTML = window.pb.livezilla.tracking.enable;
        $trackingStatus.innerHTML = window.pb.livezilla.status.disabled;
      } else {
        $trackingLink.innerHTML = window.pb.livezilla.tracking.disable;
        $trackingStatus.innerHTML = window.pb.livezilla.status.enabled;
      }
      console.log("Opt Out Track: " + LiveZilla.OptOutTrack);
    }
  }

  static toggleCookies() {
    if (LiveZilla.OptOutCookie) {
      LiveZilla.OptOutCookie = false;
      pbLiveZilla.status();
    } else {
      LiveZilla.OptOutCookies();
      pbLiveZilla.status();
    }
  }

  static toogleTracking() {
    if (LiveZilla.OptOutTrack) {
      LiveZilla.OptOutTrack = false;
      pbLiveZilla.status();
    } else {
      LiveZilla.OptOutTracking();
      pbLiveZilla.status();
    }
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
