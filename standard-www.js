(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// auto-generated DOM ids are prefixed with `user-content-` for security reasons
// this checks whether someone has clicked on an auto-generated id, and updates
// the URL fragment to not include the prefix.

var rehash = require('marky-deep-links')

rehash()

},{"marky-deep-links":7}],2:[function(require,module,exports){
module.exports = function(arr, obj){
  if (arr.indexOf) return arr.indexOf(obj);
  for (var i = 0; i < arr.length; ++i) {
    if (arr[i] === obj) return i;
  }
  return -1;
};
},{}],3:[function(require,module,exports){
/*
 * detect-dom-ready
 * http://github.amexpub.com/modules/detect-dom-ready
 *
 * Copyright (c) 2013 AmexPub. All rights reserved.
 */

module.exports = require('./lib/detect-dom-ready');

},{"./lib/detect-dom-ready":4}],4:[function(require,module,exports){
/*
 * detect-dom-ready
 * http://github.amexpub.com/modules
 *
 * Copyright (c) 2013 Amex Pub. All rights reserved.
 */

'use strict';

module.exports = function(callback){
    // if ( this.readyBound ) {return;}
    // this.readyBound = true;

    if(document.addEventListener){
        document.addEventListener( "DOMContentLoaded", function(){
            //remove listener
            callback();
            return;
        }, false );
    }
    else if(document.attachEvent){
        document.attachEvent("onreadystatechange", function(){
            if ( document.readyState === "complete" ) {
                //remove listener
                callback();
                return;
            }
        });

        if ( document.documentElement.doScroll && window === window.top ){
            try{
                // If IE is used, use the trick by Diego Perini
                // http://javascript.nwbox.com/IEContentLoaded/
                document.documentElement.doScroll("left");

            }
            catch( error ) {
                callback();
                return;
            }
            // and execute any waiting functions
            callback();
            return;
        }
    }
};
},{}],5:[function(require,module,exports){

var hasOwn = Object.prototype.hasOwnProperty;
var toString = Object.prototype.toString;

module.exports = function forEach (obj, fn, ctx) {
    if (toString.call(fn) !== '[object Function]') {
        throw new TypeError('iterator must be a function');
    }
    var l = obj.length;
    if (l === +l) {
        for (var i = 0; i < l; i++) {
            fn.call(ctx, obj[i], i, obj);
        }
    } else {
        for (var k in obj) {
            if (hasOwn.call(obj, k)) {
                fn.call(ctx, obj[k], k, obj);
            }
        }
    }
};


},{}],6:[function(require,module,exports){
var each = require('each'),
	indexOf = require('indexof');

var getFragment = function( url ){

	var url = url || window.location.href;
	return url.replace( /^[^#]*#?(.*)$/, '$1' );

};

var HashChange = function(){

	var self = this;

	this.onChangeCallbacks = [];

	window.addEventListener("hashchange", function(e){
		
		self.hashChanged( getFragment(e.newURL) );

	}, false);

	return this;

};

HashChange.prototype = {

	update : function( callback ){

		if(callback){

			this.onChangeCallbacks.push( callback );
			return this;

		} else {

			this.hashChanged( getFragment() );

		}

	},

	unbind : function( callback ){

		var i = indexOf( this.onChangeCallbacks , callback);

		if(i !== -1){

			this.onChangeCallbacks.splice(i - 1, 1);

		}

		return this;

	},
	
	updateHash : function( hash ){
 
			this.currentHash = hash;
 
			window.location.href = window.location.href.replace( /#.*/, '') + '#' + hash;
 
		},

	hashChanged : function( frag ){

		if(this.onChangeCallbacks.length){

			each(this.onChangeCallbacks, function( callback ){

				callback( frag );

				return true;

			});

		}

		return this;

	},


}

hashChange = new HashChange();

module.exports = hashChange;

},{"each":5,"indexof":2}],7:[function(require,module,exports){
module.exports = markyDeepLinks

var hashchange = require('hashchange')
var domReady = require('detect-dom-ready')

function markyDeepLinks (prefix) {
  hashchange.update(function (hash) {
    var prefix = prefix || 'user-content-'

    if (hash.indexOf(prefix) === 0) {
      hashchange.updateHash(hash.replace(prefix, ''))
    } else {
      var anchor = document.getElementById(prefix + hash)
      if (anchor) {
        window.scrollTo(window.scrollX, anchor.getBoundingClientRect().top + window.scrollY)
      }
    }
  })

  domReady(function () {
    hashchange.update()
  })
}

},{"detect-dom-ready":3,"hashchange":6}]},{},[1]);
