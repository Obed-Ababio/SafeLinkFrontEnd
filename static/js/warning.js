const scheme = "http://";

// Get the domain from the URL parameters.
const domain = new URLSearchParams(location.search).get("domain");

replaceUrl();

document.getElementById("p-whitelist").onclick = whitelist;

/* whitelist the domain that is currently blocked when the user clicks button */
function whitelist() {
  localStorage.set(domain, "true");
  console.log("whitelisted: " + domain);
}
/* replace the url placeholder in warning messsage with actual domain being blocked */
/* also replaces href for button with actual domain being blocked */
function replaceUrl() {
  results = localStorage["results"];
  //console.log(results)
  if (domain) {
    document.getElementById(
      "warning-message"
    ).innerHTML = document
      .getElementById("warning-message")
      .innerHTML.replace("{url}", domain);

    for (var element of document.getElementsByClassName("button-a")) {
      element.href = scheme + domain;
    }
  }
}
