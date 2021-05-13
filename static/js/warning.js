const scheme = "http://";

// Get the domain from the URL parameters.
const domain = new URLSearchParams(location.search).get("domain");

replaceUrl();
document.getElementById("p-whitelist").onclick = whitelist;

/* whitelist the domain that is currently blocked when the user clicks button */
function whitelist() {
  chrome.storage.sync.set(
    { [domain]: { whitelisted: true, onPage: domain } },
    function () {
      console.log("Whitelisted domain: " + domain);
    }
  );
}

function replaceUrl() {
  results = localStorage["results"];
  console.log(results);
  if (domain) {
    document.getElementById("warning-message").innerHTML = document
      .getElementById("warning-message")
      .innerHTML.replace("{url}", domain);

    for (var element of document.getElementsByClassName("button-a")) {
      element.href = scheme + domain;
    }
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
