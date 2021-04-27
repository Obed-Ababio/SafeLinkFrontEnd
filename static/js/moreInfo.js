let results = localStorage["results"];
results = JSON.parse(results);

console.log(results);
for (const [key, value] of Object.entries(results)) {
  console.log(key, value);
}

var col = ["Domain", "Status", "Test", "Target(s)", "Details"];
var table = document.createElement("table");
var tr = table.insertRow(-1);

// Insert Headers
for (var i = 0; i < col.length; i++) {
  var th = document.createElement("th");
  th.innerHTML = col[i];
  tr.appendChild(th);
}

tr = table.insertRow(-1);

var domainCell = tr.insertCell(-1);
var statusCell = tr.insertCell(-1);
var testCell = tr.insertCell(-1);
var targetCell = tr.insertCell(-1);

domainCell.innerHTML = domain;
statusCell.innerHTML = results["STATUS"];
testCell.innerHTML = "comboSquatting";
targetCell.innerHTML = results["comboSquatting"][0];

var mainContainer = document.getElementById("testResults");

var div = document.createElement("div");
div.innerHTML = " ";
mainContainer.appendChild(table);

document.querySelectorAll(".accordion__button").forEach((button) => {
  button.addEventListener("click", () => {
    button.classList.toggle("accordion__button--active");
  });
});
