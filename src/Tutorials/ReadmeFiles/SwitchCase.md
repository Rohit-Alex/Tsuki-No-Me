SWITCH CASE

1> The switch has one or more case blocks and an optional default.
2> The value of variable is checked for a strict equality.
3> If the equality is found, switch starts to execute the code starting from the corresponding case, until the nearest break (or until the end of switch).
4> If no case is matched then the default code is executed (if it exists).
5> For grouping cases ->
  case 'mango': 
  case 'pineapple':
    alert('Fruits!');
    break;