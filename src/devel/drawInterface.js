

devel.prototype.drawInterface = function(){
	var $ = this.win.$, queries, selectMenu, i, $overlay, typesOptions;
	queries = this.templates;
	selectMenu = "<select id='queryTypeSelect'><option>Choose...</option>";
	for(i=queries.length; i--;) selectMenu += "<option value='"+queries[i].Name+"'>"+queries[i].Name+"</option>";
	selectMenu += "</select>";
	typesOptions = ['<option>Choose...</option>'];
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