<?php
$html = <<<HTML
<html>
<head><title></title></head>
<body>
<script>
$("#page2").on("pagecreate", function() {
	var d, od, ds;
	d = new Date();
	od = new Date();
	ds = __testApp.settings.build_date;
	od.setDate(ds.substr(0, 2));
	od.setMonth((ds.substr(3, 2) - 1));
	od.setFullYear(ds.substr(6, 4));
	if (d.getFullYear() !== od.getFullYear()
			|| d.getMonth() !== od.getMonth()
			|| d.getDate() !== od.getDate()) {
		$('#buttons_footer').css('background-image', 'linear-gradient(#3c3c3c,#640000)');
	} else {
		$('#buttons_footer').css('background-image', 'linear-gradient(#3c3c3c,#0B8800)');
	}
	ds = __testApp.settings.html_build_date;
	od.setDate(ds.substr(0, 2));
	od.setMonth((ds.substr(3, 2) - 1));
	od.setFullYear(ds.substr(6, 4));
	if (d.getFullYear() !== od.getFullYear()
			|| d.getMonth() !== od.getMonth()
			|| d.getDate() !== od.getDate()) {
		$('#buttons_header').css('background-image', 'linear-gradient(#3c3c3c,#640000)');
	} else {
		$('#buttons_header').css('background-image', 'linear-gradient(#0B8800,#3c3c3c)');
	}
	$('#buttons_footer h4').html(__testApp.build());
});
</script>
<div data-role="page" id="page2">
	<div id="buttons_header" data-role="header" data-position="fixed">
		<h1 id="headertxt"></h1>
	</div>
	<div data-role="content">
		<div id="buttons_accordion" data-role="collapsible-set" data-theme="c" data-content-theme="d">
			<div data-role="collapsible" data-collapsed="true">
				<h3>Facebook</h3>
				<button onclick="facebook_friends();">get friends</button>
				<div data-role="collapsible" data-collapsed="true">
					<h3>Choose a friend...</h3>
					<ol data-role="listview" data-filter="true" id="fbfriendslist">
					</ol>
				</div>
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
				<fieldset data-role="controlgroup" id="optimizer_events">
					<input type="radio" name="event" id="rctwitter" value="twitter" checked="checked">
					<label for="rctwitter">Twitter</label>
					<input type="radio" name="event" id="rcfbpost" value="fbpost">
					<label for="rcfbpost">Facebook Post</label>
					<input type="radio" name="event" id="rcfblike" value="fblike">
					<label for="rcfblike">Facebook Like</label>
					<input type="radio" name="event" id="rcrate" value="rate">
					<label for="rcrate">Rate App</label>
					<input type="radio" name="event" id="rcad" value="ad">
					<label for="rcad">Ad</label>
					<input type="radio" name="event" id="rclogin" value="login">
					<label for="rclogin">Login</label>
				</fieldset>
				<button onclick="doOptimize();">Do Optimize</button>
				<button onclick="doOptimize(); doOptimize();">Do Optimize Twice</button>
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
				<button onclick="reload_me();">Reload jsfunc.js</button>
				<button onclick="reload_page();">Reload This Page</button>
			</div>
		</div>
	</div>
	<div id="buttons_footer" data-role="footer" data-position="fixed">
		<h4>
			Loading...
		</h4>
	</div>
</div>
</body>
</html>
HTML;
if (isset($_GET['callback'])) {
	echo $_GET['callback'] . '(' . json_encode($html) . ')';
} else {
	echo $html;
}
?>
