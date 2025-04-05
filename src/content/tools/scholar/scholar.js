const yearInput = UseBootstrapTag(document.getElementById("years"));
const keywordInput = UseBootstrapTag(document.getElementById("keywords"));

let papers = [];
let filteredPapers = [];

const pageSize = 20; // Number of papers per page
let currentPage = 1; // Current page number

fetch(
    "https://raw.githubusercontent.com/AI4Code-HUST/scholar_alters/master/data/papers.jsonl"
)
    .then((response) => {
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response.text();
    })
    .then((text) => {
        papers = text
            .trim()
            .split("\n")
            .map((line) => JSON.parse(line));
        filteredPapers = papers;
        console.log(filteredPapers);
        updateTable(filteredPapers);

        const pageNumberInput = document.getElementById("page-number-input");

        pageNumberInput.addEventListener("change", () => {
            const pageNumber = parseInt(pageNumberInput.value, 10);
            if (!isNaN(pageNumber)) {
                goToPage(pageNumber);
            } else {
                alert("Please enter a valid page number.");
            }
        });

        const saveFilterButton = document.getElementById("paperFilterButton");

        saveFilterButton.addEventListener("click", saveFilter);
    });

function filterPapers(papers, selectedYears, keywords) {
    return papers
        .map((paper, index) => {
            // Check if 'paper' is null or undefined
            if (!paper) {
                console.warn(`Paper at index ${index} is ${paper}`);
                return null;
            }

            // Extract the year from the 'data' field using a regular expression
            const yearMatch = paper.data.match(/\b\d{4}\b/);
            const paperYear = yearMatch ? yearMatch[0] : null;

            // Check if the paper's year matches any of the selected years
            const yearMatchCondition =
                selectedYears.length === 0 ||
                (paperYear && selectedYears.includes(paperYear));

            // Find matched keywords in the paper's title
            const matchedKeywords = keywords.filter((keyword) =>
                paper.title.toLowerCase().includes(keyword.toLowerCase())
            );

            // Check if the paper's title contains any of the keywords
            const keywordMatchCondition =
                keywords.length === 0 || matchedKeywords.length > 0;

            // Include the paper in the filtered results only if both checks pass
            return yearMatchCondition && keywordMatchCondition
                ? { ...paper, keywords: matchedKeywords.join(", ") }
                : null;
        })
        .filter((paper) => paper !== null); // Remove null values from the array
}

function renderTable(papers) {
    const table = document.createElement("table");
    table.classList.add("table", "table-striped", "table-bordered", "table-hover");

    // Create table headers
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    const headers = ["Topic", "Branch", "Paper"];
    headers.forEach((header) => {
        const th = document.createElement("th");
        th.textContent = header;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create table body
    const tbody = document.createElement("tbody");
    const paginatedPapers = paginate(papers, pageSize, currentPage);
    paginatedPapers.forEach((paper) => {
        const row = document.createElement("tr");

        const topicCell = document.createElement("td");
        topicCell.textContent = paper.first_label ? paper.first_label.join(", ") : "";
        row.appendChild(topicCell);

        const branchCell = document.createElement("td");
        branchCell.textContent = paper.second_label ? paper.second_label.join(", ") : "";
        row.appendChild(branchCell);

        const paperCell = document.createElement("td");
        paperCell.innerHTML = `<a href="${paper.link}" target="_blank">${paper.title}</a>`;
        row.appendChild(paperCell);

        tbody.appendChild(row);
    });

    if (papers.length === 0) {
        const placeholder = `
            <p class="placeholder-glow">
                <span class="placeholder col-12"></span>
            </p>
        `;

        for (let i = 0; i < 5; i++) {
            const row = document.createElement("tr");

            const topicCell = document.createElement("td");
            topicCell.innerHTML = placeholder;
            row.appendChild(topicCell);

            const branchCell = document.createElement("td");
            branchCell.innerHTML = placeholder;
            row.appendChild(branchCell);

            const paperCell = document.createElement("td");
            paperCell.innerHTML = placeholder;
            row.appendChild(paperCell);

            tbody.appendChild(row);
        }
    }

    table.appendChild(tbody);

    // Append the table to the DOM
    const tableContainer = document.getElementById("papersTable");
    tableContainer.innerHTML = ""; // Clear any existing content
    tableContainer.appendChild(table);
}

function paginate(papers, pageSize, pageNumber) {
    const startIndex = (pageNumber - 1) * pageSize;
    return papers.slice(startIndex, startIndex + pageSize);
}

function renderPaginationControls(papers) {
    const paginationContainer = document.getElementById("pagination-controls");
    paginationContainer.innerHTML = ""; // Clear existing controls

    const totalPages = Math.ceil(papers.length / pageSize);

    const numberPages = document.getElementById("total-pages");
    numberPages.innerHTML = "of " + totalPages;

    // Helper function to create page items
    function createPageItem(label, page, disabled = false, active = false) {
        const listItem = document.createElement("li");
        listItem.className = `page-item${active ? " active" : ""}${disabled ? " disabled" : ""}`;

        const link = document.createElement("a");
        link.className = "page-link";
        link.href = "#";
        link.innerHTML = label;
        link.addEventListener("click", (event) => {
            event.preventDefault();
            if (!disabled && page !== currentPage) {
                currentPage = page;
                updateTable(papers);
            }
        });

        listItem.appendChild(link);
        return listItem;
    }

    // First Page Button
    paginationContainer.appendChild(createPageItem("&laquo;", 1, currentPage === 1));

    // Previous Page Button
    paginationContainer.appendChild(createPageItem("&#8249;", currentPage - 1, currentPage === 1));

    // Page Number Buttons
    const start = Math.max(currentPage - 1, 1);
    const end = Math.min(currentPage + 1, totalPages);
    for (let i = start; i <= end; i++) {
        paginationContainer.appendChild(createPageItem(i, i, false, i === currentPage));
    }

    // Next Page Button
    paginationContainer.appendChild(createPageItem("&#8250;", currentPage + 1, currentPage === totalPages));

    // Last Page Button
    paginationContainer.appendChild(createPageItem("&raquo;", totalPages, currentPage === totalPages));
}

function goToPage(pageNumber) {
    const totalPages = Math.ceil(papers.length / pageSize);
    if (pageNumber >= 1 && pageNumber <= totalPages) {
        currentPage = pageNumber;
        updateTable(filteredPapers);
    } else {
        alert(`Please enter a valid page number between 1 and ${totalPages}.`);
    }
}

function updateTable(papers) {
    renderTable(papers);
    renderPaginationControls(papers);
}

function saveFilter() {
    updateTable([]);
    const years = yearInput.getValues();
    const words = keywordInput.getValues();
    filteredPapers = filterPapers(papers, years, words);
    console.log(filteredPapers);
    updateTable(filteredPapers);
}

renderTable(papers);