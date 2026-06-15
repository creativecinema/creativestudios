<?php
// CreativeCinema – Kontaktformular-Handler.
// Versand via authentifiziertem one.com-SMTP (send.one.com:465, SSL).
// Zugangsdaten liegen in kontakt-config.php (NICHT im Git, per SFTP in den Webroot gelegt).
// Spamschutz ohne externen Dienst: Honeypot ("website") + Zeitfalle ("t").

$cfg = @include __DIR__ . '/kontakt-config.php';
if (!is_array($cfg)) $cfg = array();
$SMTP_HOST = isset($cfg['host']) ? $cfg['host'] : 'send.one.com';
$SMTP_PORT = isset($cfg['port']) ? (int)$cfg['port'] : 465;
$SMTP_USER = isset($cfg['user']) ? $cfg['user'] : '';
$SMTP_PASS = isset($cfg['pass']) ? $cfg['pass'] : '';
$MAIL_TO   = isset($cfg['to'])   ? $cfg['to']   : 'info@creative-cinema.net';
$REDIRECT  = '/#kontakt';

$ajax = (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'fetch')
     || (isset($_SERVER['HTTP_ACCEPT']) && strpos($_SERVER['HTTP_ACCEPT'], 'application/json') !== false);
$diagOn = !empty($_POST['diag']);

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

if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); respond(false, 'Methode nicht erlaubt.', $ajax, $REDIRECT); }

// Spamschutz: Honeypot leer + Zeitfalle (>= 3s, nur wenn JS-Zeitstempel gesetzt)
if (!empty($_POST['website'])) { respond(true, 'Danke!', $ajax, $REDIRECT); }
$ts = isset($_POST['t']) ? (int) $_POST['t'] : 0;
if ($ts > 0 && (round(microtime(true) * 1000) - $ts) < 3000) { respond(true, 'Danke!', $ajax, $REDIRECT); }

$name    = trim((string) (isset($_POST['name']) ? $_POST['name'] : ''));
$email   = trim((string) (isset($_POST['email']) ? $_POST['email'] : ''));
$phone   = trim((string) (isset($_POST['phone']) ? $_POST['phone'] : ''));
$subject = trim((string) (isset($_POST['subject']) ? $_POST['subject'] : ''));
$message = trim((string) (isset($_POST['message']) ? $_POST['message'] : ''));
$privacy = !empty($_POST['privacy']);

if ($name === '' || $message === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || !$privacy) {
  respond(false, 'Bitte füllen Sie Name, eine gültige E-Mail, Nachricht und das Datenschutz-Häkchen aus.', $ajax, $REDIRECT);
}
$name = mb_substr($name, 0, 120); $email = mb_substr($email, 0, 160); $phone = mb_substr($phone, 0, 60);
$subject = mb_substr($subject, 0, 160); $message = mb_substr($message, 0, 5000);
foreach (array($name, $email, $phone, $subject) as $v) {
  if (preg_match('/[\r\n]/', $v)) { respond(false, 'Ungültige Eingabe.', $ajax, $REDIRECT); }
}

// Bot-Test: Rechen-Challenge gegen HMAC-Token prüfen (fälschungssicher, serverseitig, stateless)
$secret  = isset($cfg['secret']) ? $cfg['secret'] : '';
if ($secret !== '') {
  $captcha = trim((string) (isset($_POST['captcha']) ? $_POST['captcha'] : ''));
  $ctok    = explode('.', (string) (isset($_POST['captcha_token']) ? $_POST['captcha_token'] : ''), 2);
  $cexp    = (isset($ctok[0]) && ctype_digit($ctok[0])) ? (int) $ctok[0] : 0;
  $csig    = isset($ctok[1]) ? $ctok[1] : '';
  if ($captcha === '' || $cexp < 1 || $csig === '') {
    respond(false, 'Bitte lösen Sie die Rechenaufgabe (Bot-Schutz).', $ajax, $REDIRECT);
  }
  if (time() > $cexp) {
    respond(false, 'Die Rechenaufgabe ist abgelaufen – bitte Seite neu laden und erneut senden.', $ajax, $REDIRECT);
  }
  if (!hash_equals($csig, hash_hmac('sha256', $captcha . '|' . $cexp, $secret))) {
    respond(false, 'Bot-Schutz: Die Rechenaufgabe wurde nicht korrekt gelöst.', $ajax, $REDIRECT);
  }
}

if ($SMTP_USER === '' || $SMTP_PASS === '') {
  respond(false, 'Versand derzeit nicht konfiguriert. Bitte schreiben Sie an ' . $MAIL_TO . '.', $ajax, $REDIRECT);
}

$body = "Neue Anfrage über creative-studios.tv\n"
      . "--------------------------------------\n\n"
      . "Name:           " . $name . "\n"
      . "E-Mail:         " . $email . "\n"
      . "Telefon:        " . ($phone !== '' ? $phone : '-') . "\n"
      . "Wunschtermin:   " . ($subject !== '' ? $subject : '-') . "\n\n"
      . "Nachricht:\n" . $message . "\n";

function mime_enc($s) { return '=?UTF-8?B?' . base64_encode($s) . '?='; }
$subjectHdr = mime_enc('[Anfrage] ' . ($subject !== '' ? $subject : 'Neue Anfrage über die Website'));
$fromHdr    = mime_enc('CreativeCinema Website');
$replyHdr   = mime_enc($name);

$diag = array();
$ok = smtp_send($SMTP_HOST, $SMTP_PORT, $SMTP_USER, $SMTP_PASS, $SMTP_USER, $fromHdr, $MAIL_TO, $email, $replyHdr, $subjectHdr, $body, $diag);

$okMsg  = 'Danke! Wir melden uns innerhalb von 24 Stunden.';
$errMsg = 'Senden fehlgeschlagen. Bitte schreiben Sie direkt an ' . $MAIL_TO . '.';
if (!$ok && $diagOn) { $errMsg .= ' [' . implode(' ', $diag) . ']'; }
respond($ok, $ok ? $okMsg : $errMsg, $ajax, $REDIRECT);

// --- Minimaler SMTP-Client (SSL, AUTH LOGIN) -------------------------------
function smtp_send($host, $port, $user, $pass, $from, $fromHdr, $to, $replyTo, $replyHdr, $subjectHdr, $body, &$diag) {
  $fp = @stream_socket_client('ssl://' . $host . ':' . $port, $errno, $errstr, 15);
  if (!$fp) { $diag[] = 'CONN:' . $errstr; return false; }
  stream_set_timeout($fp, 15);
  $get = function () use ($fp) {
    $d = '';
    while (($l = fgets($fp, 515)) !== false) { $d .= $l; if (strlen($l) >= 4 && $l[3] === ' ') break; }
    return $d;
  };
  $put = function ($c) use ($fp) { fwrite($fp, $c . "\r\n"); };
  $code = function ($r) { return substr(trim($r), 0, 3); };

  $r = $get(); $diag[] = 'GREET:' . $code($r);
  $put('EHLO creative-studios.tv'); $r = $get(); $diag[] = 'EHLO:' . $code($r);
  $put('AUTH LOGIN'); $r = $get(); $diag[] = 'AUTH:' . $code($r);
  $put(base64_encode($user)); $r = $get(); $diag[] = 'USER:' . $code($r);
  $put(base64_encode($pass)); $r = $get(); $diag[] = 'PASS:' . $code($r);
  if ($code($r) !== '235') { $put('QUIT'); fclose($fp); return false; }
  $put('MAIL FROM:<' . $from . '>'); $r = $get(); $diag[] = 'MAIL:' . $code($r);
  if ($code($r) !== '250') { $put('QUIT'); fclose($fp); return false; }
  $put('RCPT TO:<' . $to . '>'); $r = $get(); $diag[] = 'RCPT:' . $code($r);
  if (substr($code($r), 0, 1) !== '2') { $put('QUIT'); fclose($fp); return false; }
  $put('DATA'); $r = $get(); $diag[] = 'DATA:' . $code($r);
  $msg  = 'From: ' . $fromHdr . ' <' . $from . ">\r\n";
  $msg .= 'To: <' . $to . ">\r\n";
  $msg .= 'Reply-To: ' . $replyHdr . ' <' . $replyTo . ">\r\n";
  $msg .= 'Subject: ' . $subjectHdr . "\r\n";
  $msg .= "MIME-Version: 1.0\r\nContent-Type: text/plain; charset=UTF-8\r\nContent-Transfer-Encoding: 8bit\r\n";
  $msg .= 'Date: ' . date('r') . "\r\n\r\n" . $body;
  $msg = preg_replace('/(^|\r\n)\./', '$1..', $msg);
  fwrite($fp, $msg . "\r\n.\r\n"); $r = $get(); $diag[] = 'SEND:' . $code($r);
  $ok = ($code($r) === '250');
  $put('QUIT'); fclose($fp);
  return $ok;
}
