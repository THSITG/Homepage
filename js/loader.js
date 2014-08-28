$(document).ready(function() {
	var bar=$("#ph_navbar").load("/navbar.html",function() {
		var slot=bar.attr("data-active");
		if(slot) {
			bar.find("li:has(a[href='"+slot+"'])").addClass("active");
		}

		$("#joinBtn").click(function() {
			if(!$(".join-popup").hasClass("popup-hidden")) {
				$(".join-popup").addClass("popup-hidden");
				window.setTimeout(function() {
					if($(".join-popup").hasClass("popup-hidden")) $(".join-popup").hide();
				},150);
			} else {
				$(".join-popup").show();
				window.setTimeout(function() {
					$(".join-popup").removeClass("popup-hidden");
				},0);
			}
		});
		$(".join-popup").click(function() {
			$(".join-popup").addClass("popup-hidden");
			window.setTimeout(function() {
				if($(".join-popup").hasClass("popup-hidden")) $(".join-popup").hide();
			},150);
		});
	});

	var foot=$("#ph_footer").load("/footer.html");
});
