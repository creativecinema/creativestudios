<?php
// Erzeugt eine zufällige Rechenaufgabe + fälschungssicheres HMAC-Token (stateless).
// Das Token signiert die KORREKTE Antwort; kontakt.php prüft die eingegebene Antwort dagegen.
// Secret liegt in kontakt-config.php (serverseitig, nicht im Git).
header('Content-Type: application/json; charset=UTF-8');
header('Cache-Control: no-store');
$cfg = @include __DIR__ . '/kontakt-config.php';
$secret = (is_array($cfg) && !empty($cfg['secret'])) ? $cfg['secret'] : '';
if ($secret === '') { echo json_encode(array('q' => '', 'token' => '')); exit; }
$a = random_int(2, 9);
$b = random_int(2, 9);
$answer = $a + $b;
$exp = time() + 1800; // 30 Minuten gültig
$sig = hash_hmac('sha256', $answer . '|' . $exp, $secret);
echo json_encode(array('q' => $a . ' + ' . $b, 'token' => $exp . '.' . $sig));
