
devel.prototype.enumParamPrompt = function(cb){
	var $ = this.win.$;
	var d = this;
	var $d = $("<div>");
	var vals = [];
	var addEnum = function(){
		var $div = $("<div><input class='val'><span class='removerow ui-icon ui-icon-close'></span></div>");
		$d.find(".enums").append($div);
		$div.find(".removerow").click(function(){
			$div.remove();
			vals = [];
			$d.find(".val").each(function(){
				vals.push(devel.stripQuotes($(this).val()));
			});
		});
		$div.find(".val").keyup(function(){
			vals = [];
			$d.find(".val").each(function(){
				vals.push(devel.stripQuotes($(this).val()));
			});
		});
	};
	$d.appendTo("body");
	$d.html("Enter the enumerables for this column:<br><div class='enums'></div>");
	addEnum();
	$d.dialog({
		close: function(){
			$d.remove();
		},
		open: function(){
			$d.parent().find("button[title='Close']").remove();
			$d.parent().find(".ui-dialog-title").html("<span class='ui-icon ui-icon-wrench'></span> Enter Enumerables");
		},
		buttons: [{
			text: "Cancel",
			icon: "ui-icon-close",
			click: function () {
				$(this).dialog("close");
				cb(false);
			}
		},{
			text: "Add Enum",
			icon: "ui-icon-plus",
			click: addEnum
		},{
			text: "Done",
			icon: "ui-icon-close",
			click: function () {
				if(!vals.length) return d.alert("Enter at least one enumerable or change the column type.", "Error", "ui-icon-alert");
				$(this).dialog("close");
				cb(vals);
			}
		}]
	});
};