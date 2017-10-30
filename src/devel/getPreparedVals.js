
devel.prototype.getPreparedVals = function(cb){
	var $ = this.win.$;
	var t = jSQL.tokenize(this.cm.getValue());
	var p = [], opts = [];
	for(var i=0; i<t.length; i++){
		if(t[i].type === 'SYMBOL' && t[i].name === 'QUESTION MARK'){
			t[i].prepared_value = null;
			var n = p.length;
			opts.push("<option value="+n+">"+(1+n)+") "+t[i].value+" (char#"+t[i].input_pos+")</option>");
			p.push(t[i]);
		}
	}
	if(!p.length) return cb(p);
	
	$d = $("<div>");
	$d.appendTo("body");
	$d.html("<p>Enter values for your prepared statement:</p>"+
			"<div><select class='prepared-val-index'>"+(opts.join(''))+"</select></div>"+
			"<div><label><input class='is-prepared-val-null' checked type='checkbox' /> NULL</label></div>"+
			"<div><textarea class=prepared-val-ta></textarea></div>");
	$d.dialog({
		close: function(){
			$d.remove();
		},
		open: function(){
			$d.parent().find("button[title='Close']").remove();
			$(".is-prepared-val-null").mouseup(function(){
				if($(this).is(":checked")) return;
				var indx = $(".prepared-val-index").find("option:selected").val();
				p[indx].prepared_value = null;
				$(".prepared-val-ta").val('');
			});
			$(".prepared-val-ta").keyup(function(){
				var indx = $(".prepared-val-index").find("option:selected").val();
				var val = $(this).val(); 
				if(!val || val == "") val = null;
				p[indx].prepared_value = val;
				$(".is-prepared-val-null").prop("checked", val === null);
			});
			$(".prepared-val-index").change(function(){
				var indx = $(this).find("option:selected").val();
				if(null === p[indx].prepared_value){
					$(".is-prepared-val-null").prop("checked", true);
					$(".prepared-val-ta").val('');
				}else{
					$(".is-prepared-val-null").prop("checked", false);
					$(".prepared-val-ta").val(p[indx].prepared_value);
				}
			});
			$d.parent().find(".ui-dialog-title").html("<span class='ui-icon ui-icon-help'></span> Prepared Values");
		},
		buttons: [{
			text: "OK",
			icon: "ui-icon-check",
			click: function () {
				cb(p);
				$(this).dialog("close");
			}
		}]
	});
	
};