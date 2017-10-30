
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