<?php 

require_once('functions.php');

$num_prices = 5;

switch ($request->method) {
  case 'GET':
    if(isset($request->id)) {
      // Get one
      $sql = 'SELECT product.*, price.price, price.inserted_at AS price_inserted
              FROM product JOIN price ON product.id = price.fk_product
              WHERE product.id = '. $conn->real_escape_string($request->id);
      $result = $conn->query($sql);

      $product = [];
      while ($p = $result->fetch_object()) {
        $product[$p->id] = $p;
      }

      $result->close();
      apiResponse($product);
    } else {
      // Get all
      $products = [];

      $sql = 'SELECT * FROM product 
              JOIN price ON product.id = price.fk_product';
      $result = $conn->query($sql);

      while ($product = $result->fetch_object()) {
        if (isset($products[$product->id])) {
          if($products[$product->id]->price_index <= $num_prices) {
            // Update price to the average
            $new_price = $products[$product->id]->price * $products[$product->id]->price_index;
            $products[$product->id]->price_index++;
            $new_price = ($new_price + $product->price) / $products[$product->id]->price_index;
            $products[$product->id]->price = $new_price;
          }
        } else {
          // Store product
          $products[$product->id] = (object) [
            'id' => $product->id,
            'name' => $product->name,
            'quantity' => $product->quantity,
            'price' => $product->price,
            'price_index' => 1, // Yeah, start at one
          ];
        }
      }

      $result->close();
      apiResponse($products);
    }
    break;

  case 'POST':
        # code...
    break;

  case 'PUT':
        # code...
    break;

  case 'DELTE':
        # code...
    break;

  default:
    apiResponse((object) ['error' => 'Ivalid method']);
    break;
}

?>