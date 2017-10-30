
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