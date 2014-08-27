$(document).ready(function() {
	var bar=$("#ph_navbar").load("/navbar.html");
	var slot=bar.attr("data-active");
	if(slot) {
		bar.find(slot).addClass("active");
	}

	var foot=$("#ph_footer").load("/footer.html");
});
