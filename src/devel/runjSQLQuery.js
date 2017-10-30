
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