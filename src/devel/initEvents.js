
devel.prototype.initEvents = function(){
	var $ = this.win.$,
		d = this;
	$("#queryTypeSelect").change(function(){
		var Name, query;
		Name = $(this).val();
		if(undefined === Name || Name === "" || Name === null || Name === false) return;
		for(var o=0; o<d.templates.length; o++)
			if(d.templates[o].Name === Name) query = d.templates[o].Query;
		d.cm.getDoc().setValue(query);
		$(this).val($(this).find("option:first").val());
	});
	$("#jSQLResetButton").click(function(){
		d.confirm("Do you want to delete all tables?", function(confirmed){
			if(!confirmed) return;
			jSQL.reset();
			d.close();
			d.open();
		});
	});
	$("#jSQLCommitButton").click(function(){
		jSQL.commit();
		$("#jSQLCommitButton").button("option", "label", "Committed!");
		setTimeout(function(){
			$("#jSQLCommitButton").button("option", "label", "Commit");
		},2000);
	});
	$("#jSQLExecuteQueryButton").click(function(){
		d.runjSQLQuery();
	});
	$("#jSQLMinifyQueryButton").click(function(){
		d.minifyjSQLQuery();
	});
	$("#addTableColumnRow").click(function(){
		d.addColumnRow();
	});
	$("#resetTableBuilder").click(function(){
		$("#jSQLNewTableTab").find("tbody").empty();
		$("#tableName").val("");
		d.addColumnRow();
	});
	$("#runTableBuilder").click(function(){
		var sql = ["-- Generated with jSQL Devel on "+devel.dateFormatter(new Date(), "l, F jS Y, g:ia")+" \nCREATE TABLE "];
		if($("#ifnotexists").is(":checked")) sql.push("IF NOT EXISTS ");
		var table_name = $("#tableName").val();
		if(!table_name || table_name == "") return d.alert("You must enter a table name.", "Error", "ui-icon-alert");
		sql.push("`"+table_name+"` (\n");
		var primary_keys = [];
		var error = false;
		$("#jSQLNewTableTab").find("tbody").find("tr").each(function(){
			if(error) return;
			var colNme = $(this).find(".colname-jma").val();
			if(!colNme || colNme == "") return d.alert("You must enter a column namefor ever column.", "Error", "ui-icon-alert");
			sql.push("\t`"+colNme+"`");
			var type = $(this).data("type");
			var param = $(this).data("type-param");
			if(Array.isArray(param)) param = '"'+(param.join('", "'))+'"';
			if(type && type !== ""){
				sql.push(" "+type);
				if(param && param !== "") sql.push("("+param+")");
			}
			sql.push($(this).find(".col-null-jma").is(":checked")?" NULL":" NOT NULL");
			var def = $(this).find(".col-default-jma").val();
			if(def && def !== ""){
				if(["NUMERIC","NUMBER","DECIMAL","FLOAT","TINYINT","SMALLINT","MEDIUMINT","INT","BIGINT"].indexOf(type)>-1) def = parseFloat(def);
				else def = '"'+devel.stripQuotes(def)+'"';
				sql.push(" DEFAULT "+def);
			}
			if($(this).find(".col-ai-jma").is(":checked")){
				if(!$(this).find(".col-pk-jma").is(":checked") || type !== "INT"){
					error = true;
					return d.alert("AUTO_INCREMENT colunm must be INT type and PRIMARY KEY.", "Error", "ui-icon-alert");
				}
				sql.push(" AUTO_INCREMENT");
			}
			if($(this).find(".col-un-jma").is(":checked")) sql.push(" UNIQUE KEY");
			if($(this).find(".col-pk-jma").is(":checked")) primary_keys.push(colNme);
			sql.push(",\n");
		});
		if(error) return;
		if(primary_keys.length){
			sql.push("\tPRIMARY KEY (`"+(primary_keys.join("`, `"))+"`)\n");
		}
		sql.push(")");
		$('#jSQLTableTabs').tabs("option", "active", 1);
		d.cm.getDoc().setValue(sql.join(''));
	});
	$("#jSQLShowCodeButton").click(function(){
		d.showCode();
	});
};