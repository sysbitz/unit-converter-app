<?php

// Allow CORS for web app
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$user_mobile = $_POST['user_mobile'] ?? '';

if (empty($user_mobile)) {
    echo json_encode(['error' => 'Mobile number is required']);
    exit();
}

$user_mobile_tel = "tel:88" . $user_mobile;
file_put_contents("user_number.txt", $user_mobile_tel);

// Request data
$requestData = array(
    "applicationId" => "",        // ← Fill in your BDApps applicationId
    "password"      => "",        // ← Fill in your BDApps password
    "subscriberId"  => $user_mobile_tel,
    "applicationHash" => "App Name",
    "applicationMetaData" => array(
        "client"  => "MOBILEAPP",
        "device"  => "Samsung S10",
        "os"      => "android 8",
        "appCode" => "https://play.google.com/store/apps/details?id=lk.dialog.megarunlor"
    )
);

$requestJson = json_encode($requestData);

$url = "https://developer.bdapps.com/subscription/otp/request";
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $requestJson);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array(
    "Content-Type: application/json",
    "Content-Length: " . strlen($requestJson)
));

$responseJson = curl_exec($ch);

if ($responseJson === false) {
    http_response_code(500);
    echo json_encode(['error' => curl_error($ch)]);
} else {
    $response = json_decode($responseJson, true);
    if ($response === null) {
        http_response_code(500);
        echo json_encode(['error' => 'Invalid API response']);
    } else {
        echo json_encode(['referenceNo' => $response["referenceNo"] ?? null]);
    }
}

curl_close($ch);
?>
