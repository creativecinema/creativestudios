<?php
// VORLAGE — die echte Datei heißt kontakt-config.php und liegt im WEBROOT auf dem Server
// (per SFTP hochgeladen, NICHT im Git). Sie liefert kontakt.php die one.com-SMTP-Zugangsdaten.
return array(
  'host' => 'send.one.com',
  'port' => 465,                              // SSL
  'user' => 'kontakt@creative-studios.tv',    // Absender-Postfach (auf one.com angelegt)
  'pass' => 'DEIN-SMTP-PASSWORT',
  'to'   => 'info@creative-cinema.net',        // Empfänger der Formular-Anfragen
);
