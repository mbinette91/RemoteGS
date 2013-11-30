<div id="content-container">
	<div id="content" data-role="content">
		<a class="goto help_button" href="/index/tutorial">Tutorial</a>
		<a class="goto connect_button" href="/index/pairing">Pair a new device</a>
		<div class="logo-gs"></div>
		<div class="clear"></div>
		<div class="device_list list-grooveshark">
			<p class="title">Active browsers</p>
			<p class="device item prototype goto" href="/remote/playlist" uid="{UID}">{NAME}</p>
		</div>
	</div>
</div>

<div class="prototype" type="javascript" cmd="init" js-class="IndexPage" body-class="<?PHP echo $VIEW->BODY_CLASS; ?>" title="<?PHP echo $VIEW->TITLE; ?>"></div>