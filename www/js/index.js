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
    var telephoneNumber = cordova.require ( 'cordova/plugin/telephonenumber' );
    telephoneNumber.get ( function ( result ) {
      alert ( 'result '+result );
      console.log ( 'result = '+result );
    }, function () {
      alert ( 'error' );
      console.log ( 'error' );
    });
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
      alert ( 'Register called' );
      pushNotification.register ( this.successHandler, this.errorHandler, { 'senderID':'232320349737', 'ecb':'app.onNotificationGCM' } );
    }
    else {
      alert ( 'Register called' );
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
          alert ( 'registration id = '+e.regid );
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
