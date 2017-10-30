

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