//==========================================
// Title:  SafeLink Foreground
// Author: Obed Ababio
// Date:   21 March 2021
//==========================================

/**
This script is executed as soon as the chrome extension is installed or is refreshed by the user.
For example : we can add an event listener by writing the code in the background.js file
and listen for when the user visits a particular page and then inject some script we have written elsewhere 
into that particular page
**/

// Make the API calls here


// Once we navigate to a tab that tab becomes active and we inject the foreground script into it.
chrome.tabs.onActivated.addListener(tab => {
	chrome.tabs.get(tab.tabId, current_tab_info => {
		if (true) {
			chrome.tabs.executeScript(null, {file: './foreground.js'}, () => console.log('i injetced'));
		}
	});
});


//
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if ( typeof request.message === 'object') {
		// pass this to the backend
		fetch('http://localhost:5000/processLink', {
			method: 'POST',
			body: JSON.stringify(request.message),
			headers: {
				'Content-type': 'application/json; charset=UTF-8'
			}
		}).then(function (response) {
			if (response.ok) {
				return response.json();
			}
			return Promise.reject(response);
		}).then(function (data) {
			console.log(data);
		}).catch(function (error) {
			console.warn('Something went wrong.', error);
		});
	}
})




