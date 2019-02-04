<?php

require_once('functions.php');

switch ($request->method) {
  case 'GET':
    if (!isset($request->productId))
      apiResponse(['error' => 'You must select a product']);

    $sql = 'SELECT id, price, inserted_at FROM price
            WHERE fk_product = ' . $conn->real_escape_string($request->productId);
    $result = $conn->query($sql);
    
    if($result->num_rows < 1) 
      apiResponse(['error' => 'Product not found']);
    
    $prices = [];
    while($price = $result->fetch_object()) {
      $prices[] = $price;
    }

    $result->close();
    apiResponse($prices);
    
    break;

  case 'POST':

    if (!isset($request->productId) || $request->productId < 0) 
      apiResponse(['error' => 'You must select a product']);
    if (!isset($request->price) || $request->price < 0)
      apiResponse(['error' => 'Invalid price']);

    $productId = (int) $conn->real_escape_string($request->productId);
    $price = (float) $conn->real_escape_string($request->price);

    $sql = 'INSERT INTO price (price, fk_product) VALUES ' . "($price, $productId)";
    $conn->query($sql);

    // Get new avg(price)
    $sql = 'SELECT price FROM price
            WHERE fk_product = ' . $productId;
    $result = $conn->query($sql);
    
    $prices = 0;
    $index = 0;
    while ($price = $result->fetch_object()) {
      $prices += $price->price;
      $index++;
    }

    $result->close();

    if($index)
      apiResponse(['newPrice' => ($prices/$index)]);
    else
      apiResponse(['error' => 'Price not inserted']);

    break;
}

?>