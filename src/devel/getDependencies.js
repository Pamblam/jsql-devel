
devel.prototype.getDependencies = function(){
	var themes = "base black-tie blitzer cupertino dark-hive dot-luv eggplant excite-bike flick hot-sneaks humanity le-frog mint-choc overcast pepper-grinder redmond smoothness south-street start sunny swanky-purse trontastic ui-darkness ui-lightness vader".split(" ");
	if(themes.indexOf(this.theme) === -1) this.theme = "base";
	var dep = [
		'https://code.jquery.com/jquery-2.2.4.js',
		'https://code.jquery.com/ui/1.12.0/jquery-ui.min.js',
		'https://code.jquery.com/ui/1.12.1/themes/'+this.theme+'/jquery-ui.css',
		'https://cdn.datatables.net/1.10.13/js/jquery.dataTables.min.js',
		'https://cdn.datatables.net/1.10.13/js/dataTables.jqueryui.min.js',
		'https://cdn.datatables.net/1.10.13/css/dataTables.jqueryui.min.css',
		'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.22.0/codemirror.js',
		'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.22.0/mode/sql/sql.js',
		'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.22.0/addon/hint/show-hint.js',
		'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.22.0/addon/hint/sql-hint.js',
		'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.31.0/mode/javascript/javascript.min.js',
		'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.22.0/codemirror.css',
		'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.22.0/addon/hint/show-hint.css',
		'https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/1.7.1/clipboard.min.js'
	];
	this.dependencies = dep;
};