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

$date_ = date("Y-m-d h:i:sa");

$user_otp    = $_POST['Otp']         ?? '';
$referenceNo = $_POST['referenceNo'] ?? '';

if (empty($user_otp) || empty($referenceNo)) {
    echo json_encode(['error' => 'OTP and referenceNo are required']);
    exit();
}

try {
    $myfile = fopen("OTP+RefNo.txt", "a+") or die("Unable to open file!");
    fwrite($myfile, "OTP:" . $user_otp . " RefNo:" . $referenceNo . " Date:" . $date_ . "\n");
    fclose($myfile);
} catch (Exception $e) {
    // Log silently
}

// Request data
$requestData = array(
    "applicationId" => "",   // ← Fill in your BDApps applicationId
    "password"      => "",   // ← Fill in your BDApps password
    "referenceNo"   => $referenceNo,
    "otp"           => $user_otp
);

$requestJson = json_encode($requestData);

$url = "https://developer.bdapps.com/subscription/otp/verify";
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
        echo json_encode(['subscriptionStatus' => $response["subscriptionStatus"] ?? null]);
    }
}

curl_close($ch);
?>
