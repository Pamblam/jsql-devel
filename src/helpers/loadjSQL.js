
function loadjSQL(cb){
	if("undefined" !== typeof jSQL) return cb();
	var script;
	script = document.createElement('script');
	script.type = 'text/javascript';
	if (script.readyState) { //IE
		script.onreadystatechange = function(){
			if (script.readyState == 'loaded' || script.readyState == 'complete') {
				script.onreadystatechange = null;
				setTimeout(function(){
					console.log("looded jsql 1");
					cb();
				}, 1000);
			}
		};
	} else { //Others
		script.onload = function(){
			setTimeout(function(){
				console.log("looded jsql 2");
				cb();
			}, 1000);
		};
	}
	script.src = 'http://pamblam.github.io/jSQL/scripts/jSQL.min.js';
	document.getElementsByTagName('head')[0].appendChild(script);
}

