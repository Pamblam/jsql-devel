
devel.prototype.close = function(){
	this.iframe.parentNode.removeChild(this.iframe);
	if(this.wrapper) this.wrapper.innerHTML = "";
	this.iframe = null;
	this.wrapper = null;
	this.win = null;
	this.doc = null;
	this.cm = null;
	this.drawnTables = [];
};

