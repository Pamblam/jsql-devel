
devel.prototype.open = function(wrapper_selector, cb){
	
	if(this.isOpened()) return this;
	
	if("function" === typeof wrapper_selector) cb = wrapper_selector;
	
	if(!wrapper_selector) wrapper_selector = this.wrapper_selector;
	this.wrapper_selector = wrapper_selector;
	if(this.wrapper_selector) this.wrapper = document.querySelector(this.wrapper_selector);
	
	var iframe_styles = "overflow-x: auto; border: 0px none transparent; padding: 0px; width:100%; height: 100%;";
	iframe_styles += this.wrapper === null ? 
		"position:fixed; top:0; left:0; overflow-y:auto; z-index: 2147483646; background: rgba(255,255,255,0.9);" :
		"background-color: transparent;" ;
	
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
	this.doc.write("<!doctype HTML><html><head><style>body{font-family:Tahoma, Geneva, sans-serif;}</style></head><body><span>Loading jSQL Devel... (<span id='progress'>0%</span>)</span></body></html>");
	this.doc.close();
	
}