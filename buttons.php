<?php
$html = <<<HTML
<div data-role="page" id="page2">
	<div data-role="header" data-position="fixed">
		<h1 id="headertxt"></h1>
	</div>
	<div data-role="content">
		<div id="buttons_accordion" data-role="collapsible-set" data-theme="c" data-content-theme="d">
			<div data-role="collapsible" data-collapsed="true">
				<h3>Facebook</h3>
				<button onclick="facebook_friends();">get friends</button>
			</div>
			<div data-role="collapsible" data-collapsed="true">
				<h3>Leaderboards</h3>
				<button onclick="leaderboards_getPlayerScore();">getPlayerScore</button>
				<button onclick="leaderboards_save();">save</button>
				<button onclick="leaderboards_getRange();">getRange</button>
			</div>
			<div data-role="collapsible" data-collapsed="true">
				<h3>Achievements</h3>
				<button onclick="achievements_earn();">Earn</button>
				<button onclick="achievements_check();">Check</button>
				<button onclick="achievements_get('light_snack');">Get (light_snack)</button>
				<button onclick="achievements_get();">Get (random)</button>
			</div>
			<div data-role="collapsible" data-collapsed="true">
				<h3>Appdata</h3>
				<button onclick="appdata_save();">Save</button>
				<button onclick="appdata_get();">Get</button>
				<button onclick="appdata_getall();">Get All</button>
				<button onclick="appdata_deletekey();">Delete Key</button>
				<button onclick="appdata_deleteall();">Delete All</button>
			</div>
			<div data-role="collapsible" data-collapsed="true">
				<h3>Twitter</h3>
				<button onclick="twitterAvail();">Available</button>
				<button id="tweet" disabled="disabled" onclick="twitterTweet();">Tweet</button>
			</div>
			<div data-role="collapsible" data-collapsed="true">
				<h3>Optimize</h3>
				<button onclick="doOptimize();">Do Optimize</button>
				<button onclick="doFakePush();">Fake Push</button>
			</div>
			<div data-role="collapsible" data-collapsed="true">
				<h3>Push</h3>
				<form>
					<fieldset data-role="controlgroup" data-type="horizontal">
						<input type="checkbox" name="inc_bundle" id="inc_bundle">
						<label for="inc_bundle">Include EOBundle</label>
					</fieldset>
				</form>
				<button onclick="doWyleiPush();">Do Push</button>
				<button onclick="AppMobi.notifications.refreshPushNotifications(); alert('did refresh');">Refresh</button>
			</div>
			<div id="login_section" data-role="collapsible" data-collapsed="true">
				<h3>Login</h3>
				<button onclick="login();">Login</button>
				<button onclick="login('silent', {'provider' : 'tpettytest','provider_id' : '12344321','email' : 'tpettytest@appmobi.com','screen_name' : 'Tony Petty'});">Silent Login</button>
				<button id="logout_button" onclick="logout();">Logout</button>
				<div id="message"></div>
			</div>
			<div data-role="collapsible" data-collapsed="true">
				<h3>1Touch</h3>
				<button onclick="onetouch();">Purchase</button>
				<button onclick="onetouch_restore();">Restore</button>
			</div>
			<div data-role="collapsible" data-collapsed="true">
				<h3>Debug</h3>
				<button onclick="ddebug('debug message'); alert('sent');">Send Debug Message</button>
			</div>
		</div>
	</div>
	<div data-role="footer" data-position="fixed">
		<h4 id="buttons_footer">
			Loading...
		</h4>
	</div>
</div>
HTML;
echo $_GET['callback'] . '(' . json_encode($html) . ')';
?>
