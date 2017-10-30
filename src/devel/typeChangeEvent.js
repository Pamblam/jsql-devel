
devel.prototype.typeChangeEvent = function($row, typesOptions){
	var d = this;
	var $ = this.win.$;
	$row.find("select").change(function(){
		var type = $(this).val();
		switch(type){
			case "NUMERIC": case "NUMBER": case "DECIMAL": case "FLOAT":
			case "TINYINT": case "SMALLINT": case "MEDIUMINT": case "INT": case "BIGINT":
				d.typeParamPrompt(type, "display width", "", function(val){
					$row.data("type", type);
					$row.data("type-param", val);
					var $td = $row.find("select").parent().empty();
					$td.append(type+"("+val+") <span class='ui-icon ui-icon-pencil'></span>");
					$td.find(".ui-icon-pencil").click(function(){
						$row.data("type", "");
						$row.data("type-param", "");
						$td.html("<select>"+(typesOptions.join(''))+"</select>");
						d.typeChangeEvent($row, typesOptions);
					});
				});
				break;
			case "VARCHAR": case "LONGTEXT": case "MEDIUMTEXT":
				d.typeParamPrompt(type, "string length", "", function(val){
					$row.data("type", type);
					$row.data("type-param", val);
					var $td = $row.find("select").parent().empty();
					$td.append(type+"("+val+") <span class='ui-icon ui-icon-pencil'></span>");
					$td.find(".ui-icon-pencil").click(function(){
						$row.data("type", "");
						$row.data("type-param", "");
						$td.html("<select>"+(typesOptions.join(''))+"</select>");
						d.typeChangeEvent($row, typesOptions);
					});
				});
				break;
			case "ENUM":
				d.enumParamPrompt(function(vals){
					if(!vals){
						$row.find("select").find("option").eq(0).prop("selected", true);
						return false;
					}
					$row.data("type", type);
					$row.data("type-param", vals);
					var $td = $row.find("select").parent().empty();
					$td.append(type+"('"+(vals.join("','"))+"') <span class='ui-icon ui-icon-pencil'></span>");
					$td.find(".ui-icon-pencil").click(function(){
						$row.data("type", "");
						$row.data("type-param", "");
						$td.html("<select>"+(typesOptions.join(''))+"</select>");
						d.typeChangeEvent($row, typesOptions);
					});
				});
				break;
			case "CHAR":
				d.typeParamPrompt(type, "char length", "4", function(val){
					if(!val || val===""){
						d.alert("You must enter a char length for the char type.", "Error", "ui-icon-alert");
						$row.find("select").find("option").eq(0).prop("selected", true);
						return false;
					}
					$row.data("type", type);
					$row.data("type-param", val);
					var $td = $row.find("select").parent().empty();
					$td.append(type+"("+val+") <span class='ui-icon ui-icon-pencil'></span>");
					$td.find(".ui-icon-pencil").click(function(){
						$row.data("type", "");
						$row.data("type-param", "");
						$td.html("<select>"+(typesOptions.join(''))+"</select>");
						d.typeChangeEvent($row, typesOptions);
					});
				});
				break;
			default:
				$row.data("type", type);
				$row.data("type-param", '');
				var $td = $row.find("select").parent().empty();
				$td.append(type+" <span class='ui-icon ui-icon-pencil'></span>");
				$td.find(".ui-icon-pencil").click(function(){
					$row.data("type", "");
					$row.data("type-param", "");
					$td.html("<select>"+(typesOptions.join(''))+"</select>");
					d.typeChangeEvent($row, typesOptions);
				});
		}
	});
};