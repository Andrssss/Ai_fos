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
// Ha az email mezőt használod, de a táblában nincs, azt kihagyhatod
// $email = $data["email"];
$password_hashed = password_hash($data["password"], PASSWORD_BCRYPT);

$sql = "INSERT INTO users (username, password) VALUES (?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $username_input, $password_hashed);

if ($stmt->execute()) {
    echo "Sikeres regisztráció!";
} else {
    echo "Hiba a regisztráció során.";
}

$stmt->close();
$conn->close();
?>
