let results = localStorage["results"];
results = JSON.parse(results);
console.log(results);

generateTable();
document.querySelectorAll(".accordion__button").forEach((button) => {
  button.addEventListener("click", () => {
    button.classList.toggle("accordion__button--active");
  });
});

function generateTable() {
  var col = ["Status", "Test", "Target", "Registration", "Expiration"];
  var table = document.createElement("table");
  var tr = table.insertRow(-1);

  // Insert Headers
  for (var i = 0; i < col.length; i++) {
    var th = document.createElement("th");
    th.innerHTML = col[i];
    tr.appendChild(th);
  }

  generateTestRow("typoSquatting");
  generateTestRow("comboSquatting");
  generateTestRow("soundSquatting");
  generateTestRow("homographSquatting");

  var mainContainer = document.getElementById("testResults");
  var div = document.createElement("div");
  div.innerHTML = " ";
  mainContainer.appendChild(table);
}

function generateTestRow(testName) {
  /* populate test status field as either PASSED or FAILED */
  tr = table.insertRow(-1);

  let testResults = "";
  if (results[testName].length === 0) {
    testResults = "PASSED";
  } else {
    testResults = "FAILED";
  }
  var statusCell = tr.insertCell(-1);
  statusCell.innerHTML = testResults;

  /* add name of test */
  var testNameCell = tr.insertCell(-1);
  testNameCell.innerHTML = testName;

  /*add links that domain is targeting */
  var targetCell = tr.insertCell(-1);
  targetList = results[testName];
  if (targetList.length === 0) {
    targetCell.innerHTML = "N/A";
  } else {
    targetCell.innerHTML = targetList;
  }
}
