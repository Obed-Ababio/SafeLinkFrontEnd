function loadWhitelist() {
    chrome.storage.sync.get(null, function(items) {
        let domains = Object.keys(items);

        for(let domain of domains) {
            let domainInfo = items[domain];
            let type = "details" in domainInfo ? domainInfo.details.type: 'main_frame'

            if(domainInfo.whitelisted === true) {
                addEntry("whitelisted-domains", type, domain);
            }

            if(domainInfo.blocked === true) {
                addEntry("blocked-domains", type, domain);
            }
        }
    })
}

function addEntry(tableId, type, domain) {
    let table = document.getElementById(tableId);
    
    table.innerHTML += `
        <tr>
            <td>${type}</td>
            <td>${domain}</td>
        </tr>
    `;
}

document.addEventListener('DOMContentLoaded', loadWhitelist);