var readyforinput=true;
var command = "";
var stage = 0;

var cmdList = [""];
var hintList = [""];
var cursor=null;
var currow=null;
var rows=null;
var intervalID;

var cmdList = [
	"thsitg_boot()",
	"start_tutor()",
	"2014",
	"start_tutor()",
	"start_tutor()",
	"variable = [1,2]",
	"variable",
	"variable = \"I love lcy\"",
	"variable",
	"start_tutor()",
	"1 + 2",
	"20 * 14",
	"10 / 5",
	"7 % 5",
	"\"contact\" + \"multi\"",
	"[1,2,3,4].length",
	"print(variable)",
	"$(\".console\").css(\"background-color\",\"#003\")",
	"$(\".console\").removeAttr(\"style\")",
	"start_tutor()",
	"print3 = function(num) {print(num); print(num*2); print(num*3)}",
	"print3(10)",
	"print3(2014)",
	"greet = function(name) {return \"Hi, \"+name}",
	"[greet(\"lxy\"),greet(\"hzx\"),greet(\"xjz\")]",
	"start_tutor()"
]

var hintList = [
	"执行 start_tutor() 开始教程",
	"输入 2014 并回车",
	"多输入几个数字(负数或者小数), 或者输入 start_tutor() 继续教程",
	"试试以上描述的那几种常量, 或者试试不是常量的东西, 例如 thsitg<br/>输入 start_tutor() 继续教程",
	"执行 variable = [1,2] 定义一个叫做 variable 的变量, 值为一个数组, 包含元素 1 和 2",
	"直接执行 variable , 看看里面存储的值",
	"执行 variable = \"I love lcy\" , 更新variable的值",
	"再执行一次 variable",
	"你可以再试一试定义更多的变量, 改变它们的值<br/>执行 start_tutor() 继续教程",
	"执行 1 + 2 (加法)",
	"执行 20 * 14 (减法)",
	"执行 10 / 5 (除法)",
	"执行 7 % 5 (取余)",
	"以上为针对数字的运算, 当然还有对于其他数据类型的运算<br/>执行 \"contact\" + \"multi\" (连接字符串)",
	"执行 [1,2,3,4].length 查看这个数组的长度",
	"Javascript中可以调用函数, 完成一系列的操作\n执行 print(variable) 输出variable的值<br/>其中print是THSITG Shell中内置的用于输出的函数",
	"你还可以利用内置的类库改变Shell本身. Shell 基于JQuery实现, 执行 $(\".console\").css(\"background-color\",\"#003\") 改变Shell的背景颜色",
	"执行 $(\".console\").removeAttr(\"style\") 恢复Shell的背景颜色",
	"你可以尝试其他一些操作和函数, 这是JQuery的<a href=\"http://api.jquery.com/\" target=\"_blank\">使用说明</a><br/>执行 start_tutor() 继续教程",
	"执行 print3 = function(num) {print(num); print(num*2); print(num*3)} 完成我们刚刚设计的\"三次输出\"函数<br/>注意, 空格不要缺哦, 不然教程无法继续",
	"执行 print3(10) 试一试我们刚完成的函数",
	"执行 print3(2014) 换一个参数试试",
	"函数可以有返回值, 代表这个函数执行后返回给调用者的结果. 执行 greet = function(name) {return \"Hi, \"+name} 定义一个可以返回打招呼的函数",
	"执行 [greet(\"lxy\"),greet(\"hzx\"),greet(\"xjz\")] 同时向三个人打招呼, 把打招呼的字符串放到一个数组里",
	"你可以定义更多的函数, 创造更多地组合. 当你决定继续时, 执行 start_tutor() 完成教程的最后一步",
	"[教程已结束]"
]

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


var cursor_shown=true;
function flash() {
	if(cursor_shown)
		cursor.css("opacity","0");
	else
		cursor.css("opacity","1");

	cursor_shown=!cursor_shown;
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
	if(!readyforinput) return;
	window.clearInterval(intervalID);
	cursor_shown=false;
	cursor.css("opacity","0");

	readyforinput=false;
	var proceed=true;

	if(e.which == 8 || e.which == 46) {
		var len=command.length;
		if(len > 0) command = command.substring(0,len-1);
	} else if(e.which == 9) {
		if(stage < cmdList.length) command = cmdList[stage];
	} else if(e.which == 13) {
		try {
			var result = eval(command);
			currow.find(".result").html("=> "+result).show();
		} catch(exception) {
			currow.find(".error").html(exception).show();
		}

		if(stage>=0) {
			currow=$(initRow).appendTo(".console-rows");
			cursor=cursor.appendTo(currow.find(".cmd"));

			currow.find(".result").hide();
			currow.find(".output").hide();
			currow.find(".error").hide();

			if(stage < cmdList.length) {
				if(cmdList[stage] != null && command != "skip_tutor()" && command != cmdList[stage])
					stage-=1;
				currow.find(".hint").html(hintList[stage]);
			}

			var height = rows.height();
			rows.css("bottom",(height>550?25:550-height) + "px");

			command = "";
			stage+=1;
		}
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

	cursor_shown=true;
	cursor.css("opacity","1");
	intervalID=window.setInterval(flash,500);
	if(stage>=0) readyforinput=true;
}

function stop_shell() {
	readyforinput=false;

	print("正在关闭THSITG Shell...")
	$(".console-closed").insertAfter(".console-rows").show().css("opacity","1");
	$(".console-rows").css("opacity","0.2");
	$(".console").css("background-color","#000");
	cursor=cursor.appendTo(".console-closed-cont");
	cursor.css("font-size","21px");
	stage=-1;
}

function print(v) {
	var f=currow.find(".output");
	f.html(f.html() + v);
	f.show();
	return true;
}

function thsitg_boot() {
	print("\n你好\n"+
			"欢迎访问THSITG的首页\n"+
			"想必你是一名热爱科技, 对信息技术感兴趣的同学了\n\n"+
			"于是我们准备了这个 -- 一个由THSITG制造的虚拟终端\n"+
			"以供你体验代码, 这一信息技术世界中最基本的粒子, 的魅力\n\n"+
			"你要做的是, 向这个黑盒子中输入一条条指令, 她会完成其他的工作. 编程的概念大致如此\n"+
			"指令的格式看上去很像英文, 我们将这种语言叫做 Javascript, Web时代的新宠儿\n"+
			"	对, 这也是一种语言. 和自然语言不同, 我们用她和机械交流, 而不是真人\n\n"+
			"那么, 如果你是一名初学者, 并拥有那么一点点闲暇时光, 不妨跟随我们向广阔的信息技术领域迈出第一步\n" +
			"如果你是一名高手, 可以随时执行 skip_tutor() 跳过教程, 或者, 直接点击右上角的绿色按钮, 找到更多志同道合的朋友");	
}

function skip_tutor() {
	stage = cmdList.length-1;
}

var tutor_stage = 1;
function start_tutor() {
	if(tutor_stage == 1)
		print("\n接下来请允许我向你介绍一下计算机运行程序的基本原则\n"+
				"一切的计算都是围绕数据和操作两部分\n"+
				"计算机根据程序描述的数据和对数据的操作, 进行计算得出结果\n"+
				"让我们先看看Javascript中的数据\n"+
				"注: 在教程中你可以使用Tab键自动填入命令. 这会覆盖已经写出的命令, 请慎用");
	else if(tutor_stage == 2)
		print("\n可以看到绿色的箭头后面显示的就是这段代码代表的值\n" +
				"这是 '常量' 也就是不变的量, 是直接写在代码里的. Javascript除了数字以外, 还有如下几种值可以作为常量出现: \n"+
				"true 和 false: 布尔值, 代表真假的量\n"+
				"'abcdefg' 和 \"abcdefg\": 字符串值, 顾名思义, 就是一段话\n"+
				"[元素,元素,...]: 数组, 代表一系列有序排列的值\n"+
				"除了这些常量和内置的一些操作之外, 若非特别说明, Javascript是不认识任何东西的");
	else if(tutor_stage == 3)
		print("\n有了常量, 自然也有 '变量' ,也就是可以改变的量.\n" +
				"变量里面存储的值可以是在编写程序的时候无法预测的值, 也可以是中途需要改变的值");
	else if(tutor_stage == 4)
		print("\n到现在为止, THSITG Shell做的事看上去还像是小伙伴在摆弄字条\n"+
				"我们需要一些更高端的东西 -- 操作. 在Javascript中, 你可以通过运算符或者函数来对数据进行操作. 或者你可以更专业地称一个操作为 '语句' \n"+
				"Javascript标准已经包含了一些实现好的函数, 你可以直接使用它们\n\n"+
				"来看几个例子");
	else if(tutor_stage == 5)
		print("\n看起来已经很是炫酷了, 不是吗? 其实你会发现Javascript的很多细节很类似自然语言, 或者说, 你可以把它写得很像自然语言\n"+
				"然而我们可以做的更多: 自己编写函数. 想一下这样的场景:\n"+
				"你需要输出一些数, 但是方式比较奇怪, 你要同时输出它的二倍和三倍. 于是对于每个数, 你要调用三次print()\n"+
				"这时候你需要函数. 像刚才所说, 函数是一套操作的组合, 在这里, 就是进行三次输出\n\n"+
				"自定义函数的格式如下\n函数名 = function(参数,参数,参数...)\n{\n	语句\n	语句\n	...\n}\n\n其中参数是传递给函数的值, 语句就是这个函数运行的代码\n\n"+
				"在Javascript中, 换行和空格在大多数情况下对代码的行为没有影响. 如果你的代码足够漂亮, 可以单独写到一行:\n"+
				"name = function(args...){body} 或者 function name(args...){body}\n\n"+
				"由于THSITG Shell的设计漏洞(我们毫不掩饰的指出这一点), 我们只能执行单行代码. 你可以换个角度看: 接下来你写的代码都很漂亮");
	else if(tutor_stage == 6)
		print("\n就这样, 教程告一段落.\n"+
				"还有许多许多方面没有涉及, 往小了说,在这门语言中, 还有循环, 类, 表\n"+
				"往大了说, 还有整个信息技术界, 还有应用开发的技术, 团队管理的技巧, 编写高效算法的能力, 设计页面的情怀\n\n"+
				"真的, 还有很多很多\n\n"+
				"这就是我们. THSITG. 我们致力于用自己的双手去完成一个个令我们自己骄傲的作品, 让冰冷的机器贯彻自己的意念, 向冰冷的世界增添一点的温情\n"+
				"我们用敲击键盘的双手触碰人们的内心, 分享快乐, 分担痛苦\n"+
				"我们可以选择写出令人赏心悦目的代码, 也可以选择我们自己是怎样一个生命\n"+
				"这些都在于我们自己.\n\n"+
				"我们写的不是代码, 而是梦想, 不过如此. 代码只是工具, 你是怎样一个人, 决定人们对你的眼光, 无论是在讲台上, 还是在屏幕前\n"+
				"而这些是这个教程无法表达的. 也不是一节语文、数学课能够传授的.\n"+
				"一切取决于你自己\n\n"+
				"你还可以再在Shell中试一试Javascript的更多特性, 或者执行 show_links() 显示我们推荐的一些学习编程的网站, 执行 thsitg_acts() 看一看我们开学后的计划\n"+
				"当你终于感觉到不能继续时, 执行 stop_shell() 关闭Shell, 关闭显示屏, 出门看看太阳, 见一见那些世上最伟大的程序奇迹: 你身边的人\n"+
				"我们随时等着你回来.");

	tutor_stage+=1;
}

function show_links() {
	print("CodeCademy: 学习编程的网站, 是英文的: <a href=\"http://www.codecademy.com/\" target=\"_blank\">http://www.codecademy.com/</a>\n"+
			"W3School: 可以当做HTML & CSS & JS 参考书的网站: <a href=\"http://www.w3school.com.cn\" target=\"_blank\">http://www.w3school.com.cn</a>\n"+
			"JQuery: 一个很酷的Javascript类库: <a href=\"http://jquery.com/\" target=\"_blank\">http://jquery.com/</a>\n"+
			"StackOverflow: google技术问题会有一半到这里: <a href=\"http://stackoverflow.com/\" target=\"_blank\">http://stackoverflow.com/</a>\n"+
			"Goagent: 说道google, 不得不说这个. 但是我不多说: <a href=\"https://www.github.com/goagent/goagent\" target=\"_blank\">https://www.github.com/goagent/goagent</a>\n"+
			"Google: 当你没有办法的时候, 这里总有办法. 我这里给链接你也开不开的...\n"+
			"CircuitCoder's Gitlab: 这个网站的代码寄存处. 如果你有兴趣好好玩一玩这个网站的话: <a href=\"http://gitlab.circuitcoder.tk/\" target=\"_blank\">http://gitlab.circuitcoder.tk/</a>\n"+
			"Github: 更多人在用的代码寄存站. 如果你对开源感兴趣的话, 一定要加入: <a href=\"https://github.com/\" target=\"_blank\">https://github.com/</a>\n"+
			"以及我们大家喜闻乐见的 Rails, Node.js, Bitbucket, Vim&Emacs, Linux, Tornado 等等, 就留给大家自己Google了. 不要用baidu");
}

function thsitg_acts() {
	print("开学我们主要会进行如下的活动:"+
			"<ul><li>第1~2节课, 帮大家入门Web开发. 同学们大概会被分为两批人, 一批专攻后端开发, 另一批做前端或者设计. 这个概念比较晦涩难懂, 到时候我们解释一下大家就会明白了, 么么哒</li>"+
			"<li>之后的几节课我们会带着大家用刚入门的只是完成一个产品, 最后会交付给学校. 期间大家可以进一步学习Web开发的有关知识</li>"+
			"<li>由于我们和Illumer的关系比较密切, 可能会带着一些比较拔尖的同学参加Illumer的项目和活动, 关于详情请点击上方友情链接 -> illumer</li>"+
			"<li>再往后...说实话我们还没太想好, 这一些就足以做半个学期了. 先这样.</li></ul>");
}

function shell_about() {
	print("看来你还真是仔细看了代码啊...先让我拜一下, ORZ高手\n"+
			"这个简单的Shell由C1114 -> G1412 的刘晓义开发, 里面各种不明所以的短语和翔一样的代码风格就不要吐了. 很遗憾, 我还不是一个优秀的程序员. 望共勉.\n"+
			"我的WeChat: @CircuitCoder");
}

$(document).ready(function() {
	intervalID=window.setInterval(flash,500);
	rows=$(".console-rows");
	var height = rows.height();
	rows.css("bottom",(height>550?25:550-height) + "px");

	cursor=$(".console .cursor");
	currow=$(".console-first");
	currow.find(".result").hide();
	currow.find(".output").hide();
	currow.find(".error").hide();
	
	$(".console-closed").css("opacity","0");

	$(".console").keydown(input);
});
