
devel.prototype.makeTableHTML = function(data, drawData) {
	var html, name, i, type, val;
	if(undefined === drawData) drawData = true;
	html = [];
	html.push('<table><thead><tr>');
	for (name in data[0])
		html.push('<th>' + name + '</th>');
	html.push('</tr></thead><tbody>');
	for (i = 0; i < data.length; i++) {
		if(!drawData) break;
		html.push('<tr>');
		for (name in data[i]) {
			type = typeof data[i][name];
			val = type !== "string" && type !== "number" ? "[" + type + "]" : data[i][name];
			if (val.length > 50)
				val = val.substring(0, 47) + "...";
			html.push('<td>' + val + '</td>');
		}
		html.push('</tr>');
	}
	html.push('</tbody></table>');
	return html.join('');
};