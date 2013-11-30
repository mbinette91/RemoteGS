<div id="content-container">
	<div id="content">
		<div class="logo-gs"></div>
		<div class="uid-step">
			<p class="connect_info">Enter the code found from the remote.GS menu on grooveshark.com to pair additional devices.</p>
			<input data-role="none" placeholder="Grooveshark code" type="number" name="guid_input" id="guid_input" value="" />
		</div>
		<div class="password-step">
			<p class="connect_info">This client is protected with a password, enter it to continue.</p>
			<input data-role="none" placeholder="Remote.GS password" type="password" name="password_input" id="password_input" value="" />
		</div>
		<div id="connect">Pair device</div>
		<div id="cancel" class="goto" href="/">Cancel</div>
	</div>
</div>

<div class="prototype" type="javascript" cmd="init" js-class="ConnectPage" body-class="<?PHP echo $VIEW->BODY_CLASS; ?>" title="<?PHP echo $VIEW->TITLE; ?>"></div>