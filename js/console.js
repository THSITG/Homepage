var readyforinput=true;
var command = "";
var stage = 0;

var cmdList = [""];
var hintList = [""];
var cursor=null;
var currow=null;
var intervalID;

// FROM http://stackoverflow.com/questions/2220196/how-to-decode-character-pressed-from-jquerys-keydowns-event-handler
// Modified a little bit
var _to_ascii = {
	'188': '44',
	'109': '45',
	'190': '46',
	'191': '47',
	'192': '96',
	'220': '92',
	'222': '39',
	'221': '93',
	'219': '91',
	'173': '45',
	'187': '61', //IE Key codes
	'186': '59', //IE Key codes
	'189': '45',  //IE Key codes
	
	//Numpad
	'96': '48',
	'97': '49',
	'98': '50',
	'99': '51',
	'100': '52',
	'101': '53',
	'102': '54',
	'103': '55',
	'104': '56',
	'105': '57',
	'106': '42',
	'107': '43',
	'110': '46',
	'111': '47'
}

var escapeMap = {
	" ": "&#160;",
	"	": "&#160;&#160;&#160;&#160;",
	"\"": "&#34;",
	"'": "&#39;",
	"<": "&#60;",
	">": "&#62;",
	"&": "&#38;"
}

var shiftUps = {
	"96": "~",
	"49": "!",
	"50": "@",
	"51": "#",
	"52": "$",
	"53": "%",
	"54": "^",
	"55": "&",
	"56": "*",
	"57": "(",
	"48": ")",
	"45": "_",
	"61": "+",
	"91": "{",
	"93": "}",
	"92": "|",
	"59": ":",
	"39": "\"",
	"44": "<",
	"46": ">",
	"47": "?"
};

var ignoreSet = [
	37, 38, 39, 40,	//Arrow keys
	16, 17, 18 // Control keys
];

var skipSet = [
	112,113,114,115,116,117,118,119,120,121,122,123, //Functional keys
	33,34,35,36, // Navigation keys
];


function flash() {
	cursor.toggle();
}

var initRow=
'<div class="console-row">' +
	'<div class="hint">' +
	'</div>' +
	'<span class="cmd">' +
		'<pre class="cont">THSITG $&gt; </pre>' +
	'</span>' +
	'<pre class="output"></pre>' +
	'<pre class="error"></pre>' +
	'<pre class="result"></pre>' +
'</div>';

function input(e) {
	window.clearInterval(intervalID);
	cursor.hide();

	if(!readyforinput) return;
	readyforinput=false;
	var proceed=true;

	if(e.which == 8 || e.which == 46) {
		var len=command.length;
		if(len > 0) command = command.substring(0,len-1);
	} else if(e.which == 13) {
		try {
			console.log("eval: "+command);
			var result = eval(command);
			currow.find(".result").html("=> "+result).show();
		} catch(exception) {
			currow.find(".error").html(exception).show();
		}

		currow=$(initRow).insertBefore(".console-row-final");
		cursor=cursor.appendTo(currow.find(".cmd"));
		currow.find(".result").hide();
		currow.find(".output").hide();
		currow.find(".error").hide();
		command = "";
	} else {
		var c = e.which;
		if($.inArray(c,ignoreSet)<0) {
			if($.inArray(c,skipSet)>=0) {
				proceed=false;
			} else {
				//normalize keyCode 
				if (_to_ascii.hasOwnProperty(c)) {
					c = _to_ascii[c];
				}
				if (!e.shiftKey && (c >= 65 && c <= 90)) {
					c = String.fromCharCode(c + 32);
				} else if (e.shiftKey && shiftUps.hasOwnProperty(c)) {
					//get shifted keyCode value
					c = shiftUps[c];
				} else {
					c = String.fromCharCode(c);
				}
			}
		} else {
			c=""; //Ignore this character
		}
		
		if(proceed) command = command+c;
	}

	if(proceed) {
		e.stopPropagation();
		e.preventDefault();
		currow.find(".cont").html("THSITG $&gt; "+command);
	}

	cursor.show();
	intervalID=window.setInterval(flash,500);
	readyforinput=true;
}

function iamready() {
	readyforinput=false;
	$(".console-row-final").show();
	cursor=cursor.appendTo(".console-row-final-cont");
}

function print(v) {
	var f=currow.find(".output");
	f.html(f.html() + v);
	f.show();
	return true;
}

$(document).ready(function() {
	intervalID=window.setInterval(flash,500);
	cursor=$(".console .cursor");
	currow=$(".console-first");
	currow.find(".result").hide();
	currow.find(".output").hide();
	currow.find(".error").hide();
	
	$(".console").keydown(input);
});
