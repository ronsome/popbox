/*
* popbox.js <http://ronsome.com/projects/Popbox>
* 2012-12-23
* (c) Ron Newsome, Jr.
* Released under a Creative Commons license 
* <http://creativecommons.org/licenses/by/3.0/us/>
*/

if(document.querySelectorAll('script[src$="popbox.js?css"]').length){
	document.write('<link rel="stylesheet" type="text/css" href="/css/popbox.css" />');
	document.close();
}

Element.prototype.addGesture = function(gesture, callback){
	const elmnt = this;
	function start(evt){
		if(evt.targetTouches.length > 1){// 2 or more fingers touching
			evt.target.xCoord = evt.targetTouches[0].pageX;
			evt.target.yCoord = evt.targetTouches[0].pageY;
			document.documentElement.touching = evt.target;
			
		}
	}

	const stop = {
		"swipeRight": function(evt){
			if(document.documentElement.touching) {
				elmnt = document.documentElement.touching;
				if(evt.touches[0].pageX > elmnt.xCoord){
					document.documentElement.touching = null;
					callback(elmnt);
				}
			}
		},
		"swipeLeft": function(evt){
			if(document.documentElement.touching) {
				elmnt = document.documentElement.touching;
				if(evt.touches[0].pageX < elmnt.xCoord){
					document.documentElement.touching = null;
					callback(elmnt);
				}
			}
		},
		"swipeUp": function(evt){
			if(document.documentElement.touching) {
				elmnt = document.documentElement.touching;
				if(evt.touches[0].pageY < elmnt.yCoord){
					document.documentElement.touching = null;
					callback(elmnt);
				}
			}
		},
		"swipeDown": function(evt){
			if(document.documentElement.touching) {
				elmnt = document.documentElement.touching;
				if(evt.touches[0].pageY > elmnt.yCoord){
					document.documentElement.touching = null;
					callback(elmnt);
				}
			}
		}
	}
	elmnt.addEventListener('touchstart', start, false);
	elmnt.addEventListener('touchmove', stop[gesture], false);
}

void(function(){
	function $(el){ return document.getElementById(el); }
	function $$(sel){ return document.querySelectorAll(sel); }
	function $E(tag, atts){
		var el = document.createElement(tag);
		for(every in atts){ el[every] = atts[every]; }
		return el; 
	}

	function view(a){
		var shadowWidth = document.documentElement.clientWidth;
		var shadowHeight = 60 + document.documentElement.clientHeight;
		var wrapper = new $E('div',{className:'rn_popbox'});
		wrapper.remove = () => wrapper.parentNode.removeChild(wrapper);
		wrapper.dismiss = () => {
			wrapper.classList.add('rn_popbox_fade');
			setTimeout(wrapper.remove, 600);
		}
		wrapper.ttl = new $E('div',{className:'rn_popbox_ttl', 
			innerHTML:(a.title || '')});
		wrapper.image = new $E('img',{className:'rn_popbox_image', 
			src:a.href, alt:(a.title || "")});
		if(a.title)
			wrapper.appendChild(wrapper.ttl);
		wrapper.appendChild(wrapper.image);

		wrapper.image.addGesture('swipeLeft', wrapper.dismiss);

		wrapper.addEventListener('click', evt => {
			if(evt.target.className == 'rn_popbox')
				evt.target.dismiss();
		}, false);

		wrapper.style.height = shadowHeight + 'px';
		document.body.appendChild(wrapper);
		return false;
	}

	function resetSize(){
		if($$('.rn_popbox').length){
			let shadowHeight = document.documentElement.clientHeight;
			$$('.rn_popbox')[0].style.height = shadowHeight + 'px';
		}
	}

	window.rn_popbox_init = function(){
		var pops = $$('[rel="popbox"],[data-popbox]');
		for(var i=0; i<pops.length; i++){
			pops[i].onclick = function(){ return view(this); };
		}
		document.documentElement.addEventListener('keyup', evt => {
			if(evt.keyCode == '27' && $$('.rn_popbox').length)
				$$('.rn_popbox')[0].dismiss();
		}, false);
	}

	document.addEventListener('DOMContentLoaded', rn_popbox_init, false);
	window.addEventListener('resize', resetSize, false);
})();
