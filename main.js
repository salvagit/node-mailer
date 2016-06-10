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
var contacts = "contacts.csv";
// declare empty arrays.
var validEmails = [], invalidEmails = [], uniqueEmails = [], recipientVars = [];
// get template.
var fileStream = fs.createReadStream('template/mail.html');

fs.readFile(contacts, function (err, data) {
   if (err) return console.error(err);
   else parseData(data);
});

/**
* Send Mail.
*/
// send(validEmails, recipientVars);

function parseData (data) {
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
      to: email,
      subject: conf.email.subject,
      html: fileStream
    });

    mail.build(function(mailBuildError, message) {

        var dataToSend = {
            to: email,
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
