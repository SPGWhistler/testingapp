<?php
switch ($_SERVER['REMOTE_ADDR']) {
case '67.241.136.186':
case '108.176.92.251':
case '66.202.133.210':
	$location = 'office';
	break;
case '23.30.219.169':
	$location = 'office2';
	break;
default:
	$location = 'home';
	break;
}
echo $_GET['callback'] . '("' . $location . '");';
?>
