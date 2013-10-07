<?php
switch ($_SERVER['REMOTE_ADDR']) {
case '108.176.92.204':
	$location = 'office';
	break;
default:
	$location = 'home';
	break;
}
echo $_GET['callback'] . '("' . $location . '");';
?>
