
devel.prototype.initEvents = function(){
	var $ = this.win.$,
		d = this;
	$("#queryTypeSelect").change(function(){
		var Name, query;
		Name = $(this).val();
		if(undefined === Name || Name === "" || Name === null || Name === false) return;
		for(var o=0; o<d.templates.length; o++)
			if(d.templates[o].Name === Name) query = d.templates[o].Query;
		console.log(query, Name);
		
		d.cm.getDoc().setValue(query);
		$(this).val($(this).find("option:first").val());
	});
	$("#jSQLResetButton").click(function(){
		if(!confirm("Do you want to delete all tables?")) return;
		jSQL.reset();
		d.close();
		d.open();
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
};