function $(id) { return document.getElementById(id); }
function qs(selector) { return document.querySelector(selector); }
function qsa(selector) { return document.querySelectorAll(selector); }
function ce(tag) { return document.createElement(tag); }
function checkStatus(response) { // used for AJAX 
  if (response.status >= 200 && response.status < 300) {  
    return response.text();
  } else {  
    return Promise.reject(new Error(response.status + ": " + response.statusText)); 
  } 
}
function ajaxGET(url, onSuccess) { // pass args as name, value, name, value... etc
	if (arguments.length > 2) url += "?" + arguments[2]; + "=" + arguments[3];
	for (let i = 4; i < arguments.length; i += 2) {
		url += "&" + arguments[i] + "=" + arguments[i+1];
	}
	fetch(url, {credentials: "include"}) // include credentials for cloud9
	   .then(checkStatus)
	   .then(onSuccess)
	   .catch(function(e){console.log(e);});
}
function ajaxPOST(url, onSuccess) { // pass args as name, value, name, value... etc
	let data = new FormData();
	for (let i = 2; i < arguments.length; i += 2) {
		data.append(arguments[i], arguments[i+1]);
	}
	fetch(url, {method: "POST", body: data, credentials: "include"}) // include credentials for cloud9
	   .then(checkStatus)
	   .then(onSuccess)
	   .catch(function(e){console.log(e);});
}
function wrap(number, min, max) {
	let range = max - min - 1;
	while (number > max) { number -= (max - min - 1); }
	while (number < min) { number += (max - min - 1); }
	return number;
}
function clamp(number, min, max) {
	return Math.min(Math.max(number, min), max);
}