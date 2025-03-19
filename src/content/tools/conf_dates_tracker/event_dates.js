let event_dates = []

const pageSize = 20; // Number of papers per page
let currentPage = 1; // Current page number

fetch(
    "https://raw.githubusercontent.com/AI4Code-HUST/conference-date-tracker/refs/heads/main/results/conference_events.jsonl"
)
    .then((response) => {
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response.text();
    })
    .then((text) => {
        event_dates = text
            .trim()
            .split("\n")
            .map((line) => JSON.parse(line));
        
        console.log(event_dates);
        updateTable(event_dates);

        document.getElementById("page-number-input").addEventListener("change", () => {
            const pageNumber = parseInt(document.getElementById("page-number-input").value, 10);
            if (!isNaN(pageNumber)) {
                goToPage(pageNumber);
            } else {
                alert("Please enter a valid page number.");
            }
        });        
    });

function renderTable(conferenceEvents) {
    const table = document.createElement("table");
    table.classList.add("table", "table-striped", "table-bordered", "table-hover");

    // Create table headers
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    const headers = ["Conference", "Track", "Date", "Event", "Links"];
    headers.forEach((header) => {
        const th = document.createElement("th");
        th.textContent = header;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create table body
    const tbody = document.createElement("tbody");
    const paginatedEvents = paginate(conferenceEvents, pageSize, currentPage);
    
    paginatedEvents.forEach((event) => {
        const row = document.createElement("tr");

        // Conference Name (with link)
        const confCell = document.createElement("td");
        confCell.innerHTML = `<a href="${event.conference_link}" target="_blank">${event.conference}</a>`;
        row.appendChild(confCell);

        // Track
        const trackCell = document.createElement("td");
        trackCell.textContent = event.track;
        row.appendChild(trackCell);

        // Date
        const dateCell = document.createElement("td");
        dateCell.textContent = event.date;
        row.appendChild(dateCell);

        // Event Content
        const contentCell = document.createElement("td");
        contentCell.textContent = event.content;
        row.appendChild(contentCell);

        // Links (Event + Google Calendar)
        const linksCell = document.createElement("td");
        linksCell.innerHTML = `
            <a href="${event.link}" target="_blank">Event Page</a> | 
            <a href="${event.gg_calendar_href}" target="_blank">Add to Google Calendar</a>
        `;
        row.appendChild(linksCell);

        // ✅ Highlight Row on Hover
        row.addEventListener("mouseenter", () => {
            row.style.backgroundColor = "#f5f5f5"; // Light gray
        });

        row.addEventListener("mouseleave", () => {
            row.style.backgroundColor = ""; // Reset
        });

        // ✅ Highlight Row on Click (Toggle Effect)
        row.addEventListener("click", () => {
            if (row.classList.contains("highlighted")) {
                row.classList.remove("highlighted");
                row.style.backgroundColor = ""; // Reset
            } else {
                document.querySelectorAll(".highlighted").forEach((r) => {
                    r.classList.remove("highlighted");
                    r.style.backgroundColor = ""; // Reset previous highlights
                });
                row.classList.add("highlighted");
                row.style.backgroundColor = "#d1ecf1"; // Light blue highlight
            }
        });

        tbody.appendChild(row);
    });

    // Handle Empty State
    if (conferenceEvents.length === 0) {
        const placeholder = `
            <p class="placeholder-glow">
                <span class="placeholder col-12"></span>
            </p>
        `;
        for (let i = 0; i < 5; i++) {
            const row = document.createElement("tr");
            for (let j = 0; j < 5; j++) {
                const cell = document.createElement("td");
                cell.innerHTML = placeholder;
                row.appendChild(cell);
            }
            tbody.appendChild(row);
        }
    }

    table.appendChild(tbody);

    // Append the table to the DOM
    const tableContainer = document.getElementById("conferenceEventDateTable");
    tableContainer.innerHTML = ""; // Clear previous content
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
        listItem.className = `page-item${active ? ' active' : ''}${disabled ? ' disabled' : ''}`;

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
    paginationContainer.appendChild(createPageItem('&laquo;', 1, currentPage === 1));

    // Previous Page Button
    paginationContainer.appendChild(createPageItem('&#8249;', currentPage - 1, currentPage === 1));

    // Page Number Buttons
    const start = Math.max(currentPage - 1, 1);
    const end = Math.min(currentPage + 1, totalPages);
    for (let i = start; i <= end; i++) {
        paginationContainer.appendChild(createPageItem(i, i, false, i === currentPage));
    }

    // Next Page Button
    paginationContainer.appendChild(createPageItem('&#8250;', currentPage + 1, currentPage === totalPages));

    // Last Page Button
    paginationContainer.appendChild(createPageItem('&raquo;', totalPages, currentPage === totalPages));
}

function goToPage(pageNumber) {
    const totalPages = Math.ceil(event_dates.length / pageSize);
    if (pageNumber >= 1 && pageNumber <= totalPages) {
        currentPage = pageNumber;
        updateTable(event_dates);
    } else {
        alert(`Please enter a valid page number between 1 and ${totalPages}.`);
    }
}

function updateTable(event_dates) {
    renderTable(event_dates);
    renderPaginationControls(event_dates);
}

renderTable(event_dates);