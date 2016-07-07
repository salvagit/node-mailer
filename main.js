'use stricts';

/**
 * @todo implements eventemmiter.
 * @todo implements mustache.
 * @todo implements actions parameters.
 */

var fs = require('fs'),
    mailcomposer = require('mailcomposer');
var conf = JSON.parse(fs.readFileSync('config.json', 'utf8'));
var mailgun = require('mailgun-js')({apiKey: conf.mg.api_key, domain: conf.mg.domain});
// contacts file.
var contacts = "contacts/v2/contacts.csv";
// declare empty arrays.
var validEmails = [], invalidEmails = [], uniqueEmails = [], recipientVars = [];
// get template.
var fileStream = fs.createReadStream('template/silla/mail.html');

fs.readFile(contacts, function (err, data) {
   if (err) return console.error(err);
   else {
     parseData(data)
     .then(function() {
       /**
       * Send Mail.
       */
       // send(validEmails, recipientVars);
       // send('s@salva.io');

       //console.log(uniqueEmails.slice(0,999).toString, recipientVars.slice(0,999).toString());

       // console.log(JSON.parse(uniqueEmails.slice(0,999)), JSON.parse(recipientVars.slice(0,999).toString()));

       /** /
       send(uniqueEmails.slice(0,999).toString(), recipientVars.slice(0,999).toString())
       .then(function(){
         send(uniqueEmails.slice(1000,1999).toString(), recipientVars.slice(1000,1999).toString());
       })
       .then(function() {
         send(uniqueEmails.slice(2000,2999).toString(), recipientVars.slice(2000,2999).toString());
       })
       .then(function() {
         send(uniqueEmails.slice(3000,3999).toString(), recipientVars.slice(3000,3999).toString());
       })
       .then(function() {
         send(uniqueEmails.slice(4000, 4006).toString(), recipientVars.slice(4000, 4006).toString());
       })
       .then(function() {
         console.log('i know promises.');
       });
       /**/

       var arr = ['s@salvadorp.com','s@salva.io','spalmiciano@panareadigital.com'];
       // console.log('chancleta');
/*
       arr.map(function (mail) {
         console.log(mail);
       });
*/
      var promiseFor = Promise.method(function(condition, action, value) {
          if (!condition(value)) return value; console.log(1);
          return action(value).then(promiseFor.bind(null, condition, action)); console.log(2);
      });

      var promiseWhile = Promise.method(function(condition, action) {
          if (!condition()) return;
          return action().then(promiseWhile.bind(null, condition, action));
      });

      promiseWhile(function(count) {
console.log(count);
          return count < arr.length;
      }, function(count) {
          return console.log(arr[count])
                   .then(function(res) {
                       logger.log(res);
                       return ++count;
                   });
      }, 0).then(console.log.bind(console, 'all done'));

/*
       for (var i = 0; i < arr.length; i++) {
         console.log(arr[i]);
         send(arr[i]).then();
       }
*/
       // send(['s@salvadorp.com','s@salva.io','spalmiciano@panareadigital.com'].toString());

     });
    }
});

function parseData (data) {

  return new Promise(function(resolve, reject) {

    var sdata = data.toString(),
    lines = sdata.split('\n');

    // get emails
    for (var i in lines) { getEmails(lines[i]); }
    uniqueEmails = validEmails.filter(function(elem, pos) {
      return validEmails.indexOf(elem) == pos;
    });

    console.log('validEmails: ' + validEmails.length);
    console.log('uniqueEmails: ' + uniqueEmails.length);
    console.log('invalidEmails: ' + invalidEmails.length);

    for (var k in uniqueEmails) {
      var m = uniqueEmails[k].replace(/\0/g, '');
      recipientVars[m] = {id : +k + 1};
    }

    resolve();
  });

}

function getEmails (line) {
  function validateEmail (email) {
    var re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    return re.test(email);
  }
  var sline = line.split(',');
  for (var i in sline) {
    if (sline[i].indexOf('@') > -1) {
      var email = sline[i].replace(/\0/g, '');
      if (validateEmail(email)) validEmails.push(email);
      else invalidEmails.push(email);
    }
  }
}
function send (email, recipientVars) {

  return new Promise(function(resolve, reject) {

    var mail = mailcomposer({
      from: conf.email.from,
      to: '<>',
      bco: email,
      subject: conf.email.subject,
      html: fileStream
    });

    mail.build(function(mailBuildError, message) {

        var dataToSend = {
            to: '<>',
            bco: email,
            message: message.toString('ascii')
        };
        if (recipientVars) dataToSend['recipient-variables'] = JSON.stringify(recipientVars);

        mailgun.messages().sendMime(dataToSend, function (sendError, body) {
            if (sendError) {
                console.error(sendError);
                return reject(sendError);
            } else {
              console.log(body);
              return resolve(body);
            }
        });

    });
  });
}
