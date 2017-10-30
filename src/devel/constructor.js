
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

