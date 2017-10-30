
devel.prototype.alert = function(msg, title, icon){
	var $ = this.win.$;
	title = title || "";
	$d = $("<div>");
	$d.appendTo("body");
	$d.html(msg);
	$d.dialog({
		close: function(){
			$d.remove();
		},
		open: function(){
			var t = "";
			if(icon) t += "<span class='ui-icon "+icon+"'></span> ";
			if(title) t += title;
			if(t) $d.parent().find(".ui-dialog-title").html(t);
		},
		buttons: [{
			text: "OK",
			icon: "ui-icon-check",
			click: function () {
				$(this).dialog("close");
			}
		}]
	});
};