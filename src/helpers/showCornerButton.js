
function showCornerButton(cb) {
	var bgcolor = "undefined" === typeof jSQL ? "lightblue" : "lightgreen";
	document.body.insertAdjacentHTML("afterbegin", "<div id=jsqldevelinitbtn style=\"width:20px;height:20px;border-bottom-right-radius:100%;background:" + bgcolor + ";position:absolute;top:0;left:0;font-weight:bold;font-family:'Lucida Sans Unicode', 'Lucida Grande', sans-serif; font-size:.8em; padding:3px;margin:0;\">jD</div>");
	document.getElementById('jsqldevelinitbtn').onclick = function () {
		loadjSQL(function(){
			cb();
		});
	};
}