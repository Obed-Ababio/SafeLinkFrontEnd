displayResults();
function displayResults() {
  for (var mainContainer of document.getElementById("testResults")) {
    results = localStorage["results"];

    for (let test in results) {
      var div = document.createElement("div");
      div.innerHTML = "Test: " + test + "     Results: " + results[test];
      mainContainer.appendChild(div);
    }
  }
}
