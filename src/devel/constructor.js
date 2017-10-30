
function devel(){
	this.iframe = null;
	this.version = JSQL_DEVEL_VERSION;
	this.win = null;
	this.doc = null;
	this.wrapper = null;
	this.cm = null; // codemirror
	this.drawnTables = [];
	this.wrapper_selector = null;
	this.theme = "base";
	this.dependencies = null;
	this.templates = [
		{Name:"Create", Query: "-- A Create Query Template\nCREATE TABLE IF NOT EXISTS `myTable` \n(\t`String` VARCHAR(20),\n\t`Number` INT\n)"},
		{Name:"Select", Query: "-- A Select Query Template\nSELECT\n\t*\nFROM\n\t`myTable`\nWHERE\n\t`Number` > 2"},
		{Name:"Update", Query: "-- An Update Query Template\nUPDATE `myTable`\nSET\n\t`String` = 'Big Number'\nWHERE\n\t`Number` > 2"},
		{Name:"Insert", Query: "-- An Insert Query Template\nINSERT INTO `myTable`\n\t(`String`, `Number`)\nVALUES\n\t('Some Number', 7)"},
		{Name:"Drop", Query: "-- A Drop Query Template\nDROP TABLE `myTable`"}
	];
	this.getDependencies();
}

