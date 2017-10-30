
devel.prototype.addColumnRow = function(){
	var $ = this.win.$;
	var d = this;
	var typesOptions = ['<option>Choose...</option>'];
	for(i=0; i<jSQL.types.list.length; i++){
		typesOptions.push("<option value='"+jSQL.types.list[i].type+"'>"+jSQL.types.list[i].type+"</option>");
		if(jSQL.types.list[i].aliases && jSQL.types.list[i].aliases.length){
			for(var n=0; n<jSQL.types.list[i].aliases.length; n++){
				typesOptions.push("<option value='"+jSQL.types.list[i].aliases[n]+"'> -- "+jSQL.types.list[i].aliases[n]+"</option>");
			}
		}
	}
	var $row =$("<tr>"+
				"	<td><input type=text class=colname-jma placeholder='Column Name' /></td>"+
				"	<td>"+
				"		<select>"+(typesOptions.join(''))+"</select>"+
				"	</td>"+
				"	<td><input type=checkbox class=col-null-jma /></td>"+
				"	<td><input type=text class=col-default-jma style=width:6em /></td>"+
				"	<td><input type=checkbox class=col-ai-jma /></td>"+
				"	<td><input type=checkbox class=col-pk-jma /></td>"+
				"	<td><input type=checkbox class=col-un-jma /></td>"+
				"	<td><span class='ui-icon ui-icon-circle-close'></span></td>"+
				"</tr>");
	$("#jSQLNewTableTab").find("tbody").append($row);
	$row.find(".ui-icon-circle-close").click(function(){
		$row.remove();
	});
	this.typeChangeEvent($row, typesOptions);
};