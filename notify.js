var gcm = require ( 'node-gcm' );
var message = new gcm.Message ();
var sender = new gcm.Sender ( 'AIzaSyAiPc-dX0MwuTNNrER2CMdhCEWjqAAjJaA' );
var registrationIds = [];
message.addData ( 'message',"\u270C Peace, Love \u2764 and PhoneGap \u2706!");
message.addData ( 'title','Push Notification Sample' );
message.addData ( 'msgcnt', '3' );
message.addData ( 'soundname','beep.wav' );
message.timeToLive = 3;
// At least one reg id required
registrationIds.push ( 'APA91bGhN6tEYs-vkaAZAHYFryoRaATqoMbnT5p3TY1WhrVtbeWIRyg3BA7_U3I91ZiHG83KB_moM_a2npa0MhJ9JKIA4-0tXWDOuo6cwl5ZT1LxzZjrG7ZcWOsEOiRcUZ5yHI2JK-ZEHuRluu4tAALGB6J6dlwmEQ' );
sender.send ( message, registrationIds, 4, function (result) {
    console.log ( 'result '+result );
} );
