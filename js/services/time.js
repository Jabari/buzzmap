Date.prototype.stdTimezoneOffset=function() {
	var jan=new Date(this.getFullYear(),0,1);
	var jul=newDate(this.getFullYear(),6,1);
	return Math.max(
		jan.getTimezoneOffset(),
		jul.getTimezoneOffset()
	);
}

Date.prototype.dst=function(){
	return this.getTimezoneOffset()<this.stdTimezoneOffset();
}

Date.prototype.printLocalTimezone=function(){
	var gmtHours=-this.getTimezoneOffset()/60;
	var xc='';
	varextra='';
	var extras=':00';
	if(Math.floor(gmtHours)<gmtHours){
		if(gmtHours>0) {
			extra=(gmtHours-(Math.floor(gmtHours)))*60;gmtHours=Math.floor(gmtHours);
		} else {
			gmtPositive=Math.abs(gmtHours);
			extra=(gmtPositive-(Math.floor(gmtPositive)))*60;
			gmtHours=Math.floor(gmtHours)+1;
		}
		extras=':'+(Math.round(extra))+'';
	}
	if(gmtHours>=0)xc="+";
	return"GMT"+xc+gmtHours+extras;
}

function HumanToEpoch(){
	var datum=new Date(Date.UTC(document.hf.yyyy.value,document.hf.mm.value-1,
		document.hf.dd.value,document.hf.hh.value,document.hf.mn.value,document.hf.ss.value));
	document.getElementById('result2')
	.innerHTML="<b>Epoch timestamp</b>: "+(datum.getTime()/1000.0)+"<br>Human time:"+datum.toUTCString();
}

function localTimezone(d){
	if(!d){
		d=new Date();
	}
	var gmtHours=-d.getTimezoneOffset()/60;
	var xc="";
	if(gmtHours>-1)
		xc="+";
	return"GMT"+xc+gmtHours;
}
var clockActive=1;
var timerID=0;
function now(){
	var today=new Date();
	document.getElementById('now')
	.innerHTML=Math.round(today.getTime()/1000.0);
	if(clockActive){
		timerID=setTimeout("now()",1000);
	}
}

function parseMonth(mnth){switch(mnth.toLowerCase()){case'january':case'jan':case'enero':return 1;case'february':case'feb':case'febrero':return 2;case'march':case'mar':case'marzo':return 3;case'april':case'apr':case'abril':return 4;case'may':case'mayo':return 5;case'jun':case'june':case'junio':return 6;case'jul':case'july':case'julio':return 7;case'aug':case'august':case'agosto':return 8;case'sep':case'september':case'septiembre':case'setiembre':return 9;case'oct':case'october':case'octubre':return 10;case'nov':case'november':case'noviembre':return 11;case'dec':case'december':case'diciembre':return 12;}
return mnth;}

function jumpTo(toid){var new_position=$('#'+toid).offset();window.scrollTo(new_position.left,new_position.top);}

function isValidDate(d){if(Object.prototype.toString.call(d)!=="[object Date]")
return false;return!isNaN(d.getTime());}