
devel.stripQuotes = function(string){
	if(!string.length) return "";
	if((string[0] === "'" || string[0] === '"') && string[0] === string[string.length-1])
		string = string.substr(1, string.length - 2);
	return string;
};