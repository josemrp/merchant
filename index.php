<?php

if(isset($_POST['merchant-firewall']) && $_POST['merchant-firewall'] === 'demo') {
  session_start();
  $_SESSION['login'] = true;
  include('index.html');
  exit();
}

?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Merchant</title>
  <!-- CSS -->
  <link rel="stylesheet"
    href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css"
    integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS"
    crossorigin="anonymous">
</head>
<body>
  <form action="" method="POST" autocomple="nope"
    class="my-5 py-5 mx-auto w-50 text-center text-black-50 text-monospace">
    <div class="form-group">
      <label for="merchant-firewall" class="col-form-label">Firewall</label>
      <input type="password" name="merchant-firewall" autocomple="nope"
        class="form-control" autofocus required>
    </div>
  </form>
</body>
</html>