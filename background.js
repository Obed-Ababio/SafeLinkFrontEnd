/* web request constants */
const filter = { urls: ["*://*/*"] }; // only care about user-entered urls and http/https scheme
const optExtraInfoSpec = ["blocking"]; // makes the web request synchronous

/* the endpoint that will accept the domain to run the security checks */
const SECURITY_ALGORITHMS_API = "http://127.0.0.1:5000/processLink";

/* limit above which entries in cache will be deleted */
let dayLimit = 14;

/* cache for whitelisted domains */
let whitelist = {};

/* this dictionary will hold a dictionary of links their results post-security check */
let linkCache = {};

deleteExpired(dayLimit);

/* grab cache and whitelist from chrome storage */
chrome.storage.sync.get(["linkCache"], function (result) {
  linkCache = result.linkCache;
  whitelist = result.whitelist;
});

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

/* the main callback that will be called anytime user makes a web request */
function webCallback(details) {
  let domain_name = extractRootDomain(details.url);
  let url = details.url;
  let response = {};

  /* if domain has been whitelisted allow access */
  // console.log(typeof whitelist);
  // if (domain_name in whitelist) {
  //   return;
  // }

  // If domain name is not in cache, run algorithm on url and add
  // domain name to cache
  if (!(domain_name in linkCache)) {
    response = runSecurityAlgorithms(url);
    console.log(domain_name + " : " + response["STATUS"]);
    response["DATE"] = new Date();
    linkCache[domain_name] = response;
    chrome.storage.sync.set({ linkCache: linkCache }, function () {});
  } else {
    response = linkCache[domain_name];
  }

  if (response["STATUS"] == "PASSED") {
    return;
  } else {
    // check if it is in whitelist; if yes, return

    //the requested page failed the suite of tests; redirect use to warning page
    localStorage.removeItem("results");
    localStorage.setItem("results", JSON.stringify(response));
    return {
      redirectUrl: chrome.runtime.getURL(
        "static/html/warning.html?domain=" + url
      ),
    };
  }
}

// This strips away file path and retains subdomain and domain
function extractHostname(url) {
  var hostname;
  //find & remove protocol (http, ftp, etc.) and get hostname

  if (url.indexOf("//") > -1) {
    hostname = url.split("/")[2];
  } else {
    hostname = url.split("/")[0];
  }

  //find & remove port number
  hostname = hostname.split(":")[0];
  //find & remove "?"
  hostname = hostname.split("?")[0];

  return hostname;
}

function extractRootDomain(url) {
  var domain = extractHostname(url),
    splitArr = domain.split("."),
    arrLen = splitArr.length;

  //extracting the root domain here
  //if there is a subdomain
  if (arrLen > 2) {
    domain = splitArr[arrLen - 2] + "." + splitArr[arrLen - 1];
    //check to see if it's using a Country Code Top Level Domain (ccTLD) (i.e. ".me.uk")
    if (splitArr[arrLen - 2].length == 2 && splitArr[arrLen - 1].length == 2) {
      //this is using a ccTLD
      domain = splitArr[arrLen - 3] + "." + domain;
    }
  }
  return domain;
}

/* goes through cache and  removes all key-value pairs that are older than days*/
function deleteExpired(days) {
  let urlCache = {};
  chrome.storage.sync.get(["linkCache"], function (result) {
    urlCache = result.linkCache;

    for (var url of Object.keys(urlCache)) {
      let response = urlCache[url];
      let now = new Date();
      let responseDate = response["DATE"];
      timeDifference = responseDate.getTime() - now.getTime();
      dayDifference = timeDifference / (1000 * 3600 * 24);

      if (dayDifference > days) {
        delete urlCache[url];
      }
    }
  });
  chrome.storage.sync.set({ linkCache: urlCache }, function () {});
}

/* takes all links on a loaded page and passes them to security algorithm */
function checkWebPageLinks(details) {
  var pageLinks = document.links;
  for (var i = 0; i < pageLinks.length; i++) {
    const response = runSecurityAlgorithms(pageLinks[i].href);
    linkCache[pageLinks.href[i]] = response;
  }
}

//webNavigation.onCompleted.addListener(checkWebPageLinks);
chrome.webRequest.onBeforeRequest.addListener(
  webCallback,
  filter,
  optExtraInfoSpec
);
