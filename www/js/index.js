var http;
var registerid = '';

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
    alert ( 'responseNotification' );
  }
}

var app = {
  initialize: function () {
    this.bindEvents ();
  },
  // Bind Event Listeners
  //
  // Bind any events that are required on startup. Common events are:
  // 'load', 'deviceready', 'offline', and 'online'.
  bindEvents: function () {
    document.addEventListener ('deviceready', this.onDeviceReady, false );
  },
  // deviceready Event Handler
  //
  // The scope of 'this' is the event. In order to call the 'receivedEvent'
  // function, we must explicity call 'app.receivedEvent(...);'
  onDeviceReady: function () {
    app.receivedEvent ( 'deviceready' );
  },
  // Update DOM on a Received Event
  receivedEvent: function ( id ) {
    var parentElement = document.getElementById ( id );
    var listeningElement = parentElement.querySelector ( '.listening' );
    var receivedElement = parentElement.querySelector ( '.received' );
    listeningElement.setAttribute ( 'style', 'display:none;' );
    receivedElement.setAttribute ( 'style', 'display:block;' );
    var pushNotification = window.plugins.pushNotification;
    if ( device.platform == 'android' || device.platform == 'Android' ) {
      alert ( '1. Register called' );
      pushNotification.register ( this.successHandler, this.errorHandler, { 'senderID':'232320349737', 'ecb':'app.onNotificationGCM' } );
    }
    else {
      alert ( '2. Register called' );
      pushNotification.register ( this.successHandler, this.errorHandler, { 'badge':'true', 'sound':'true', 'alert':'true', 'ecb':'app.onNotificationAPN' } );
    }
  },
  // result contains any message sent from the plugin call
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
          registerid = e.regid;
          alert ( 'registration id = '+registerid );
          alert ( server );
          var postvalue = 'submitform=register&id='+registerid;
          alert ( postvalue );
          try {
            http = createRequestObject ();
            http.abort ();
            http.onreadystatechange = responseNotification;
            alert ( 'http://'+server+'/a_registerid-android.php' );
            http.open ( 'post', 'http://'+server+'/a_registerid-android.php' );
            http.setRequestHeader ( 'Content-Type', 'application/x-www-form-urlencoded' );
            http.send ( postvalue );
          }
          catch ( err ) {
            alert ( 'AJAX ERROR' );s
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
