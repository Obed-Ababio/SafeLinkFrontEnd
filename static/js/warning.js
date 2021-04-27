const scheme = "http://";

// Get the domain from the URL parameters.
const domain = new URLSearchParams(location.search).get("domain");

replaceUrl();

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
