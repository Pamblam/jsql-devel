
devel.prototype.showCode = function(){
	var d = this;
	var cm;
	var sql = this.cm.getValue();
	var es6safe = true;
	var tokens = jSQL.tokenize(sql);
	for(var i=0; i<tokens.length; i++)
		if(tokens[i].name === "QTD IDENTIFIER" && tokens[i].literal.indexOf(" ") > -1) es6safe = false;
	
	if(!sql || sql === "") return this.alert("Enter some SQL first.", "Error", "ui-icon-alert")
	var $ = this.win.$;
	var es6Opt = "<label><input type=radio name=codestyle value=2> ES6</label>";
	var $d = $(" <div>"+
			"	<div style=float:left>"+
			"		<label><input type=radio name=codestyle value=0 checked> Orig</label>"+
			"		<label><input type=radio name=codestyle value=1> Mini</label>"+(es6safe?es6Opt:"")+
			"		<label><input type=checkbox class='use_vars'> Vars</label>"+
			"		<label><input type=checkbox class='use_comments' checked> Comments</label>"+
			"	</div>"+
			"	<div style=float:right;>"+
			"		<button id='copy-code' data-clipboard-target='#code-ta'>Copy</button>"+
			"	</div>"+
			"	<div style=clear:both></div>"+
			"	<textarea></textarea>"+
			"	<textarea id='code-ta' style=opacity:0;height:.2em;width:.2em></textarea>"+
			"</div>");
	d.getPreparedVals(function(prep_vals){
		$d.appendTo("body");
		var param_code = [];
		for(var i=0; i<prep_vals.length; i++) param_code.push(prep_vals[i].prepared_value);
		if(param_code.length) param_code = JSON.stringify(param_code);
		else param_code = "";
		$d.dialog({
			width: $("#jSQLTableTabs").width()/100*75,
			close: function(){
				$d.remove();
			},
			open: function(){
				$("#copy-code").button({icons: { primary: "ui-icon-copy"}});
				$('#copy-code').css({"line-height": "0.9"});
				cm = d.win.CodeMirror.fromTextArea($d.find("textarea")[0], {
					mode: "text/javascript",
					indentWithTabs: true,
					smartIndent: true,
					matchBrackets: true,
					readOnly: true
				});
				var query_code, comment_code, jsql_code;

				query_code = "\""+(sql.trim().replace(/\n/g, "\\n\\\n").replace(/"/g, "\\\""))+"\"";
				comment_code = "// Generated with jSQL Devel \n// "+devel.dateFormatter(new Date(), "l, F jS Y, g:ia")+" \n";
				jsql_code = comment_code+"jSQL.query("+query_code+").execute("+param_code+");";

				cm.getDoc().setValue(jsql_code);
				$("#code-ta").val(jsql_code);
				$d.parent().find(".ui-dialog-title").html("<span class='ui-icon ui-icon-script'></span> jSQL Code");
				$("input[name='codestyle'], .use_vars, .use_comments").click(function(){
					var q = sql.trim();
					comment_code = $(".use_comments").is(":checked") ? "// Generated with jSQL Devel \n// "+devel.dateFormatter(new Date(), "l, F jS Y, g:ia")+" \n" : "";
					switch($("input[name='codestyle']:checked").val()){
						case "0": 
							q = q.replace(/\n/g, "\\n\\\n");
							query_code = "\""+(q.replace(/"/g, "\\\""))+"\"";
							jsql_code = $(".use_vars").is(":checked") ? 
								comment_code+"var sql = "+query_code+";\n"+(param_code.length?"var params = "+param_code+";\n":"")+"jSQL.query(sql).execute("+(param_code.length?"params":"")+");" :
								comment_code+"jSQL.query("+query_code+").execute("+param_code+");";
							break;
						case "1": 
							q = jSQL.minify(q); 
							query_code = "\""+(q.replace(/"/g, "\\\""))+"\"";
							jsql_code = $(".use_vars").is(":checked") ? 
								comment_code+"var sql = "+query_code+";\n"+(param_code.length?"var params = "+param_code+";\n":"")+"jSQL.query(sql).execute("+(param_code.length?"params":"")+");" :
								comment_code+"jSQL.query("+query_code+").execute("+param_code+");";
							break;
						case "2": 
							q = q.replace(/`/g, ""); 
							query_code = "`"+q+"`";
							jsql_code = $(".use_vars").is(":checked") ? 
								comment_code+"let sql = "+query_code+";\n"+(param_code.length?"let params = "+param_code+";\n":"")+"jSQL.query(sql).execute("+(param_code.length?"params":"")+");" :
								comment_code+"jSQL.query("+query_code+").execute("+param_code+");";
							break;
					}
					cm.getDoc().setValue(jsql_code);
					$("#code-ta").val(jsql_code);
				});
				new d.win.Clipboard('#copy-code');
			},
			buttons: [{
				text: "OK",
				icon: "ui-icon-check",
				click: function () {
					$(this).dialog("close");
				}
			}]
		});
	});
};