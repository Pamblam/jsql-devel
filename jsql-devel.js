/**
 * jsql-developer - v1.0.0
 * A development & debugging plugin for jsql-official.
 * @author Rob Parham
 * @website http://pamblam.github.io/jSQL/plugins/
 * @license Apache-2.0
 */


(function(){
if(!window.jSQL) return false;

var JSQL_DEVEL_VERSION = "1.0.0";


function devel(){
	this.iframe = null;
	this.version = JSQL_DEVEL_VERSION;
	this.win = null;
	this.doc = null;
	this.wrapper = null;
	this.cm = null; // codemirror
	this.drawnTables = [];
	this.wrapper_selector = null;
	this.dependencies = [
		'https://code.jquery.com/jquery-2.2.4.js',
		'https://code.jquery.com/ui/1.12.0/jquery-ui.min.js',
		'https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css',
		'https://cdn.datatables.net/1.10.13/js/jquery.dataTables.min.js',
		'https://cdn.datatables.net/1.10.13/js/dataTables.jqueryui.min.js',
		'https://cdn.datatables.net/1.10.13/css/dataTables.jqueryui.min.css',
		'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.22.0/codemirror.js',
		'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.22.0/mode/sql/sql.js',
		'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.22.0/addon/hint/show-hint.js',
		'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.22.0/addon/hint/sql-hint.js',
		'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.22.0/codemirror.css',
		'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.22.0/addon/hint/show-hint.css'
	];
	this.templates = [
		{Name:"Create", Query: "-- A Create Query Template\nCREATE TABLE IF NOT EXISTS `myTable` \n(\t`String` VARCHAR(20),\n\t`Number` INT\n)"},
		{Name:"Select", Query: "-- A Select Query Template\nSELECT\n\t*\nFROM\n\t`myTable`\nWHERE\n\t`Number` > 2"},
		{Name:"Update", Query: "-- An Update Query Template\nUPDATE `myTable`\nSET\n\t`String` = 'Big Number'\nWHERE\n\t`Number` > 2"},
		{Name:"Insert", Query: "-- An Insert Query Template\nINSERT INTO `myTable`\n\t(`String`, `Number`)\nVALUES\n\t('Some Number', 7)"},
		{Name:"Drop", Query: "-- A Drop Query Template\nDROP TABLE `myTable`"}
	];
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


devel.prototype.minifyjSQLQuery = function(){
	var sql = this.cm.getValue();
	this.cm.getDoc().setValue(jSQL.minify(sql));
};

devel.prototype.runjSQLQuery = function(){
	var query, sql, data, tableHTML, msg, d, $;
	$ = this.win.$;
	d = this;
	sql = this.cm.getValue();
	try{
		query = jSQL.query(sql).execute();
		data = [];
		if(query!==undefined){
			data = query.fetchAll("assoc");
			if(query.type === "DROP"){
				this.close();
				this.open(function(){
					d.cm.getDoc().setValue(sql);
				});
			}
		}
		tableHTML = data.length ? '<br><div><small><b>Results</b></small></div><div style="overflow-x:auto; width:100%; margin:0; padding:0;">'+this.makeTableHTML(data)+'</div>' : '<center><b>No results to show</b><br>Enter a query</center>';
		this.addAllTables();
		$("#jSQLMAQueryResults").html(tableHTML);
		$('#jSQLMAQueryResults').find('table').DataTable({"order": [], "scrollX": true});
	}catch(e){
		msg = e.message ? e.message+"" : e+"";
		alert(msg);
		throw e;
	}
};

devel.prototype.open = function(wrapper_selector, cb){
	
	if(this.isOpened()) return this;
	
	if("function" === typeof wrapper_selector) cb = wrapper_selector;
	
	if(!wrapper_selector) wrapper_selector = this.wrapper_selector;
	this.wrapper_selector = wrapper_selector;
	if(this.wrapper_selector) this.wrapper = document.querySelector(this.wrapper_selector);
	
	var iframe_styles = "overflow-x: auto; border: 0px none transparent; padding: 0px; width:100%; height: 100%;";
	iframe_styles += this.wrapper === null ? 
		"position:fixed; top:0; left:0; overflow-y:auto; z-index: 2147483646; background: rgba(255,255,255,0.9);" :
		"background-color: transparent;" ;
	
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
	this.doc.write("<!doctype HTML><html><head><style>body{font-family:Tahoma, Geneva, sans-serif;}</style></head><body><span>Loading jSQL Devel... (<span id='progress'>0%</span>)</span></body></html>");
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
	var $ = this.win.$, queries, selectMenu, i, $overlay, typesOptions;
	queries = this.templates;
	selectMenu = "<select id='queryTypeSelect'><option>Choose...</option>";
	for(i=queries.length; i--;) selectMenu += "<option value='"+queries[i].Name+"'>"+queries[i].Name+"</option>";
	selectMenu += "</select>";
	typesOptions = [];
	for(i=0; i<jSQL.types.list.length; i++){
		typesOptions.push("<option value='"+jSQL.types.list[i].type+"'>"+jSQL.types.list[i].type+"</option>");
		if(jSQL.types.list[i].aliases && jSQL.types.list[i].aliases.length){
			for(var n=0; n<jSQL.types.list[i].aliases.length; n++){
				typesOptions.push("<option value='"+jSQL.types.list[i].aliases[n]+"'> -- "+jSQL.types.list[i].aliases[n]+"</option>");
			}
		}
	}
	$overlay = $("body").empty();
	if(this.wrapper) $overlay.empty();
	$overlay.html('<h5>jSQL Version: ' + jSQL.version + ' | jSQLDevel Version: ' + this.version + '</h5>');
	$overlay.append("<div id='jSQLTableTabs'>"+
					"	 <ul>"+
					"		 <li><a href='#jSQLNewTableTab'>New Table</a></li>"+
					"		 <li><a href='#jSQLResultsTab'>Query</a></li>"+
					"	 </ul>"+
					"	 <div id='jSQLNewTableTab'>"+
					"		 <input type='text' id='tableName' placeholder='Table Name' />"+
					"		 <table>"+
					"			 <thead>"+
					"				 <tr>"+
					"					 <th>-Name-</th>"+
					"					 <th>-Type-</th>"+
					"					 <th>-AI-</th>"+
					"					 <th>-PK-</th>"+
					"					 <th>-UN-</th>"+
					"				 </tr>"+
					"			 </thead>"+
					"			 <tbody>"+
					"				 <tr>"+
					"					 <td><input type=text class=colname-jma placeholder='Column Name' /></td>"+
					"					 <td>"+
					"						 <select>"+(typesOptions.join(''))+"</select>"+
					"					 </td>"+
					"					 <td><input type=checkbox class=col-ai-jma /></td>"+
					"					 <td><input type=checkbox class=col-pk-jma /></td>"+
					"					 <td><input type=checkbox class=col-un-jma /></td>"+
					"				 </tr>"+
					"			 </tbody>"+
					"		 </table>"+
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
		console.log(query, Name);
		
		d.cm.getDoc().setValue(query);
		$(this).val($(this).find("option:first").val());
	});
	$("#jSQLResetButton").click(function(){
		if(!confirm("Do you want to delete all tables?")) return;
		jSQL.reset();
		d.close();
		d.open();
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
