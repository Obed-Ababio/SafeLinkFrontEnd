/* The extension ID of the chrome extension, which will be used to uniquely identify each modal element. */
const EXTENSION_ID = "dkpmepaadobjbdgilhkiofbdgipicien";

/* The modal to be injected. */
const MODAL_HTML = `
    <div id="warning-modal-:id:" class="modal-:id:">
        <div class="modal-content-:id:">
            <div class="modal-header-:id:">
                <h3>Warning</h3>
            </div>

            <div class="modal-body-:id:">
                <div id="warning-title-:id:">
                    <p>
                        The following scripts, stylesheets or other content has been blocked for your safety.<br>
                        These domains have changed ownership and may not be considered trusted anymore.
                    </p>   
                    <p class="subtitle-:id:">The <strong>Continue Blocking</strong> option will continue to block the specified content without notification.</p>
                    <p class="subtitle-:id:">The <strong>Whitelist</strong> option will whitelist the domain and unblock the content.</p>
                </div>

                <div id="warning-content-:id:">
                    <table class="table-:id:">
                        <tr>
                            <th>Domain</th>
                            <th>Whitelist</th>
                            <th>Continue Blocking</th>
                        </tr>
                    </table>
                </div>
            </div>

            <div class="modal-footer-:id:">
                <div class="btn-container-:id:">
                    <a href="#" id="proceed-btn-:id:" class="btn">Proceed</a>
                </div>
            </div>
        </div>
    </div>
`;

/* an object containing all blocked domains on the page */
let blockedDomains = {};

/* listens to messages sent by background in order to capture blocked domains */
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    window.onload = function() {
        // check if the messsage was not sent by another tab
        // check if the message is correct, "blockedDomains"
        // check if the object containing the blocked domains is not empty
        if(!sender.tab && "blockedDomains" in request) {

            /* set blocked domains globally */
            blockedDomains = request.blockedDomains;
            
            /* if modal already exists, do not re-inject */
            if(!modalExists()) {
                /* inject the modal */
                injectModal(MODAL_HTML);

                /* update the modal table with blocked domains */
                updateModalTable();
                
                /* set handler for proceed button */
                document.getElementById(`proceed-btn-${EXTENSION_ID}`).onclick = proceedBtnHandler;
            }
        }
    }
});

/**
 * Returns all checkboxes that are checked currently in the DOM with a specified class.
 * 
 * @param {string} className 
 */
function getCheckedCheckboxes(className) {
    let checked = [];
    let inputs = document.getElementsByTagName("input");

    for(let i = 0; i < inputs.length; i++) {
        if(inputs[i].type == "checkbox" && inputs[i].checked == true && inputs[i].className == className) {
            checked.push(inputs[i]);
        }
    }

    return checked;
}

/**
 * A handler for when the user clicks the 'Proceed' button.
 * 
 * Will whitelist all domains in the 'Whitelist' category and continue blocking all domains
 *     in the 'Continue Blocking' category.
 */
function proceedBtnHandler() {
    let whitelisted = getCheckedCheckboxes(`whitelist-chkbox-${EXTENSION_ID}`);
    whitelisted.forEach( (checkbox, index, array) => whitelist(checkbox.value));

    let continueToBlock = getCheckedCheckboxes(`continue-blocking-chkbox-${EXTENSION_ID}`);
    continueToBlock.forEach( (checkbox, index, array) => continueBlocking(checkbox.value));

    // Delete modal once user is satisfied with their options and clicks the 'Proceed' button.
    deleteModal();
}

/**
 * Next time the user visits a page with blocked content, the extension will block the domain(s)
 *     without notifying the user.
 * 
 * @param {string} domain 
 */
function continueBlocking(domain) {
    chrome.storage.sync.set({[domain]: {
        "whitelisted": false, 
        "blocked": true, 
        "onPage": window.location.href,
        "details": blockedDomains[domain]
    }}, function() {
        if(chrome.runtime.lastError) {
            console.log(chrome.runtime.lastError);
        } else {
            console.log(`The domain, ${domain} will now be blocked without notification in the future.`);
        }
    });
}

/**
 * Whitelists a specified domain from being blocked in the future.
 * 
 * @param {string} domain 
 */
function whitelist(domain) {
    chrome.storage.sync.set({[domain]: {
        "whitelisted": true, 
        "blocked": false, 
        "onPage": window.location.href,
        "details": blockedDomains[domain]
    }}, function() {
        if(chrome.runtime.lastError) {
            console.log(chrome.runtime.lastError);
        } else {
            console.log(`The domain, ${domain} is now whitelisted.`);
        }
    });
}

/**
 * Populates modal table with blocked domains and options to whitelist or continue blocking.
 * 
 * @param {object} blockedDomains 
 */
function updateModalTable() {
    let table = document.getElementsByClassName(`table-${EXTENSION_ID}`)[0];

    for(let domain of Object.keys(blockedDomains)) {
        let domainInfo = blockedDomains[domain];
        table.innerHTML += `
            <tr>
                <td>
                    <details class="domain-details-${EXTENSION_ID}">
                        <summary>${domain}</summary>
                        <p>
                            Type: ${domainInfo.type}<br>
                            Last Registered: ${domainInfo.lastRegistered}<br>
                            Last Deregistered: ${domainInfo.lastDeregistered}
                        </p>
                    </details>
                </td>
                <td><input class="whitelist-chkbox-${EXTENSION_ID}" type="checkbox" value=${domain}></td>
                <td><input class="continue-blocking-chkbox-${EXTENSION_ID}" type="checkbox" value=${domain}></td>
            </tr>
        `;
    }
}

/**
 * Injects the modal provided as an HTML string into the document's body.
 * 
 * @param {string} modalHtml 
 */
function injectModal(modalHtml) {
    let modal = document.createElement('div');
    modal.innerHTML = modalHtml.trim().replace(/:id:/g, EXTENSION_ID);

    document.body.insertBefore(modal, document.body.firstChild);
}

/**
 * Deletes the injected modal from the DOM.
 */
function deleteModal() {
    document.getElementById(`warning-modal-${EXTENSION_ID}`).remove();
}

/**
 * Returns true if the injected modal exists, false otherwise.
 */
function modalExists() {
    return document.getElementById(`warning-modal-${EXTENSION_ID}`) !== null;
}

/**
 * Returns true if the specified object is empty, else false.
 * 
 * @param {object} object 
 */
function isEmpty(object) {
    return Object.entries(object).length === 0 && object.constructor === Object;
}