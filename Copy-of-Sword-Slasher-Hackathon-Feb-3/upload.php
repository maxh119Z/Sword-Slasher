<!DOCTYPE html>
<html>
<head>
    <title>Survey Result</title>
</head>
<body>

<h2>Survey Result</h2>

  <?php
  if(isset($_POST['submit'])) {
      $file = $_FILES['file'];

      // File properties
      $file_name = $file['name'];
      $file_tmp = $file['tmp_name'];
      $file_size = $file['size'];
      $file_error = $file['error'];

      // Check file extension
      $file_ext = strtolower(end(explode('.', $file_name)));
      $allowed_extensions = array('jpg', 'jpeg', 'png', 'gif');

      if (in_array($file_ext, $allowed_extensions)) {
          if ($file_error === 0) {
              if ($file_size < 2097152) { // Max file size in bytes (2MB)
                  $file_destination = 'uploads/' . $file_name;
                  move_uploaded_file($file_tmp, $file_destination);

                  // Display the uploaded image/gif in the div
                  echo "<script>document.getElementById('thingy').innerHTML = '<img src=\"$file_destination\" alt=\"Uploaded Image/GIF\">';</script>";
              } else {
                  echo "File is too large.";
              }
          } else {
              echo "Error uploading file.";
          }
      } else {
          echo "Invalid file type. Only JPG, JPEG, PNG, and GIF files are allowed.";
      }
  }
  ?>

</body>
</html>