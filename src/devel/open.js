
devel.prototype.open = function(wrapper_selector, cb){
	
	if(this.isOpened()) return;
	
	var params = {};
	if("object" === typeof wrapper_selector){
		for(var p in wrapper_selector)
			if(wrapper_selector.hasOwnProperty(p))
				params[p] = wrapper_selector[p];
		wrapper_selector = params.wrapper ? params.wrapper : undefined;
		cb = "function" === typeof params.callback ? params.callback : (typeof cb === "function" ? cb : function(){});
	}
	
	if(params.theme) this.theme = params.theme;
	if(params.header_img) this.header_img = params.header_img;
	if(params.loader_img) this.loader_img = params.loader_img;
	
	if("function" === typeof wrapper_selector) cb = wrapper_selector;
	
	if(!wrapper_selector) wrapper_selector = this.wrapper_selector;
	this.wrapper_selector = wrapper_selector;
	if(this.wrapper_selector) this.wrapper = document.querySelector(this.wrapper_selector);
	
	this.bg = this.wrapper === null ? 'rgba(255,255,255,0.9)' : 'transparent';
	if(params.bg) this.bg = params.bg;
	
	var iframe_styles = "background:"+params.bg+"; overflow-x: auto; border: 0px none transparent; padding: 0px; width:100%; height: 100%;";
	if(this.wrapper === null) iframe_styles += "position:fixed; top:0; left:0; overflow-y:auto; z-index: 2147483646;";
	
	this.iframe = document.createElement("iframe");
	this.iframe.setAttribute("style", iframe_styles);
	//this.iframe.setAttribute("scrolling", "no");
	if(this.wrapper) this.wrapper.innerHTML = "";
	
	(this.wrapper ? this.wrapper : document.body).appendChild(this.iframe);
	this.win = this.iframe.contentWindow || this.iframe;
	this.doc = this.iframe.contentDocument || this.iframe.contentWindow.document;
	var d = this;
	this.iframe.onload = function(){
		d.loadDependencies(function(){
			jSQL.load(function(){
				d.drawInterface();
				d.initTabs();
				d.initEvents();
				d.addAllTables();
				d.initCodemirror();
				if("function" === typeof cb) cb();
			});
		});
	};
	this.doc.write("<!doctype HTML><html><head><style>body{font-family:Tahoma, Geneva, sans-serif;}</style></head><body><center><br><br>"+(this.loader_img?"<img src='"+this.loader_img+"' style=width:40vw; /><br>":"")+"<span>Loading jSQL Devel... (<span id='progress'>0%</span>)</span></center></body></html>");
	this.doc.close();
	
}