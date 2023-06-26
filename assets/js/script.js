const API_KEY = "DqBCkyVjGHjCLUwT0bU-vqf3-Sc";
const API_URL = "https://ci-jshint.herokuapp.com/api";
const resultsModal = new bootstrap.Modal(document.getElementById("resultsModal"));

document.getElementById("status").addEventListener("click", e=>getStatus(e));
document.getElementById("submit").addEventListener("click", e=>postForm(e));

function displayException(data) {
    exception_info = `<p>Error Number: ${error.error_no}</p>`;
    exception_info += `<p>Status Code: ${status_code}</p>`;
    exception_info += `<p>Error: ${error.error}</p>`;

    document.getElementById("resultsModalTitle").innerText = "An Exception Occurred";
    document.getElementById("results-content").innerHTML = exception_info;
    resultsModal.show();
}

function processOptions(form) {
     
    let optionArray = [];
    for (let entry of form.entries()) {
        if (entry[0] === "options") {
            optionArray.push(entry[1]);
        }
    }
    form.delete("options");
    form.append("options", optionArray.join());
    return form;

}

async function postForm(e) {
    const form = processOptions(new FormData(document.getElementById("checksform")));

    for (let entry of form.entries()) {
        console.log(entry);
    }

    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Authorization": API_KEY,
        },
        body: form,
    })

    const data = await response.json();

    if (response.ok) {
        displayErrors(data);
    } else {
        displayException(data);
        throw new Error(data.error);
    }
}

function displayErrors(data) {
    let heading = `JSHint results for ${data.file}`;

    if (data.total-errors === 0) {
        results = `<div class="no-errors">No errors.</div>`;
    } else {
        results = `<div>Total errors: <span class="error-count">${data.total_errors}</span></div>`;
        for (let error of data.error_list) {
            results += `<div>At line <span class="line">${error.line}</span>,`;
            results += `column <span class="column">${error.column}</span></div>`;
            results += `<div class="error">${error.error}</div>`;
        }
    }

    document.getElementById("resultsModalTitle").innerText = heading;
    document.getElementById("results-content").innerHTML = results;

    resultsModal.show();
}

async function getStatus(e) {
    const queryString = `${API_URL}?api_key=${API_KEY}`;

    const response = await fetch(queryString);

    const data = await response.json();

    if (response.ok) {
        displayStatus(data);
    } else {
        throw new Error(data.error);
    }
}

function displayStatus(data) {
    document.getElementById("resultsModalTitle").innerText = "API Key Status";
    document.getElementById("results-content").innerHTML = `<p>Your key is valid until ${data.expiry}.</p>`;
    resultsModal.show();
}