
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