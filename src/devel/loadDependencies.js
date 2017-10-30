
devel.prototype.loadDependencies = function(cb){
	var d = this;
	var p = this.doc.getElementById('progress');
	this.getDependencies();
	(function recurse(i) {
		var resource;
		
		if(p && i > 0){
			var pct = Math.floor(((i) / d.dependencies.length) * 1000)/10;
			p.innerHTML = pct+"%";
		}
		
		if (i >= d.dependencies.length) return cb();
		resource = d.dependencies[i];
		
		if(resource.substr(-4).toUpperCase() === ".CSS"){
			d.doc.getElementsByTagName('head')[0].insertAdjacentHTML('beforeend', '<link rel=\'stylesheet\' href=\''+resource+'\'>');
			return recurse(i+1);
		}
		
		var src, script;
		script = d.doc.createElement('script');
		script.type = 'text/javascript';
		if (script.readyState) { //IE
			script.onreadystatechange = function(){
				if (script.readyState == 'loaded' || script.readyState == 'complete') {
					script.onreadystatechange = null;
					setTimeout(function(){
						recurse(i+1);
					}, 1000);
				}
			};
		} else { //Others
			script.onload = function(){
				setTimeout(function(){
					recurse(i+1);
				}, 1000);
			};
		}
		script.src = resource;
		d.doc.getElementsByTagName('head')[0].appendChild(script);
		
	})(0);
};
