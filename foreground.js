//==========================================
// Title:  SafeLink Foreground
// Author: Obed Ababio
// Date:   21 March 2021
//==========================================


// loop through href attributes and put them in array
// that will be sent to backend.
var pageLinksArray = []; 
var pageLinks = document.links;
for (var i=0; i<pageLinks.length; i++) {
	pageLinksArray.push(pageLinks[i].href);
}

chrome.runtime.sendMessage({message: pageLinksArray});
//console.log(pageLinksArray);



// How to setup a basic flask server
// App.py, import flask, falsk objects and define endpoints
