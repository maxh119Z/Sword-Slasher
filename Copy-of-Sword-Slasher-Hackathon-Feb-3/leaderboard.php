<!DOCTYPE html>
<html>
<head>
    <title>Survey Result</title>
</head>
<body>

<h2>Survey Result</h2>

  <?php


  // Get the username from the POST request
  $username = isset($_POST['username']) ? $_POST['username'] : '';

  // Validate username
  if (!empty($username)) {
      // File path where the username will be stored
      $filename = 'leaderboard.txt';

      // Append username to the file
      file_put_contents("leaderboard.txt", "");
      file_put_contents($filename, $username . "\n", FILE_APPEND | LOCK_EX);

      echo "Username '$username' saved successfully!";
  } else {
      echo "Error: Username is empty or already exists";
  }
  ?>

</body>
</html>