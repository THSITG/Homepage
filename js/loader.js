$(document).ready(function() {
	var bar=$("#ph_navbar").load("/navbar.html",function() {
		var slot=bar.attr("data-active");
		if(slot) {
			bar.find("li:has(a[href='"+slot+"'])").addClass("active");
		}
	});

	var foot=$("#ph_footer").load("/footer.html");
});
