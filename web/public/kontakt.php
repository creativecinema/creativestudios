<?php
// CreativeCinema – Kontaktformular-Handler.
// Sendet Anfragen per Mail an info@creative-cinema.net.
// Spamschutz ohne externen Dienst: Honeypot ("website") + Zeitfalle ("t").
// Kein Tracking, keine Speicherung, keine Weitergabe an Dritte.

$TO             = 'info@creative-cinema.net';
$FROM           = 'noreply@creative-studios.tv';   // Absender = Host-Domain (SPF-konform)
$SUBJECT_PREFIX = '[creative-studios.tv] ';
$REDIRECT       = '/#kontakt';

$ajax = (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'fetch')
     || (isset($_SERVER['HTTP_ACCEPT']) && strpos($_SERVER['HTTP_ACCEPT'], 'application/json') !== false);

function respond($ok, $msg, $ajax, $redirect) {
  if ($ajax) {
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode(array('ok' => $ok, 'msg' => $msg));
  } else {
    $sep = (strpos($redirect, '?') !== false) ? '&' : '?';
    header('Location: ' . $redirect . $sep . 'sent=' . ($ok ? 'ok' : 'err'));
  }
  exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  respond(false, 'Methode nicht erlaubt.', $ajax, $REDIRECT);
}

// Spamschutz 1: Honeypot muss leer sein. Bots füllen es -> wir tun "erfolgreich", senden aber nichts.
if (!empty($_POST['website'])) {
  respond(true, 'Danke!', $ajax, $REDIRECT);
}

// Spamschutz 2: Zeitfalle. Wenn JS den Zeitstempel gesetzt hat und < 3s vergingen -> Bot.
$ts = isset($_POST['t']) ? (int) $_POST['t'] : 0;
if ($ts > 0 && (round(microtime(true) * 1000) - $ts) < 3000) {
  respond(true, 'Danke!', $ajax, $REDIRECT);
}

$name    = trim((string) ($_POST['name'] ?? ''));
$email   = trim((string) ($_POST['email'] ?? ''));
$phone   = trim((string) ($_POST['phone'] ?? ''));
$subject = trim((string) ($_POST['subject'] ?? ''));
$message = trim((string) ($_POST['message'] ?? ''));
$privacy = !empty($_POST['privacy']);

if ($name === '' || $message === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || !$privacy) {
  respond(false, 'Bitte füllen Sie Name, eine gültige E-Mail, Nachricht und das Datenschutz-Häkchen aus.', $ajax, $REDIRECT);
}

// Längen begrenzen
$name    = mb_substr($name, 0, 120);
$email   = mb_substr($email, 0, 160);
$phone   = mb_substr($phone, 0, 60);
$subject = mb_substr($subject, 0, 160);
$message = mb_substr($message, 0, 5000);

// Header-Injection verhindern (CR/LF in Kopffeldern)
foreach (array($name, $email, $phone, $subject) as $v) {
  if (preg_match('/[\r\n]/', $v)) {
    respond(false, 'Ungültige Eingabe.', $ajax, $REDIRECT);
  }
}

$body = "Neue Anfrage über creative-studios.tv\n"
      . "--------------------------------------\n\n"
      . "Name:           " . $name . "\n"
      . "E-Mail:         " . $email . "\n"
      . "Telefon:        " . ($phone !== '' ? $phone : '-') . "\n"
      . "Wunschtermin:   " . ($subject !== '' ? $subject : '-') . "\n\n"
      . "Nachricht:\n" . $message . "\n";

$headers  = 'From: CreativeCinema Website <' . $FROM . ">\r\n";
$headers .= 'Reply-To: ' . $name . ' <' . $email . ">\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "X-Mailer: creativestudios-contact\r\n";

$mailSubject = $SUBJECT_PREFIX . ($subject !== '' ? $subject : 'Neue Anfrage');
$ok = @mail($TO, $mailSubject, $body, $headers);

respond(
  $ok,
  $ok ? 'Danke! Wir melden uns innerhalb von 24 Stunden.' : 'Senden fehlgeschlagen. Bitte schreiben Sie direkt an info@creative-cinema.net.',
  $ajax,
  $REDIRECT
);
