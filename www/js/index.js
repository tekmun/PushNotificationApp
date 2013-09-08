var http;
var registerid;
var phonenumber;

function createRequestObject () {
  var request_o;
  if ( document.all && window.ActiveXObject ) {
    request_o = new ActiveXObject ( 'Microsoft.XMLHTTP' );
  }
  else if ( window.opera ) {
    request_o = new XMLHttpRequest ();
  }
  else {
    request_o = new XMLHttpRequest ();
  }
  return ( request_o );
}

function responseNotification () {
  if ( ( http.readyState == 4 ) && ( http.status == 200 ) ) {
    var respText = http.responseText.substring ( 5, http.responseText.length - 6 );
    if ( respText.indexOf ( 'Success' ) < 0 ) {
      alert ( respText );
    }
  }
}

var app = {
  initialize: function () {
    this.bindEvents ();
  },
  bindEvents: function () {
    document.addEventListener ('deviceready', this.onDeviceReady, false );
  },
  onDeviceReady: function () {
    app.receivedEvent ( 'deviceready' );
  },
  receivedEvent: function ( id ) {
    var parentElement = document.getElementById ( id );
    var listeningElement = parentElement.querySelector ( '.listening' );
    var receivedElement = parentElement.querySelector ( '.received' );
    listeningElement.setAttribute ( 'style', 'display:none;' );
    receivedElement.setAttribute ( 'style', 'display:block;' );
    var pushNotification = window.plugins.pushNotification;
    if ( device.platform == 'android' || device.platform == 'Android' ) {
      pushNotification.register ( this.successHandler, this.errorHandler, { 'senderID':'232320349737', 'ecb':'app.onNotificationGCM' } );
    }
    else {
      pushNotification.register ( this.successHandler, this.errorHandler, { 'badge':'true', 'sound':'true', 'alert':'true', 'ecb':'app.onNotificationAPN' } );
    }
  },
  successHandler: function ( result ) {
    alert ( 'Callback Success! Result = '+result )
  },
  errorHandler:function ( error ) {
    alert ( error );
  },
  onNotificationGCM: function ( e ) {
    switch( e.event ) {
      case 'registered':
        if ( e.regid.length > 0 ) {
          registerid = localStorage.getItem ( 'registerid' );
          if ( registerid == null ) {
            localStorage.setItem ( 'registerid', e.regid );
            registerid = e.regid;
            phonenumber = localStorage.getItem ( 'phonenumber' );
            if ( phonenumber != null ) {
              var postvalue = 'submitform=register&registerid='+registerid+'&phonenumber'+phonenumber;
              try {
                http = createRequestObject ();
                http.abort ();
                http.onreadystatechange = responseNotification;
                http.open ( 'post', 'http://'+server+'/a_registerid-android.php' );
                http.setRequestHeader ( 'Content-Type', 'application/x-www-form-urlencoded' );
                http.send ( postvalue );
              }
              catch ( err ) {
              }
            }
          }
        }
        break;
      case 'message':
        // this is the actual push notification. its format depends on the data model from the push server
        alert ( 'message = '+e.message+' msgcnt = '+e.msgcnt );
        break;
      case 'error':
        alert ( 'GCM error = '+e.msg );
        break;
      default:
        alert ( 'An unknown GCM event has occurred' );
        break;
    }
  },
  onNotificationAPN: function ( event ) {
    var pushNotification = window.plugins.pushNotification;
    alert ( 'Running in JS - onNotificationAPN - Received a notification! '+event.alert );
    
    if ( event.alert ) {
      navigator.notification.alert ( event.alert );
    }
    if ( event.badge ) {
      pushNotification.setApplicationIconBadgeNumber ( this.successHandler, this.errorHandler, event.badge );
    }
    if ( event.sound ) {
      var snd = new Media ( event.sound );
      snd.play ();
    }
  }
};
