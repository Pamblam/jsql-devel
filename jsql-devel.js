/**
 * jsql-devel - v2.0.4
 * A development & debugging plugin for jsql-official.
 * @author Rob Parham
 * @website http://pamblam.github.io/jSQL/plugins/
 * @license Apache-2.0
 */


(function(){
if(!window.jSQL) return false;

var JSQL_DEVEL_VERSION = "2.0.4";


function devel(){
	this.iframe = null;
	this.version = JSQL_DEVEL_VERSION;
	this.win = null;
	this.doc = null;
	this.wrapper = null;
	this.cm = null; // codemirror
	this.drawnTables = [];
	this.wrapper_selector = null;
	this.theme = "base";
	this.header_img = "http://i.imgur.com/VQlJKOc.png";
	this.loader_img = "http://i.imgur.com/VQlJKOc.png";
	this.dependencies = null;
	this.templates = [
		{Name:"Create", Query: "-- A Create Query Template\nCREATE TABLE IF NOT EXISTS `myTable` \n(\t`String` VARCHAR(20),\n\t`Number` INT\n)"},
		{Name:"Select", Query: "-- A Select Query Template\nSELECT\n\t*\nFROM\n\t`myTable`\nWHERE\n\t`Number` > 2"},
		{Name:"Update", Query: "-- An Update Query Template\nUPDATE `myTable`\nSET\n\t`String` = 'Big Number'\nWHERE\n\t`Number` > 2"},
		{Name:"Insert", Query: "-- An Insert Query Template\nINSERT INTO `myTable`\n\t(`String`, `Number`)\nVALUES\n\t('Some Number', 7)"},
		{Name:"Drop", Query: "-- A Drop Query Template\nDROP TABLE `myTable`"}
	];
	this.getDependencies();
}



devel.prototype.addAllTables = function() {
	var table;
	for (table in jSQL.tables) {
		this.addTableTab(table);
	}
}

devel.prototype.addTableTab = function(tableName){
	var $ = this.win.$;
	if(this.drawnTables.indexOf(tableName)>-1) return;
	var $ul = $('#jSQLTableTabs').find('ul').eq(0);
	var id = 'jSQLResultsTab-' + $ul.find('li').length;
	$ul.append('<li><a href="#' + id + '">' + tableName + '</a></li>');
	$ul.after('<div id="' + id + '">Loading...</div>');
	$("#"+id).data("tn", tableName);
	$('#jSQLTableTabs').tabs("refresh");
	this.drawnTables.push(tableName);
};

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

devel.stripQuotes = function(string){
	if(!string.length) return "";
	if((string[0] === "'" || string[0] === '"') && string[0] === string[string.length-1])
		string = string.substr(1, string.length - 2);
	return string;
};

devel.dateFormatter = function(date, format){
	if (isNaN(date.getTime())) return "Invalid Date";
	var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

	var buffer = []; 
	for(var i=0; i<format.length; i++){
		switch(format[i]){
			// If the current char is a "\" then skip it and add then next literal char
			case "\\": buffer.push(format[++i]); break;

			// Symbols that represent numbers
			case "Y": buffer.push("" + date.getFullYear()); break;
			case "y": buffer.push(("" + date.getFullYear()).substring(2)); break;
			case "m": buffer.push(("0" + (date.getMonth() + 1)).substr(-2, 2)); break;
			case "n": buffer.push("" + (date.getMonth() + 1)); break;
			case "t": buffer.push("" + new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()); break; 
			case "d": buffer.push(("0" + date.getDate()).substr(-2, 2)); break;
			case "j": buffer.push(date.getDate() + ""); break;
			case "w": buffer.push(date.getDay()); break;
			case "g": buffer.push("" + (date.getHours() > 12 ? date.getHours() - 12 : date.getHours())); break;
			case "G": buffer.push("" + (date.getHours())); break;
			case "h": buffer.push(("0" + (date.getHours() > 12 ? date.getHours() - 12 : date.getHours())).substr(-2, 2)); break;
			case "H": buffer.push(("0" + (date.getHours()+"")).substr(-2, 2)); break;
			case "i": buffer.push(("0" + date.getMinutes()).substr(-2, 2)); break;
			case "s": buffer.push(("0" + date.getSeconds()).substr(-2, 2)); break;
			case "N": buffer.push(date.getDay()==0?7:date.getDay()); break;
			case "L": buffer.push((date.getFullYear() % 4 == 0 && date.getFullYear() % 100 != 0) || date.getFullYear() % 400 == 0 ? "1" : "0"); break;
			case "o": buffer.push(date.getMonth()==0&&date.getDate()<6&&date.getDay()<4?date.getFullYear()-1:date.getFullYear()); break;
			case "B": buffer.push(Math.floor((((date.getUTCHours() + 1) % 24) + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600) * 1000 / 24)); break;
			case "v": buffer.push((date.getTime()+"").substr(-3)); break;
			case "Z": buffer.push(date.getTimezoneOffset()*60); break;
			case "U": buffer.push(Math.floor(date.getTime()/1000)); break;

			// Symbols that represent text
			case "a": buffer.push(date.getHours() > 11 ? "pm" : "am"); break;
			case "A": buffer.push(date.getHours() > 11 ? "PM" : "AM"); break;
			case "l": buffer.push(days[date.getDay()]); break;
			case "D": buffer.push(days[date.getDay()].substr(0, 3)); break;
			case "F": buffer.push(months[date.getMonth()]); break;
			case "M": buffer.push(months[date.getMonth()].substring(0, 3)); break;
			case "c": buffer.push(date.toISOString()); break;
			
			// Ordinal suffix
			case "S":
				var suffix = false;
				var ones = buffer[buffer.length-1];
				var tens = buffer[buffer.length-2];
				if(ones == "1") suffix = "st";
				if(ones == "2") suffix = "nd";
				if(ones == "3") suffix = "rd";
				if(tens == "1" || !suffix) suffix = "th";
				buffer.push(suffix);
				break;
			
			// ISO-8601 Week number
			case "W":
				var startDate = new Date(date.getFullYear(), 0);
				var endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
				while(endDate.getDay() < 6) endDate.setDate(endDate.getDate()+1);
				endDate = endDate.getTime();
				var weekNo = 0;
				while(startDate.getTime() < endDate){
					if(startDate.getDay() == 4) weekNo++;
					startDate.setDate(startDate.getDate()+1);
				}
				buffer.push(weekNo);
				break;
			
			// Day of the year
			case "z":
				var startDate = new Date(date.getFullYear(), 0, 1, 0, 0, 0, 0);
				var dayNo = 0;
				while(startDate.getTime() < date.getTime()){
					dayNo++;
					startDate.setDate(startDate.getDate()+1);
				}
				buffer.push(dayNo);
				break;
				
			default: buffer.push(format[i]); break;
		}
	}
	return buffer.join('');
};

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

devel.prototype.getDependencies = function(){
	var themes = "base black-tie blitzer cupertino dark-hive dot-luv eggplant excite-bike flick hot-sneaks humanity le-frog mint-choc overcast pepper-grinder redmond smoothness south-street start sunny swanky-purse trontastic ui-darkness ui-lightness vader".split(" ");
	if(themes.indexOf(this.theme) === -1) this.theme = "base";
	var dep = [
		'https://code.jquery.com/jquery-2.2.4.js',
		'https://code.jquery.com/ui/1.12.0/jquery-ui.min.js',
		'https://code.jquery.com/ui/1.12.1/themes/'+this.theme+'/jquery-ui.css',
		'https://cdn.datatables.net/1.10.13/js/jquery.dataTables.min.js',
		'https://cdn.datatables.net/1.10.13/js/dataTables.jqueryui.min.js',
		'https://cdn.datatables.net/1.10.13/css/dataTables.jqueryui.min.css',
		'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.22.0/codemirror.js',
		'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.22.0/mode/sql/sql.js',
		'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.22.0/addon/hint/show-hint.js',
		'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.22.0/addon/hint/sql-hint.js',
		'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.31.0/mode/javascript/javascript.min.js',
		'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.22.0/codemirror.css',
		'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.22.0/addon/hint/show-hint.css',
		'https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/1.7.1/clipboard.min.js'
	];
	this.dependencies = dep;
};

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

devel.prototype.makeTableHTML = function(data, drawData) {
	var html, name, i, type, val;
	if(undefined === drawData) drawData = true;
	html = [];
	html.push('<table><thead><tr>');
	for (name in data[0])
		html.push('<th>' + name + '</th>');
	html.push('</tr></thead><tbody>');
	for (i = 0; i < data.length; i++) {
		if(!drawData) break;
		html.push('<tr>');
		for (name in data[i]) {
			type = typeof data[i][name];
			val = type !== "string" && type !== "number" ? "[" + type + "]" : data[i][name];
			if (val.length > 50)
				val = val.substring(0, 47) + "...";
			html.push('<td>' + val + '</td>');
		}
		html.push('</tr>');
	}
	html.push('</tbody></table>');
	return html.join('');
};

devel.prototype.typeChangeEvent = function($row, typesOptions){
	var d = this;
	var $ = this.win.$;
	$row.find("select").change(function(){
		var type = $(this).val();
		switch(type){
			case "NUMERIC": case "NUMBER": case "DECIMAL": case "FLOAT":
			case "TINYINT": case "SMALLINT": case "MEDIUMINT": case "INT": case "BIGINT":
				d.typeParamPrompt(type, "display width", "", function(val){
					$row.data("type", type);
					$row.data("type-param", val);
					var $td = $row.find("select").parent().empty();
					$td.append(type+"("+val+") <span class='ui-icon ui-icon-pencil'></span>");
					$td.find(".ui-icon-pencil").click(function(){
						$row.data("type", "");
						$row.data("type-param", "");
						$td.html("<select>"+(typesOptions.join(''))+"</select>");
						d.typeChangeEvent($row, typesOptions);
					});
				});
				break;
			case "VARCHAR": case "LONGTEXT": case "MEDIUMTEXT":
				d.typeParamPrompt(type, "string length", "", function(val){
					$row.data("type", type);
					$row.data("type-param", val);
					var $td = $row.find("select").parent().empty();
					$td.append(type+"("+val+") <span class='ui-icon ui-icon-pencil'></span>");
					$td.find(".ui-icon-pencil").click(function(){
						$row.data("type", "");
						$row.data("type-param", "");
						$td.html("<select>"+(typesOptions.join(''))+"</select>");
						d.typeChangeEvent($row, typesOptions);
					});
				});
				break;
			case "ENUM":
				d.enumParamPrompt(function(vals){
					if(!vals){
						$row.find("select").find("option").eq(0).prop("selected", true);
						return false;
					}
					$row.data("type", type);
					$row.data("type-param", vals);
					var $td = $row.find("select").parent().empty();
					$td.append(type+"('"+(vals.join("','"))+"') <span class='ui-icon ui-icon-pencil'></span>");
					$td.find(".ui-icon-pencil").click(function(){
						$row.data("type", "");
						$row.data("type-param", "");
						$td.html("<select>"+(typesOptions.join(''))+"</select>");
						d.typeChangeEvent($row, typesOptions);
					});
				});
				break;
			case "CHAR":
				d.typeParamPrompt(type, "char length", "4", function(val){
					if(!val || val===""){
						d.alert("You must enter a char length for the char type.", "Error", "ui-icon-alert");
						$row.find("select").find("option").eq(0).prop("selected", true);
						return false;
					}
					$row.data("type", type);
					$row.data("type-param", val);
					var $td = $row.find("select").parent().empty();
					$td.append(type+"("+val+") <span class='ui-icon ui-icon-pencil'></span>");
					$td.find(".ui-icon-pencil").click(function(){
						$row.data("type", "");
						$row.data("type-param", "");
						$td.html("<select>"+(typesOptions.join(''))+"</select>");
						d.typeChangeEvent($row, typesOptions);
					});
				});
				break;
			default:
				$row.data("type", type);
				$row.data("type-param", '');
				var $td = $row.find("select").parent().empty();
				$td.append(type+" <span class='ui-icon ui-icon-pencil'></span>");
				$td.find(".ui-icon-pencil").click(function(){
					$row.data("type", "");
					$row.data("type-param", "");
					$td.html("<select>"+(typesOptions.join(''))+"</select>");
					d.typeChangeEvent($row, typesOptions);
				});
		}
	});
};


devel.prototype.minifyjSQLQuery = function(){
	var sql = this.cm.getValue();
	this.cm.getDoc().setValue(jSQL.minify(sql));
};

devel.prototype.addColumnRow = function(){
	var $ = this.win.$;
	var d = this;
	var typesOptions = ['<option>Choose...</option>'];
	for(i=0; i<jSQL.types.list.length; i++){
		typesOptions.push("<option value='"+jSQL.types.list[i].type+"'>"+jSQL.types.list[i].type+"</option>");
		if(jSQL.types.list[i].aliases && jSQL.types.list[i].aliases.length){
			for(var n=0; n<jSQL.types.list[i].aliases.length; n++){
				typesOptions.push("<option value='"+jSQL.types.list[i].aliases[n]+"'> -- "+jSQL.types.list[i].aliases[n]+"</option>");
			}
		}
	}
	var $row =$("<tr>"+
				"	<td><input type=text class=colname-jma placeholder='Column Name' /></td>"+
				"	<td>"+
				"		<select>"+(typesOptions.join(''))+"</select>"+
				"	</td>"+
				"	<td><input type=checkbox class=col-null-jma /></td>"+
				"	<td><input type=text class=col-default-jma style=width:6em /></td>"+
				"	<td><input type=checkbox class=col-ai-jma /></td>"+
				"	<td><input type=checkbox class=col-pk-jma /></td>"+
				"	<td><input type=checkbox class=col-un-jma /></td>"+
				"	<td><span class='ui-icon ui-icon-circle-close'></span></td>"+
				"</tr>");
	$("#jSQLNewTableTab").find("tbody").append($row);
	$row.find(".ui-icon-circle-close").click(function(){
		$row.remove();
	});
	this.typeChangeEvent($row, typesOptions);
};

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

devel.prototype.runjSQLQuery = function(){
	var query, sql, data, tableHTML, msg, d, $;
	$ = this.win.$;
	d = this;
	sql = this.cm.getValue();
	this.getPreparedVals(function(prep_vals){
		var params = [];
		for(var i=0; i<prep_vals.length; i++) params.push(prep_vals[i].prepared_value);
		if(!params.length)params=undefined;
		try{
			query = jSQL.query(sql).execute(params);
			data = [];
			if(query!==undefined){
				data = query.fetchAll("assoc");
				if(query.type === "DROP"){
					d.close();
					d.open(function(){
						d.cm.getDoc().setValue(sql);
					});
				}
			}
			tableHTML = data.length ? '<br><div><small><b>Results</b></small></div><div style="overflow-x:auto; width:100%; margin:0; padding:0;">'+d.makeTableHTML(data)+'</div>' : '<center><b>No results to show</b><br>Enter a query</center>';
			d.addAllTables();
			$("#jSQLMAQueryResults").html(tableHTML);
			$('#jSQLMAQueryResults').find('table').DataTable({"order": []});
		}catch(e){
			msg = e.message ? e.message+"" : e+"";
			d.alert(msg, "Error", "ui-icon-alert");
			throw e;
		}
	});
};

devel.prototype.open = function(wrapper_selector, cb){
	
	if(this.isOpened()) return;
	
	var params = {};
	if("object" === typeof wrapper_selector){
		for(var p in wrapper_selector)
			if(wrapper_selector.hasOwnProperty(p))
				params[p] = wrapper_selector[p];
		wrapper_selector = params.wrapper ? params.wrapper : undefined;
		cb = "function" === typeof params.callback ? params.callback : (typeof cb === "function" ? cb : function(){});
	}
	
	if(params.theme) this.theme = params.theme;
	if(params.header_img) this.header_img = params.header_img;
	if(params.loader_img) this.loader_img = params.loader_img;
	
	if("function" === typeof wrapper_selector) cb = wrapper_selector;
	
	if(!wrapper_selector) wrapper_selector = this.wrapper_selector;
	this.wrapper_selector = wrapper_selector;
	if(this.wrapper_selector) this.wrapper = document.querySelector(this.wrapper_selector);
	
	this.bg = this.wrapper === null ? 'rgba(255,255,255,0.9)' : 'transparent';
	if(params.bg) this.bg = params.bg;
	
	var iframe_styles = "background:"+params.bg+"; overflow-x: auto; border: 0px none transparent; padding: 0px; width:100%; height: 100%;";
	if(this.wrapper === null) iframe_styles += "position:fixed; top:0; left:0; overflow-y:auto; z-index: 2147483646;";
	
	this.iframe = document.createElement("iframe");
	this.iframe.setAttribute("style", iframe_styles);
	//this.iframe.setAttribute("scrolling", "no");
	if(this.wrapper) this.wrapper.innerHTML = "";
	
	(this.wrapper ? this.wrapper : document.body).appendChild(this.iframe);
	this.win = this.iframe.contentWindow || this.iframe;
	this.doc = this.iframe.contentDocument || this.iframe.contentWindow.document;
	var d = this;
	this.iframe.onload = function(){
		d.loadDependencies(function(){
			jSQL.load(function(){
				d.drawInterface();
				d.initTabs();
				d.initEvents();
				d.addAllTables();
				d.initCodemirror();
				if("function" === typeof cb) cb();
			});
		});
	};
	this.doc.write("<!doctype HTML><html><head><style>body{font-family:Tahoma, Geneva, sans-serif;}</style></head><body><center><br><br>"+(this.loader_img?"<img src='"+this.loader_img+"' style=width:40vw; /><br>":"")+"<span>Loading jSQL Devel... (<span id='progress'>0%</span>)</span></center></body></html>");
	this.doc.close();
	
}

devel.prototype.close = function(){
	this.iframe.parentNode.removeChild(this.iframe);
	if(this.wrapper) this.wrapper.innerHTML = "";
	this.iframe = null;
	this.wrapper = null;
	this.win = null;
	this.doc = null;
	this.cm = null;
	this.drawnTables = [];
};



devel.prototype.loadDependencies = function(cb){
	var d = this;
	var p = this.doc.getElementById('progress');
	this.getDependencies();
	(function recurse(i) {
		var resource;
		
		if(p && i > 0){
			var pct = Math.floor(((i) / d.dependencies.length) * 1000)/10;
			p.innerHTML = pct+"%";
		}
		
		if (i >= d.dependencies.length) return cb();
		resource = d.dependencies[i];
		
		if(resource.substr(-4).toUpperCase() === ".CSS"){
			d.doc.getElementsByTagName('head')[0].insertAdjacentHTML('beforeend', '<link rel=\'stylesheet\' href=\''+resource+'\'>');
			return recurse(i+1);
		}
		
		var src, script;
		script = d.doc.createElement('script');
		script.type = 'text/javascript';
		if (script.readyState) { //IE
			script.onreadystatechange = function(){
				if (script.readyState == 'loaded' || script.readyState == 'complete') {
					script.onreadystatechange = null;
					setTimeout(function(){
						recurse(i+1);
					}, 1000);
				}
			};
		} else { //Others
			script.onload = function(){
				setTimeout(function(){
					recurse(i+1);
				}, 1000);
			};
		}
		script.src = resource;
		d.doc.getElementsByTagName('head')[0].appendChild(script);
		
	})(0);
};



devel.prototype.drawInterface = function(){
	var $ = this.win.$, queries, selectMenu, i, $overlay;
	queries = this.templates;
	selectMenu = "<select id='queryTypeSelect'><option>Choose...</option>";
	for(i=queries.length; i--;) selectMenu += "<option value='"+queries[i].Name+"'>"+queries[i].Name+"</option>";
	selectMenu += "</select>";
	$overlay = $("body").empty();
	if(this.wrapper) $overlay.empty();
	$overlay.html('<div style=float:right><h5><span class="ui-icon ui-icon-heart"></span> jSQL Version: ' + jSQL.version + ' | jSQLDevel Version: ' + this.version + '</h5></div><div style=float:left>'+(this.header_img?'<img src="'+this.header_img+'" style=height:3em;line-height:0.9; />':'')+'</div><div style=clear:both></div>');
	$overlay.append("<div id='jSQLTableTabs'>"+
					"	 <ul>"+
					"		 <li><a href='#jSQLNewTableTab'><span class='ui-icon ui-icon-flag'></span> Table Wizard</a></li>"+
					"		 <li><a href='#jSQLResultsTab'><span class='ui-icon ui-icon-document-b'></span> Worksheet</a></li>"+
					"	 </ul>"+
					"	 <div id='jSQLNewTableTab'>"+
					"		 <input type='text' id='tableName' placeholder='Table Name' />"+
					"		 <label><input type='checkbox' id='ifnotexists' /> IF NOT EXISTS</label>"+
					"		 <button id=addTableColumnRow>Add Column</button>"+
					"		 <div style='width:100%;overflow:auto'>"+
					"		 <table>"+
					"			 <thead>"+
					"				 <tr>"+
					"					 <th>Name</th>"+
					"					 <th>Type</th>"+
					"					 <th>NULL</th>"+
					"					 <th>DEFAULT</th>"+
					"					 <th>AI</th>"+
					"					 <th>PK</th>"+
					"					 <th>UN</th>"+
					"					 <th></th>"+
					"				 </tr>"+
					"			 </thead>"+
					"			 <tbody></tbody>"+
					"		 </table>"+
					"		 </div>"+
					"		 <hr>"+
					"		 <button id=resetTableBuilder>Reset</button>"+
					"		 <button id=runTableBuilder>Build SQL</button>"+
					"	 </div>"+
					"	 <div id='jSQLResultsTab'>"+
					"		 <div>"+
					"			 <div style='float:right;'><small><b>autocomplete</b>: <i>ctrl+space</i></small></div>"+
					"			 <div style='float:left'><b>Template: </b>"+selectMenu+"</div>"+
					"			 <div style='clear:both;'></div>"+
					"		 </div>"+
					"		 <textarea id='jSQLDevelQueryBox'></textarea>"+
					"		 <div style='text-align:right;'>"+
					"			 <button id='jSQLExecuteQueryButton'>Run Query</button>"+
					"			 <button id='jSQLMinifyQueryButton'>Minify</button>"+
					"			 <button id='jSQLShowCodeButton'>Show Code</button>"+
					"			 <button id='jSQLResetButton'>Reset</button>"+
					"			 <button id='jSQLCommitButton'>Commit</button>"+
					"		 </div>"+
					"		 <div id='jSQLMAQueryResults'><center><b>No results to show</b><br>Enter a query</center></div>"+
					"	 </div>"+
					"</div>");
	$('#queryTypeSelect').css({"line-height": "0.9"});
	$("#jSQLExecuteQueryButton").button({icons: { primary: "ui-icon-caret-1-e"}});
	$('#jSQLExecuteQueryButton').css({"line-height": "0.9"});
	$("#jSQLMinifyQueryButton").button({icons: { primary: "ui-icon-minusthick"}});
	$('#jSQLMinifyQueryButton').css({"line-height": "0.9"});
	$("#jSQLResetButton").button({icons: { primary: "ui-icon-refresh"}});
	$('#jSQLResetButton').css({"line-height": "0.9"});
	$("#jSQLCommitButton").button({icons: { primary: "ui-icon-check"}});
	$('#jSQLCommitButton').css({"line-height": "0.9"});
	$("#resetTableBuilder").button({icons: { primary: "ui-icon-refresh"}});
	$('#resetTableBuilder').css({"line-height": "0.9"});
	$("#addTableColumnRow").button({icons: { primary: "ui-icon-circle-plus"}});
	$('#addTableColumnRow').css({"line-height": "0.9"});
	$("#runTableBuilder").button({icons: { primary: "ui-icon-triangle-1-e"}});
	$('#runTableBuilder').css({"line-height": "0.9"});
	$("#jSQLShowCodeButton").button({icons: { primary: "ui-icon-script"}});
	$('#jSQLShowCodeButton').css({"line-height": "0.9"});
	this.addColumnRow();
};

devel.prototype.initTabs = function(){
	var $ = this.win.$;
	$('#jSQLTableTabs').tabs({
		active: 1,
		beforeActivate: function(event, ui){
			var tableName = $(ui.newPanel).data("tn");
			if(tableName === undefined) return;
			$(ui.newPanel).html("Loading...");
		},
		activate: function(event, ui){
			setTimeout(function(){
				var tableName, data, tableHTML, cols, i;
				tableName = $(ui.newPanel).data("tn");
				if(tableName === undefined) return;
				data = jSQL.select('*').from(tableName).execute().fetchAll('array');
				tableHTML = '<div style="overflow-x:auto; width:100%; margin:0; padding:0;"><table></table></div>';
				$(ui.newPanel).html(tableHTML);
				cols = [];
				for(i=0; i<jSQL.tables[tableName].columns.length; i++)
					cols.push({title: jSQL.tables[tableName].columns[i]});
				$(ui.newPanel).find('table').DataTable({
					data: data,
					columns: cols
				});
			}, 500);
		}
	});
};

devel.prototype.initEvents = function(){
	var $ = this.win.$,
		d = this;
	$("#queryTypeSelect").change(function(){
		var Name, query;
		Name = $(this).val();
		if(undefined === Name || Name === "" || Name === null || Name === false) return;
		for(var o=0; o<d.templates.length; o++)
			if(d.templates[o].Name === Name) query = d.templates[o].Query;
		d.cm.getDoc().setValue(query);
		$(this).val($(this).find("option:first").val());
	});
	$("#jSQLResetButton").click(function(){
		d.confirm("Do you want to delete all tables?", function(confirmed){
			if(!confirmed) return;
			jSQL.reset();
			d.close();
			d.open();
		});
	});
	$("#jSQLCommitButton").click(function(){
		jSQL.commit();
		$("#jSQLCommitButton").button("option", "label", "Committed!");
		setTimeout(function(){
			$("#jSQLCommitButton").button("option", "label", "Commit");
		},2000);
	});
	$("#jSQLExecuteQueryButton").click(function(){
		d.runjSQLQuery();
	});
	$("#jSQLMinifyQueryButton").click(function(){
		d.minifyjSQLQuery();
	});
	$("#addTableColumnRow").click(function(){
		d.addColumnRow();
	});
	$("#resetTableBuilder").click(function(){
		$("#jSQLNewTableTab").find("tbody").empty();
		$("#tableName").val("");
		d.addColumnRow();
	});
	$("#runTableBuilder").click(function(){
		var sql = ["-- Generated with jSQL Devel on "+devel.dateFormatter(new Date(), "l, F jS Y, g:ia")+" \nCREATE TABLE "];
		if($("#ifnotexists").is(":checked")) sql.push("IF NOT EXISTS ");
		var table_name = $("#tableName").val();
		if(!table_name || table_name == "") return d.alert("You must enter a table name.", "Error", "ui-icon-alert");
		sql.push("`"+table_name+"` (\n");
		var primary_keys = [];
		var error = false;
		$("#jSQLNewTableTab").find("tbody").find("tr").each(function(){
			if(error) return;
			var colNme = $(this).find(".colname-jma").val();
			if(!colNme || colNme == "") return d.alert("You must enter a column namefor ever column.", "Error", "ui-icon-alert");
			sql.push("\t`"+colNme+"`");
			var type = $(this).data("type");
			var param = $(this).data("type-param");
			if(Array.isArray(param)) param = '"'+(param.join('", "'))+'"';
			if(type && type !== ""){
				sql.push(" "+type);
				if(param && param !== "") sql.push("("+param+")");
			}
			sql.push($(this).find(".col-null-jma").is(":checked")?" NULL":" NOT NULL");
			var def = $(this).find(".col-default-jma").val();
			if(def && def !== ""){
				if(["NUMERIC","NUMBER","DECIMAL","FLOAT","TINYINT","SMALLINT","MEDIUMINT","INT","BIGINT"].indexOf(type)>-1) def = parseFloat(def);
				else def = '"'+devel.stripQuotes(def)+'"';
				sql.push(" DEFAULT "+def);
			}
			if($(this).find(".col-ai-jma").is(":checked")){
				if(!$(this).find(".col-pk-jma").is(":checked") || type !== "INT"){
					error = true;
					return d.alert("AUTO_INCREMENT colunm must be INT type and PRIMARY KEY.", "Error", "ui-icon-alert");
				}
				sql.push(" AUTO_INCREMENT");
			}
			if($(this).find(".col-un-jma").is(":checked")) sql.push(" UNIQUE KEY");
			if($(this).find(".col-pk-jma").is(":checked")) primary_keys.push(colNme);
			sql.push(",\n");
		});
		if(error) return;
		if(primary_keys.length){
			sql.push("\tPRIMARY KEY (`"+(primary_keys.join("`, `"))+"`)\n");
		}
		sql.push(")");
		$('#jSQLTableTabs').tabs("option", "active", 1);
		d.cm.getDoc().setValue(sql.join(''));
	});
	$("#jSQLShowCodeButton").click(function(){
		d.showCode();
	});
};

devel.prototype.initCodemirror = function(){
	var $ = this.win.$;
	$("head").append("<style>.CodeMirror-hints, .CodeMirror-hint, .CodeMirror-hint-active { z-index:2147483647 !important;}.CodeMirror {border: 1px solid #eee;height: auto;}</style>");
	var tbls = {}, table;
	for (table in jSQL.tables) tbls[table] = jSQL.tables[table].columns;
	this.cm = this.win.CodeMirror.fromTextArea($("#jSQLDevelQueryBox")[0], {
		mode: "text/x-mysql",
		indentWithTabs: true,
		smartIndent: true,
		matchBrackets : true,
		autofocus: true,
		extraKeys: {"Ctrl-Space": "autocomplete"},
		hint: this.win.CodeMirror.hint.sql,
		hintOptions: {tables: tbls}
	});
	$('#jSQLTableTabs').find(".CodeMirror").css({
		border: "1px solid #eee",
		height: "auto"
	});
};

devel.prototype.isOpened = function(){
	return this.iframe !== null;
};

jSQL.devel = new devel;

})();
