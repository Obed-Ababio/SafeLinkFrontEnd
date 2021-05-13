/**

// loop through href attributes and put them in array
// that will be sent to backend.
var pageLinksArray = []; 
var pageLinks = document.links;
for (var i=0; i<pageLinks.length; i++) {
	pageLinksArray.push(pageLinks[i].href);
}

chrome.runtime.sendMessage({message: pageLinksArray});
//console.log(pageLinksArray);

**/

var currentLocation = window.location.href;
chrome.runtime.sendMessage({ message: currentLocation });

/**
NOTES
How to setup a basic flask server
App.py, import flask, falsk objects and define endpoints
**/
