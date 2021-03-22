document.addEventListener('DOMContentLoaded', function () {
	document.querySelector('button').addEventListener('click',
		onClick, false)

	function onClick () {
		chrome.tabs.query({currentWindow: true, active: true},
			function (tabs) {
				chrome.tabs.sendMessage(tabs[0].id, 'hi', setCount)
			})
	}

	function setCount (res) {
		const div = document.createElement('div')
		div.textContent = `${res.count} hrefs`
		document.body.appendChild(div)
	}
}, false)

// SHow an alert 