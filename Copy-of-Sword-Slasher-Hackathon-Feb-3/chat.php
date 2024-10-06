<?php
// Get the username from the POST request
$message = isset($_POST['username']) ? $_POST['username'] : '';

// Validate username
if (!empty($message)) {
    // File path where the username will be stored
    $filename = 'chat.txt';

    // Append username to the file
    file_put_contents($filename, $message . "\n", FILE_APPEND | LOCK_EX);

    echo "Chat Message Sent";
} else {
    echo "Uh oh. You stopped Existing";
}
?>