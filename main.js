
var fs = require('fs');

var contacts = "contacts/compre1.csv";

var validEmails = [],
    invalidEmails = [];

fs.readFile(contacts, function (err, data) {

   if (err) return console.error(err);

   var sdata = data.toString(),
       lines = sdata.split('\n');

   for (var i in lines) {
     getVals(lines[i]);
   }

   var uniqueEmails = validEmails.filter(function(elem, pos) {
     return validEmails.indexOf(elem) == pos;
   });

   console.log(validEmails.length);
   console.log(invalidEmails.length);
   console.log(uniqueEmails.length);

   for (var i in uniqueEmails) {
     console.log(uniqueEmails[i]);
   }
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
