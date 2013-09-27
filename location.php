<?php
print_r($_SERVER);
switch ($_SERVER['REMOTE_ADDR']) {
case '66.202.133.210':
	$location = 'office';
	break;
default:
	$location = 'home';
	break;
}
echo $_GET['callback'] . '("' . $location . '");';
?>
