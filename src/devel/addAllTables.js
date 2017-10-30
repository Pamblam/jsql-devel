
devel.prototype.addAllTables = function() {
	var table;
	for (table in jSQL.tables) {
		this.addTableTab(table);
	}
}