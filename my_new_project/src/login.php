<?php
header('Access-Control-Allow-Origin: http://localhost:5173');
// Milyen metódusok engedélyezettek
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
// Milyen fejléceket engedélyezünk
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

// Ha OPTIONS kérést kapunk (preflight), nem csinálunk semmit, csak kilépünk
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}
$host = "localhost";
$username = "gribedli";
$password = "r56u7B6ZcH7sra9t";
$database = "videopost_hu";

$conn = new mysqli($host, $username, $password, $database);
if ($conn->connect_error) {
    die("Kapcsolódási hiba!");
}

$data = json_decode(file_get_contents("php://input"), true);
$username_input = $data["username"];
$password_input = $data["password"];

$sql = "SELECT password FROM users WHERE username = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $username_input);
$stmt->execute();
$stmt->store_result();
$stmt->bind_result($hashedPassword);
$stmt->fetch();

if ($stmt->num_rows > 0 && password_verify($password_input, $hashedPassword)) {
    echo "Sikeres bejelentkezés!";
} else {
    echo "Hibás felhasználónév vagy jelszó";
}

$stmt->close();
$conn->close();
?>
