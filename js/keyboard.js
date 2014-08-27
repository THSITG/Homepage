// From http://code.tutsplus.com/tutorials/creating-a-keyboard-with-css-and-jquery--net-5774
var writeCallback = function(e) {},
        shift = false,
        capslock = false;

function showkeyboard(callback) {
	writeCallback=callback;
	$("#keyboard-wrapper").css("bottom","0");
}
$(function(){
	$("#ph_keyboard").load("/keyboard.html", function() {
		$("#keyboard").focus(function() {
			return false;
		});
		$('#keyboard li').click(function(){
			var $this = $(this),
				character = $this.html(); // If it's a lowercase letter, nothing happens to this variable

			if($this.hasClass('close')) {
				$("#keyboard-wrapper").css("bottom","-140px");
				return false;
			}
			 
			// Shift keys
			if ($this.hasClass('left-shift') || $this.hasClass('right-shift')) {
				if(!capslock) $('.letter').toggleClass('uppercase');
				$('.symbol span').toggle();
				 
				shift = !shift;
				capslock = false;
				return false;
			}
			 
			// Caps lock
			if ($this.hasClass('capslock')) {
				$('.letter').toggleClass('uppercase');
				capslock = !capslock;
				return false;
			}
			 
			// Delete
			if ($this.hasClass('delete')) {
				writeCallback("!DEL");
				return false;
			}
			 
			// Special characters
			if ($this.hasClass('symbol')) character = $('span:visible', $this).html();
			if ($this.hasClass('space')) character = ' ';
			if ($this.hasClass('tab')) character = "\t";
			if ($this.hasClass('return')) character = "\n";
			 
			// Uppercase letter
			if ($this.hasClass('uppercase')) character = character.toUpperCase();
			 
			// Remove shift once a key is clicked.
			if (shift === true) {
				$('.symbol span').toggle();
				if (capslock === false) $('.letter').toggleClass('uppercase');
				 
				shift = false;
			}
			 
			writeCallback(character);
		});
	});
});

