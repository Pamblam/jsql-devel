
devel.prototype.typeParamPrompt = function(typeName, paramName, def, cb){
	var $ = this.win.$;
	var val = def;
	$d = $("<div>");
	$d.appendTo("body");
	$d.html("Verify the "+paramName+" parameter for this "+typeName+" column or click Confirm to accept the default.<br>"+
			"<input class='val' value='"+def+"' style='width:3em;'><br>"+
			"<code>"+typeName+"("+def+")</code>");
	$(".val").keyup(function(){
		val = $(this).val();
		$d.find("code").html(typeName+"("+val+")");
	});
	$d.dialog({
		close: function(){
			$d.remove();
		},
		open: function(){
			$d.parent().find("button[title='Close']").remove();
			$d.parent().find(".ui-dialog-title").html("<span class='ui-icon ui-icon-wrench'></span> Type Parameter");
		},
		buttons: [{
			text: "Confirm",
			icon: "ui-icon-check",
			click: function () {
				$(this).dialog("close");
				cb(val);
			}
		}]
	});
};