var fs = require('fs');
var UglifyJS = require("uglify-js");

module.exports = function(grunt) {
	
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		concat: {
			options: {
				banner: '/**\n * <%= pkg.name %> - v<%= pkg.version %>' +
						'\n * <%= pkg.description %>' +
						'\n * @author <%= pkg.author %>' +
						'\n * @website <%= pkg.homepage %>' +
						'\n * @license <%= pkg.license %>' +
						'\n */\n\n'
			},
			dist: {
				src: [
					'src/wrapper/head.js.part', 
					'src/devel/constructor.js',
					'src/devel/addAllTables.js',
					'src/devel/addTableTab.js',
					'src/devel/showCode.js',
					'src/devel/stripQuotes.js',
					'src/devel/dateFormatter.js',
					'src/devel/getPreparedVals.js',
					'src/devel/getDependencies.js',
					'src/devel/typeParamPrompt.js',
					'src/devel/enumParamPrompt.js',
					'src/devel/makeTableHTML.js',
					'src/devel/typeChangeEvent.js',
					'src/devel/minifyjSQLQuery.js',
					'src/devel/addColumnRow.js',
					'src/devel/alert.js',
					'src/devel/confirm.js',
					'src/devel/runjSQLQuery.js',
					'src/devel/open.js',
					'src/devel/close.js',
					'src/devel/loadDependencies.js',
					'src/devel/drawInterface.js',
					'src/devel/initTabs.js',
					'src/devel/initEvents.js',
					'src/devel/initCodemirror.js',
					'src/devel/isOpened.js',
					'src/wrapper/foot.js.part'
				],
				dest: 'jsql-devel.js',
			},
		},
		'string-replace': {
			source: {
				files: {
					"jsql-devel.js": "jsql-devel.js"
				},
				options: {
					replacements: [{
						pattern: /{{ VERSION }}/g,
						replacement: '"<%= pkg.version %>"'
					}]
				}
			},
			readme: {
				files: {
					"README.md": "README.md"
				},
				options: {
					replacements: [{
						pattern: /\d.\d.\d/g,
						replacement: '<%= pkg.version %>'
					}]
				}
			}
		},
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> - v<%= pkg.version %> */'
			},
			build: {
				src: 'jsql-devel.js',
				dest: 'jsql-devel.min.js'
			}
		},
		copy: {
			main: {
				files: [
					{src: 'node_modules/jsql-official/jSQL.min.js', dest: 'demos/plugin/jSQL.min.js'}
				]
			}
		}
	});
	
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-string-replace');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-copy');
	
	grunt.registerTask("make-btn", function(){
		// Generate the URI
		var min = fs.readFileSync('jsql-devel.min.js').toString().split("\n");
		min.shift(); min = min.join('');
		var load_code = fs.readFileSync('src/helpers/loadjSQL.js').toString();
		load_code = UglifyJS.minify(load_code).code;
		var code = ['void(function(){', load_code, 'loadjSQL(function(){', min, 'jSQL.devel.open();','});','return false;}());'].join('');
		code = encodeURIComponent(code);
		code = 'javascript:'+code;
		// Generate the demo
		var html = fs.readFileSync('src/button_demo/index.html').toString();
		html = html.replace(/\#JSQLDEVELBTN\#/g, code);
		fs.writeFileSync('demos/toolbar_button/index.html', html);
	});
	
	grunt.registerTask("make-userscript", function(){
		var pkg = JSON.parse(fs.readFileSync('package.json').toString());
		var header = fs.readFileSync('src/wrapper/userscript_header.js').toString();
		var loader = fs.readFileSync('src/helpers/loadjSQL.js').toString();
		var button = fs.readFileSync('src/helpers/showCornerButton.js').toString();
		var main = fs.readFileSync('jsql-devel.js').toString();
		header = header.replace(/\#vers\#/g, pkg.version).replace(/\#desc\#/g, pkg.description);
		var code = [header, "\nvoid(function(){\n\n", loader, "\n\n",button, "\n\n\nshowCornerButton(function(){\n\n\n", main, "\n\njSQL.devel.open();", "\n\n\n});","\n\nreturn false;\n}());"].join('');
		fs.writeFileSync('jsql-devel.userscript.js', code);
	});
	
	grunt.registerTask('default', [
		'concat',
		'string-replace',
		'uglify',
		'copy',
		'make-btn',
		"make-userscript"
	]);
	
};