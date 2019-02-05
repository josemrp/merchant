<?php 

/**
 * Get the predictive value of a pairs of values related
 * @param array $x array of x values
 * @param array $y array of y values
 * @param int $xp value you want to predict
 * @return int predicted value of $xp
 */
function linearRegression($x, $y, $xp)
{

    // Return if arrays are less than 2 values
  $count = count($x);
  if ($count === 0) {
    return 0;
  } else if ($count === 1) {
    return $y[0];
  }
    
    # Thanks "Calculo Numerico", this code is yours :)
    # $x = input('x: ');
    # $y = input('y: ');
    # $xp = input('xp: ');
  $n = $count;

  $s1 = 0;
  $s2 = 0;
  $s3 = 0;
  $s4 = 0;

  for ($i = 0; $i < $n; $i++) {
    $s1 = $s1 + $x[$i];
    $s2 = $s2 + $x[$i] * $x[$i];
    $s3 = $s3 + $y[$i];
    $s4 = $s4 + $y[$i] * $x[$i];
  }

  $promy = $s3 / $n;

  // Fix division by zero 
  $denominator = ($n * $s2 - $s1 * $s1);
  if ($denominator < 0.000001) {
    $denominator = 0.000001;
  }

  $a = ($s3 * $s2 - $s4 * $s1) / $denominator;
  $b = ($n * $s4 - $s1 * $s3) / $denominator;

  $yp = $a + $b * $xp;

  return $yp;

}


?>