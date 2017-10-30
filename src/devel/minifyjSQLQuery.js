

devel.prototype.minifyjSQLQuery = function(){
	var sql = this.cm.getValue();
	this.cm.getDoc().setValue(jSQL.minify(sql));
};