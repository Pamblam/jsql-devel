
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