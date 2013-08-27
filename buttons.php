<?php
$html = <<<HTML
<div data-role="page" id="page2">
	<div data-role="header">
		<h1>Testing App</h1>
	</div>
	<div data-role="content">
		<div data-role="collapsible-set" data-theme="c" data-content-theme="d">
			<div data-role="collapsible">
				<h3>Twitter</h3>
				<button onclick="twitterAvail();">Available</button>
				<button id="tweet" disabled="disabled" onclick="twitterTweet();">Tweet</button>
			</div>
			<div data-role="collapsible">
				<h3>Optimize</h3>
				<button onclick="doOptimize();">Do Optimize</button>
			</div>
			<div data-role="collapsible">
				<h3>Login</h3>
				<button onclick="login();">Login</button>
				<button onclick="login('silent', {'provider' : 'tpettytest','provider_id' : '12344321','email' : 'tpettytest@appmobi.com','screen_name' : 'Tony Petty'});">Silent Login</button>
				<button id="logout_button" onclick="logout();">Logout</button>
				<div id="message"></div>
			</div>
			<div data-role="collapsible" data-collapsed="false">
				<h3>1Touch</h3>
				<button onclick="onetouch();">Purchase</button>
				<button onclick="onetouch_restore();">Restore</button>
			</div>
			<div data-role="collapsible">
				<h3>Debug</h3>
				<button onclick="ddebug('debug message');">Send Debug Message</button>
			</div>
		</div>
	</div>
</div>
HTML;
echo $_GET['callback'] . '(' . json_encode($html) . ')';
?>
