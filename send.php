<?php

# Include the Autoloader (see "Libraries" for install instructions)
require 'vendor/autoload.php';
use Mailgun\Mailgun;

$mgClient = new Mailgun('key-60153829e1a3844d37cb80320bf6aa89');
$domain = "salvadorp.com";

# Make the call to the client.
$result = $mgClient->sendMessage($domain, array(
  'from'    => 'Shiatsunuad <shiatsunuadtai@gmail.com>',
  'to'      => "salvador.palmiciano@gmail.com",
  'subject' => 'Equilibrar tu calor interno con masaje con hierbas al vapor.',
  'html'    => file_get_contents(__DIR__.'/template/mail.html')
));
