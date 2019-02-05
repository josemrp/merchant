<?php 

require_once('functions.php');

function is_valid($data) {
  if (!isset($data->name) || strlen($data->name) < 3)
    apiResponse((object)['error' => 'Specify the name, please']);
  if (strlen($data->name) > 30)
    apiResponse((object)['error' => 'The name can not have more than 30 characters']);
  if (isset($data->quantity) && $data->quantity < 0)
    apiResponse((object)['error' => 'Invalid quantity']);
  if(isset($data->type) && !in_array($data->type, ['protein','carbohydrate','grease','vitamin', '']))
    apiResponse((object)['error' => 'The type must be '."'protein', 'carbohydrate', 'grease' or 'vitamin'"]);
  return true;
}

switch ($request->method) {
  case 'GET':
    if (isset($request->id)) {
      // Get one
      $sql = 'SELECT id, name, type, quantity FROM product
              WHERE id = ' . $conn->real_escape_string($request->id) . ' AND 
              deleted_at IS NULL';
      $result = $conn->query($sql);

      $product = $result->num_rows > 0 ? 
        $result->fetch_object() : 
        (object) ['error' => 'Product not found'];

      $result->close();
      apiResponse($product);
    } else {
      // Get all
      $products = [];

      $sql = 'SELECT product.id, product.quantity, product.name, price.price, price.inserted_at
              FROM product LEFT JOIN price ON product.id = price.fk_product
              WHERE product.deleted_at IS NULL';
      $result = $conn->query($sql);
      
      while ($product = $result->fetch_object()) {
        
        if (isset($products[$product->id])) {
          // Add other price
          $products[$product->id]->dates[] = strtotime($product->inserted_at);
          $products[$product->id]->prices[] = (float) $product->price;
        } else {
          // Store product
          $products[$product->id] = $product;
          $products[$product->id]->dates = [strtotime($product->inserted_at)];
          $products[$product->id]->prices = [(float) $product->price];
        }
      }
      $result->close();

      foreach ($products as &$product) {
        $product->price = linearRegression($product->dates, $product->prices, time());
        unset($product->dates, $product->prices);
      }
      
      apiResponse($products);
    }
    break;

  case 'POST':

    if(!is_valid($request)) exit();

    $name = $conn->real_escape_string($request->name);
    $quantity = isset($request->quantity) && $request->quantity != '' ? $conn->real_escape_string($request->quantity) : 0;
    $type = isset($request->type) && $request->type != '' ? "'".$request->type."'" : 'NULL';

    $sql = 'INSERT INTO product (name, quantity, type) VALUES ' . 
            "('$name', $quantity, $type)";
    $conn->query($sql);

    $id = $conn->insert_id;
    if($id == 0)
      apiResponse(['error' => 'This product already exists']);

    apiResponse((object) ['product_id' => $conn->insert_id]);
    break;

  case 'PUT':
  
    if (!isset($request->id) || $request->id < 0)
      apiResponse((object)['error' => 'Select one product']);
    if(!is_valid($request)) exit();

    $id = (int) $conn->real_escape_string($request->id);
    $name = $conn->real_escape_string($request->name);
    $quantity = isset($request->quantity) && $request->quantity != '' ? $conn->real_escape_string($request->quantity) : 0;
    $type = isset($request->type) && $request->type != '' ? "'".$request->type."'" : 'NULL';

    $sql = 'UPDATE product SET name = ' . "'$name'" . ' WHERE id = ' . $id . ';';
    $sql .= 'UPDATE product SET quantity = ' . $quantity . ' WHERE id = ' . $id . ';';
    $sql .= 'UPDATE product SET type = ' . $type . ' WHERE id = ' . $id . ';';
    
    $conn->multi_query($sql);

    apiResponse((object) ['success' => true]);
    break;

  case 'DELETE':

    if (!isset($request->id) || $request->id < 0)
      apiResponse((object)['error' => 'Select one product']);

    $id = (int) $conn->real_escape_string($request->id);
    $sql = 'UPDATE product SET deleted_at = CURRENT_TIMESTAMP WHERE id = ' . $id; // $sql = 'DELETE FROM product WHERE product.id = ' . $id;
    $conn->query($sql);

    apiResponse((object) ['success' => true]);
    break;

  default:
    apiResponse((object)['error' => 'Ivalid method']);
    break;
}

?>