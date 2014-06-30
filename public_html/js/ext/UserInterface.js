},{}],4:[function(require,module,exports){
(function() {
	var Ui, config, _ref, _ref1, _ref2,
		__hasProp = {}.hasOwnProperty,
		__extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
		__bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

	config = require('./config.coffee');
	
	Ui = (function(_super) {
		__extends(Ui, _super);

		function Ui() {
			this.connected = false;
			this.already_connected = false;
			_ref = Ui.__super__.constructor.apply(this, arguments);
			return _ref;
		}

		Ui.prototype.className = 'user-asset';

		Ui.prototype.id = 'remote-settings-group';

		Ui.prototype.connected = false;

		Ui.prototype.events = {
			'mouseenter #remote-settings-button': 'showSettingsDropdown'
		};

		Ui.prototype.initialize = function(connected) {
			var _this = this;
			this.connected = connected || false;
			this.already_connected = false;
			GS.on('remote:connect remote:reconnect', function() {
				_this.connected = true;
				return _this.updateText();
			});
			GS.on('remote:reconnecting', function() {
				_this.connected = false;
				return _this.updateText();
			});
			GS.on('remote:already-connected', function() {
				_this.already_connected = true;
				return _this.updateText();
			});
			GS.on('remote:disconnect', function() {
				_this.connected = false;
				return _this.updateText();
			});
			$('#header-user-assets').append(this.render().$el);
			return this.updateText();
		};

		Ui.prototype.updateText = function() {
			var text;
			text = 'Connecting...';
			if (this.connected && GSR.getGroovesharkClient()) {
				text = 'Remote.GS ID: '+GSR.getGroovesharkClient().uid+'';
			}
			if (this.already_connected) {
				text = 'Already connected';
			}
			return $('#remote-settings-button .title').text(text);
		};

		Ui.prototype.render = function(evt) {
			this.$el.html('<style>#header-left{width:20% !important;}#header-right{width:45% !important;}</style><a id="remote-settings-button" style="position: relative;display: block;height: 19px;margin-right: 0px;margin-top: 15px;padding: 0 5px;background: none;outline: none;"><span class="title" style="display: inline-block;height: 19px;padding: 0 0 0 0px;margin-right: 2px;float: left;font-size: 12px;font-weight: bold;color: #BBB;text-shadow: 0 1px 0px rgba(0, 0, 0, 0.7);line-height: 19px;">Connecting...</span><span class="caret" style="top: 9px;display: inline-block;float: left;border-top-color: #BBB" /></a>');
			this.updateText();
			return this;
		};

		Ui.prototype.updateDataMenu = function() {
			var client = GSR.getGroovesharkClient();
			$('#remote-clientname').html((client != null)? client.name : '');
			$('#remote-activated').html(((client != null && client.activated)? 'Deactivate' : 'Activate'));
			$('#remote-haspassword').html(((client != null && client.hasPassword)? 'YES' : 'NO'));
		};
		
		Ui.prototype.updateSettingsMenu = function() {
			var _this = this;
			var items, opts;
			this.settingsMenuOptions = {
				delay: 0,
				notchSize: 6,
				notchX: 16,
				width: 170,
				x: 1,
				y: 30,
				$attached: $('#remote-settings-button .title'),
				tooltipClass: 'menu user-menu'
			};
			var client = GSR.getGroovesharkClient();
			items = [];
			items.push({
				title: '<span id="remote-activated">Deactivate</span> remotes',
				click: function() {
					client.triggerActivated();
					_this.updateDataMenu();
				}
			});
			items.push({
				title: 'Change name'+((client != null)? ' (<span id="remote-clientname"></span>)': ''),
				click: function() {
					return GS.trigger('lightbox:open', 'changename');
				}
			});
			items.push({
				title: 'Change password'+((client != null)? ' (Using: <span id="remote-haspassword"></span>)': ''),
				click: function() {
					return GS.trigger('lightbox:open', 'changepassword');
				}
			});
			opts = {};
			opts.items = items;
			if (this.settingsMenuTooltip) {
				return this.settingsMenuTooltip.updateMenuOptions(opts.items);
			} else {
				this.settingsMenuTooltip = new GS.Views.Tooltips.Menu(opts);
				this.settingsMenuOptions.views = [this.settingsMenuTooltip];
				return this.settingsMenuOptions.tooltipKey = 'gsr-menu';
			}
		};

		Ui.prototype.showSettingsDropdown = function(evt) {
			var button, _ref1, _ref2;
			if (((_ref1 = this.settingsMenuTooltip) != null ? (_ref2 = _ref1.openDfd) != null ? _ref2.state() : void 0 : void 0) === "pending") {
				return;
			}
			if (!this.settingsMenuTooltip) {
				this.updateSettingsMenu();
			}
			button = $(evt.currentTarget);
			$.hideJJMenu();
			button.addClass('active');
			this.settingsMenuOptions.dfd = $.Deferred();
			GS.trigger('tooltip:open', this.settingsMenuOptions);
			this.updateDataMenu();
			this.settingsMenuTooltip.openDfd = this.settingsMenuOptions.dfd;
			return this.settingsMenuTooltip.openDfd.always(function() {
				return button.removeClass('active');
			});
		};
		
		$('#gsr-settings-group').hide();
		setInterval(function(){$('#gsr-settings-group').hide()}, 2500);

		return Ui;

	})(Backbone.View);

	GS.Views.Lightboxes.Changename = (function(_super) {
		__extends(Changename, _super);

		function Changename() {
			_ref1 = Changename.__super__.constructor.apply(this, arguments);
			return _ref1;
		}

		Changename.prototype.events = {
			'click #lightbox-footer .submit': 'onStageSubmit',
			'submit form': 'onStageSubmit',
		};

		Changename.prototype.type = 'changename';

		Changename.prototype.initialize = function() {
			Changename.__super__.initialize.call(this);
			this.currentStage = 'firstrun';
			this.onStageChange();
		};

		Changename.prototype.render = function() {
			Changename.__super__.render.call(this);
			this.$el.html($('<form>\n		<div id="lightbox-header">\n				<h2 class="title">Change this computer\'s name</h2>\n				<a id="lightbox-close" class="close btn btn-rounded btn-icon-only btn-dark"><i class="icon icon-ex-white-outline"></i></a>\n		</div>\n		<div id="lightbox-content">\n				<div id="lightbox-content-block">\n						<div id="name-stage-success" class="hide" style="margin: 2em;">\n								<h2 style="text-align: center;">Your name has been changed!</h2>\n						</div>\n						\n						<div id="name-stage-change" style="margin: 1em;">\n								<label for="gsr-name" style="text-align: center">Enter your new name (Pleae use only letters, numbers and spaces):</label>\n								<div style="width: 100%; text-align: center">\n										<input style="font-size: 4em;width: 7em;height:auto;text-align: center;margin: 10px;color: black;" type="text" id="gsr-name" name="gsr-name" maxlength="25" />\n								</div>\n						</div>\n				</div>\n		</div>\n		<div id="lightbox-footer">\n				<div id="lightbox-footer-right" class="right">\n						<a class="btn btn-large btn-primary submit">Done</a>\n				</div>\n				<div id="lightbox-footer-left" class="left" />\n		</div>\n		<button type="submit" class="hide"></button>\n</form>'));
			$('#gsr-name').focus();
			return GS.trigger("lightbox:rendered");
		};var client = GSR.getGroovesharkClient();

		Changename.prototype.onStageSubmit = function() {
			var name;
			switch (this.currentStage) {
				case 'firstrun':
					name = $('#gsr-name')[0].value;
					var pattern = /^[A-Za-z0-9' _?!-]{1,25}$/g;
					if (name === '' || !pattern.test(name)) {
						return false;
					}
					GSR.getGroovesharkClient().setName(name);
					this.currentStage = 'success';
					this.onStageChange();
					break;
				case 'success':
					GS.trigger('lightbox:close');
			}
			return false;
		};

		Changename.prototype.onStageChange = function() {
			switch (this.currentStage) {
				case 'firstrun':
					$('#name-stage-change').removeClass('hide');
					return $('#lightbox-footer .submit').removeClass('hide').text = 'Next';
				case 'success':
					$('#name-stage-change').addClass('hide');
					$('#name-stage-success').removeClass('hide');
					$('#lightbox-footer .submit').removeClass('hide').text = 'Done';
					return setTimeout((function() {
						return GS.trigger('lightbox:close');
					}), 2000);
			}
		};

		return Changename;

	})(GS.Views.Lightboxes.Base);

	GS.Views.Lightboxes.Changepassword = (function(_super) {
		__extends(Changepassword, _super);

		function Changepassword() {
			_ref1 = Changepassword.__super__.constructor.apply(this, arguments);
			return _ref1;
		}

		Changepassword.prototype.events = {
			'click #lightbox-footer .submit': 'onStageSubmit',
			'submit form': 'onStageSubmit',
		};

		Changepassword.prototype.type = 'changepassword';

		Changepassword.prototype.initialize = function() {
			Changepassword.__super__.initialize.call(this);
			this.currentStage = 'firstrun';
			this.onStageChange();
		};

		Changepassword.prototype.render = function() {
			Changepassword.__super__.render.call(this);
			this.$el.html($('<form>\n		<div id="lightbox-header">\n				<h2 class="title">Change this computer\'s password</h2>\n				<a id="lightbox-close" class="close btn btn-rounded btn-icon-only btn-dark"><i class="icon icon-ex-white-outline"></i></a>\n		</div>\n		<div id="lightbox-content">\n				<div id="lightbox-content-block">\n						<div id="password-stage-success" class="hide" style="margin: 2em;">\n								<h2 style="text-align: center;">Your password has been changed!</h2>\n						</div>\n						\n						<div id="password-stage-change" style="margin: 1em;">\n								<label for="gsr-password" style="text-align: center">Enter your new password (Warning: If you change your password, all the pairings between you and remotes will be cleared):</label>\n								<div style="width: 100%; text-align: center">\n										<input style="font-size: 4em;width: 7em;height:auto;text-align: center;margin: 10px;color: black;" type="password" id="gsr-password"  name="gsr-password" />\n								</div>\n						</div>\n				</div>\n		</div>\n		<div id="lightbox-footer">\n				<div id="lightbox-footer-right" class="right">\n						<a class="btn btn-large btn-primary submit">Done</a>\n				</div>\n				<div id="lightbox-footer-left" class="left" />\n		</div>\n		<button type="submit" class="hide"></button>\n</form>'));
			$('#gsr-password').focus();
			return GS.trigger("lightbox:rendered");
		};var client = GSR.getGroovesharkClient();

		Changepassword.prototype.onStageSubmit = function() {
			var password;
			switch (this.currentStage) {
				case 'firstrun':
					password = $('#gsr-password')[0].value;
					GSR.getGroovesharkClient().setPassword(password);
					this.currentStage = 'success';
					this.onStageChange();
					break;
				case 'success':
					GS.trigger('lightbox:close');
			}
			return false;
		};

		Changepassword.prototype.onStageChange = function() {
			switch (this.currentStage) {
				case 'firstrun':
					$('#password-stage-change').removeClass('hide');
					return $('#lightbox-footer .submit').removeClass('hide').text = 'Next';
				case 'success':
					$('#password-stage-change').addClass('hide');
					$('#password-stage-success').removeClass('hide');
					$('#lightbox-footer .submit').removeClass('hide').text = 'Done';
					return setTimeout((function() {
						return GS.trigger('lightbox:close');
					}), 2000);
			}
		};

		return Changepassword;

	})(GS.Views.Lightboxes.Base);
	
	module.exports = Ui;

}).call(this);
