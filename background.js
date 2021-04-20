/* web request constants */
const filter = { urls: ["*://*/*"] }; // only care about user-entered urls and http/https scheme
const optExtraInfoSpec = ["blocking"]; // makes the web request synchronous

/* the endpoint that will accept the domain to run the security checks */
const SECURITY_ALGORITHMS_API = "http://127.0.0.1:5000/";

/* this dictionary will hold a dictionary of links their results post-security check */
let linkCache = {};

/* cache for whitelisted domains */
let whitelist = {};

/* check if a domain has been dropcaught by performing an AJAX request to our REST API */
function runSecurityAlgorithms(domain) {
  return JSON.parse(
    $.ajax({
      type: "POST",
      url: SECURITY_ALGORITHMS_API,
      dataType: "json",
      contentType: "application/json",
      data: JSON.stringify({ domain_name: domain }),
      async: false,
    }).responseText
  );
}

/* clears linkCache */
function clearLinkCache() {
  linkCache = {};
}

/* the main callback that will be called anytime user makes a web request */
function webCallback(details) {
  const response = runSecurityAlgorithms(details.url);
  console.log(details.url);
  console.log(response["STATUS"]);

  //runCacheCheck(detials.url);
  //console.log(localStorage);
  // if (localStorage.getItem(details.url) !== null) {
  //   return;
  // }

  if (response["STATUS"] == "PASSED") {
    /* clear cache and allow user to access the page */
    //clearLinkCache();
    return;
  } else {
    /* the requested page failed the suite of tests */
    if (details.type == "main_frame") {
      localStorage.setItem("results", JSON.stringify(response));

      return {
        redirectUrl: chrome.runtime.getURL(
          "static/html/warning.html?domain=" + details.url
        ),
      };
    } else {
      //Ideally display popup
      //handlePopup("http://google.com");
      return { cancel: true };
    }
  }
}

/* takes all links on a loaded page and passes them to security algorithm */
function checkWebPageLinks(details) {
  var pageLinks = document.links;
  for (var i = 0; i < pageLinks.length; i++) {
    const response = runSecurityAlgorithms(pageLinks[i].href);
    linkCache[pageLinks.href[i]] = response;
  }
}

/* takes a link and runs it  */
function runCacheCheck(link) {
  if (link in linkCache) {
    const response = linkCache[link];
    if (response["STATUS"] === "FAILED") {
      /* create pop up ideally */
      return { cancel: true };
    }
  }
}

function handlePopup(url) {
  if (
    confirm("Obed: It appears you are attempting to visit a malicious website")
  ) {
    window.location = url;
  } else {
  }
}

//webNavigation.onCompleted.addListener(checkWebPageLinks);
chrome.webRequest.onBeforeRequest.addListener(
  webCallback,
  filter,
  optExtraInfoSpec
);
