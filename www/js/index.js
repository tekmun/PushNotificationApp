var http;
var registerid;
var mobilenumber;
var nric;
var platform;
var closemessagehandle = 0;
var closeerrormessagehandle = 0;

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

function retrieveDisplay () {
  var postvalue = 'submitform=retrieve&registerid='+localStorage.getItem ( 'registerid' )+'&mobilenumber='+localStorage.getItem ( 'mobilenumber' )+'&platform='+localStorage.getItem ( 'platform' );
  try {
    http = createRequestObject ();
    http.onreadystatechange = responseRetrieveDisplay;
    http.open ( 'post', 'http://'+server+'/a_pushnotification.php' );
    http.setRequestHeader ( 'Content-Type', 'application/x-www-form-urlencoded' );
    http.send ( postvalue );
  }
  catch ( err ) {
  }
}

function responseRetrieveDisplay () {
  if ( ( http.readyState == 4 ) && ( http.status == 200 ) ) {
    var respText = http.responseText.substring ( 5, http.responseText.length - 6 );
    document.getElementById ( 'signindiv' ).style.display = 'none';
    document.getElementById ( 'displaydiv' ).innerHTML = respText;
    document.getElementById ( 'displaydiv' ).style.display = 'block';
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
    showerrormessage ( 'Callback Success! Result = '+result )
  },
  errorHandler:function ( error ) {
    showerrormessage ( error );
  },
  onNotificationGCM: function ( e ) {
    switch( e.event ) {
      case 'registered':
        if ( e.regid.length > 0 ) {
          registerid = localStorage.getItem ( 'registerid' );
          mobilenumber = localStorage.getItem ( 'mobilenumber' );
          localStorage.setItem ( 'registerid', e.regid );
          localStorage.setItem ( 'platform', 'android' );
          if ( ( registerid == null ) || ( mobilenumber == null ) ) {
            document.getElementById ( 'displaydiv' ).innerHTML = '';
            document.getElementById ( 'displaydiv' ).style.display = 'none';
            document.getElementById ( 'signindiv' ).style.display = 'block';
          }
          else {
            retrieveDisplay ();
          }
        }
        break;
      case 'message':
        //showerrormessage ( 'message = '+e.message+' msgcnt = '+e.msgcnt );
        document.getElementById ( 'notificationdiv' ).innerHTML = e.message;
        break;
      case 'error':
        showerrormessage ( 'GCM error = '+e.msg );
        break;
      default:
        showerrormessage ( 'An unknown GCM event has occurred' );
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

function showmessage ( message ) {
	document.getElementById ( 'wait' ).style.display = 'none';
  document.getElementById ( 'errormessage' ).style.display = 'none';
	document.getElementById ( 'message' ).innerHTML = message;
  document.getElementById ( 'message' ).style.display = '';
  if ( closemessagehandle != 0 ) {
  	clearTimeout ( closemessagehandle );
  }
  closemessagehandle = setTimeout ( closemessage, 4000 );
}

function closemessage () {
  if ( closemessagehandle != 0 ) {
  	clearTimeout ( closemessagehandle );
  }
	closemessagehandle = 0;
	document.getElementById ( 'message' ).style.display = 'none';
  document.getElementById ( 'message' ).innerHTML = '';
}

function showerrormessage ( message ) {
	document.getElementById ( 'wait' ).style.display = 'none';
  document.getElementById ( 'message' ).style.display = 'none';
	document.getElementById ( 'errormessage' ).innerHTML = message;
  document.getElementById ( 'errormessage' ).style.display = '';
  if ( closeerrormessagehandle != 0 ) {
  	clearTimeout ( closeerrormessagehandle );
  }
  closeerrormessagehandle = setTimeout ( closeerrormessage, 6000 );
}

function closeerrormessage () {
	closeerrormessagehandle = 0;
	document.getElementById ( 'errormessage' ).style.display = 'none';
  document.getElementById ( 'errormessage' ).innerHTML = '';
}

function clickNRICFocus () {
  document.getElementById ( 'field1text' ).focus ();
}

function keypressChangeNRIC ( event ) {
	var key = event.keyCode ? event.keyCode : event.charCode ? event.charCode : event.which;
	if ( key == 13 ) {
    clickMobileNumberFocus  ();
  }
}

function clickMobileNumberFocus () {
  document.getElementById ( 'field2text' ).focus ();
}

function keypressChangeMobileNumber ( event ) {
	var key = event.keyCode ? event.keyCode : event.charCode ? event.charCode : event.which;
	if ( key == 13 ) {
    clickSignIn ();
  }
}

function responseClickSignIn () {
  if ( ( http.readyState == 4 ) && ( http.status == 200 ) ) {
    var respText = http.responseText.substring ( 5, http.responseText.length - 6 );
    if ( respText.indexOf ( 'Success' ) >= 0 ) {
      localStorage.setItem ( 'mobilenumber', mobilenumber );
      localStorage.setItem ( 'nric', nric );
      showmessage ( respText );
      retrieveDisplay ();
    }
    else {
      showerrormessage ( respText );
    }
  }
}

function clickSignIn () {
	if ( document.getElementById ( 'field1text' ).value == '' ) {
    clickNRICFocus ();
    return false;
  }
	if ( document.getElementById ( 'field2text' ).value == '' ) {
	  clickMobileNumberFocus ();
    return false;
  }
  var postvalue = 'submitform=signin&nric='+document.getElementById ( 'field1text' ).value+'&mobilenumber='+document.getElementById ( 'field2text' ).value;
  postvalue += '&registerid='+localStorage.getItem ( 'registerid' );
  postvalue += '&platform='+localStorage.getItem ( 'platform' );
  nric = document.getElementById ( 'field1text' ).value;
  mobilenumber = document.getElementById ( 'field2text' ).value;
  try {
    http = createRequestObject ();
    http.onreadystatechange = responseClickSignIn;
    http.open ( 'post', 'http://'+server+'/a_pushnotification.php' );
    http.setRequestHeader ( 'Content-Type', 'application/x-www-form-urlencoded' );
    http.send ( postvalue );
  }
  catch ( err ) {
  }
}

function responseClickDeleteAccount () {
  if ( ( http.readyState == 4 ) && ( http.status == 200 ) ) {
    var respText = http.responseText.substring ( 5, http.responseText.length - 6 );
    if ( respText.indexOf ( 'Success' ) >= 0 ) {
      localStorage.setItem ( 'mobilenumber', mobilenumber );
      localStorage.setItem ( 'nric', nric );
      showmessage ( respText );
      retrieveDisplay ();
    }
    else {
      showerrormessage ( respText );
    }
  }
}

function clickDeleteAccount ( registerid, mobilenumber, platform ) {
  localStorage.removeItem ( 'registerid' );
  var postvalue = 'submitform=deleteaccount&registerid='+registerid+'&mobilenumber='+mobilenumber+'&platform='+platform;
  try {
    http = createRequestObject ();
    http.onreadystatechange = responseClickDeleteAccount;
    http.open ( 'post', 'http://'+server+'/a_pushnotification.php' );
    http.setRequestHeader ( 'Content-Type', 'application/x-www-form-urlencoded' );
    http.send ( postvalue );
  }
  catch ( err ) {
  }
}

function clickRegisterNewAccount () {
  document.getElementById ( 'signindiv' ).style.display = 'block';
  document.getElementById ( 'displaydiv' ).innerHTML = '';
  document.getElementById ( 'displaydiv' ).style.display = 'none';
}