
devel.prototype.confirm = function(msg, cb, yesText, noText){
	var $ = this.win.$;
	title = "Confirm";
	cb = cb || function(){};
	yesText = yesText || "OK";
	noText = noText || "Cancel";
	$d = $("<div>");
	$d.appendTo("body");
	$d.html(msg);
	$d.dialog({
		closeOnEscape: false,
		close: function(){
			$d.remove();
		},
		open: function(){
			var t = "<span class='ui-icon ui-icon-help'></span> ";
			if(title) t += title;
			$d.parent().find("button[title='Close']").remove();
			if(t) $d.parent().find(".ui-dialog-title").html(t);
		},
		buttons: [{
			text: noText,
			icon: "ui-icon-close",
			click: function () {
				$(this).dialog("close");
				cb(false);
			}
		},{
			text: yesText,
			icon: "ui-icon-check",
			click: function () {
				$(this).dialog("close");
				cb(true);
			}
		}]
	});
};