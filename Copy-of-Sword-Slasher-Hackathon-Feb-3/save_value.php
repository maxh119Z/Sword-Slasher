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

  $all_ids = explode("\n",file_get_contents("leaderboard.txt"));
  // Validate username
  if (!empty($username)&&!in_array($username,$all_ids)) {
      // File path where the username will be stored
      $filename = 'leaderboard.txt';

      // Append username to the file
      file_put_contents($filename, $username . "\n", FILE_APPEND | LOCK_EX);

      echo "Username '$username' saved successfully!";
  } else {
      echo "Error: Username is empty or already exists";
  }
  ?>

</body>
</html>