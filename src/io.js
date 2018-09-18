/***** AJAX METHODS *****/

// generic AJAX GET method, adapted from my code hosted online at
// https://brennancolberg.github.io/abbr/js/ajax.js
function ajaxGET(url, onSuccess) {
	fetch(url, { credentials: "include" })
		.then(function(r) { 
			if (r.status >= 200 && r.status < 300) {
				return r.text();
			}
		})
		.then(onSuccess)
		.catch(function(e) { 
			console.log(e);
		});
}


/***** COOKIE METHODS *****/

// milliseconds in each day
const MS_PER_DAY = 1000 * 60 * 60 * 24;

// saves a cookie to the system
function saveCookie(title, data, path = "/", days = 30) {
	let date = new Date();
	date.setTime(date.getTime() + (days * MS_PER_DAY));
	let dataString = title.trim() + "=" + data + ";";
	let expirationString = "expires=" + date.toUTCString() + ";";
	let pathString = "path=" + path;
	document.cookie = dataString + expirationString + pathString;
}

// loads a cookie from the system
function loadCookie(title, path = "/") {
	let cookie = decodeURIComponent(document.cookie);
	let vars = cookie.split(';');
	for (let i = 0; i < vars.length; i++) {
		let parts = vars[i].split('=');
		if (parts[0].trim() === title.trim()) {
			return parts[1].trim();
		}
	}
	return undefined;
}

// completely erases a named cookie from the given path
function eraseCookie(title, path = "/") {
	saveCookie(title, "", path, -1);
}

// simple boolean method to see if a cookie matches a certain option
function cookieEquals(value, title, path = "/") {
	return loadCookie(title, path) == value;
}

// tests whether or not a cookie exists on the current path (easy check for
// if to recall a save, etc)
function cookieExists(title, path = "/") {
	return !cookieEquals(undefined, title, path);
}