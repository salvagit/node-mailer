
var fs = require('fs');

var contacts = "contacts/compre1.csv";

var validEmails = [],
    invalidEmails = [];

fs.readFile(contacts, function (err, data) {

   if (err) return console.error(err);

   var sdata = data.toString(),
       lines = sdata.split('\n');

   // get emails
   for (var i in lines) { getVals(lines[i]); }

   var uniqueEmails = validEmails.filter(function(elem, pos) {
     return validEmails.indexOf(elem) == pos;
   });

   console.log(validEmails.length);
   console.log(invalidEmails.length);
   console.log(uniqueEmails.length);

   for (var k in uniqueEmails) {
     // console.log(uniqueEmails[k]);
   }

   send('salvador.palmiciano@gmail.com');

});

function getVals (line) {

  function validateEmail(email) {
    var re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    return re.test(email);
  }

  var sline = line.split(',');
  for (var i in sline) {
    if (sline[i].indexOf('@') > -1) {
      var email = sline[i];
      if (validateEmail(email)) {
        validEmails.push(email);
      } else {
        invalidEmails.push(email);
      }
    }
  }
}

function send (email) {
  var api_key = 'key-60153829e1a3844d37cb80320bf6aa89';
  var domain = 'salvadorp.com';
  var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
  var fileStream = fs.createReadStream('template/mail.html');
/*
  var data = {
    from: 'Shiatsunuad <shiatsunuadtai@gmail.com>',
    to: email,
    subject: 'Equilibrar tu calor interno con masaje con hierbas al vapor.',
    html: fileStream
  };

  mailgun.messages().send(data, function (error, body) {
    console.log(body);
  });
*/

  var mailcomposer = require('mailcomposer');

  var mail = mailcomposer({
    from: 'Shiatsunuad <shiatsunuadtai@gmail.com>',
    to: email,
    subject: 'Equilibrar tu calor interno con masaje con hierbas al vapor.',
    html: fileStream
  });

  mail.build(function(mailBuildError, message) {

      var dataToSend = {
          to: email,
          message: message.toString('ascii')
      };

      mailgun.messages().sendMime(dataToSend, function (sendError, body) {
          if (sendError) {
              console.log(sendError);
              return;
          } else {
            console.log(body);
          }
      });
  });
}
