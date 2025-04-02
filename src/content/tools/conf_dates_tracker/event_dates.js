let events = []
let filteredEvents = []

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
        events = text
            .trim()
            .split("\n")
            .map((line) => JSON.parse(line));

        filteredEvents = events;
        console.log(filteredEvents);
        updateTable(filteredEvents);
        
        const pageNumberInput = document.getElementById("page-number-input");

        pageNumberInput.addEventListener("change", () => {
            const pageNumber = parseInt(pageNumberInput.value, 10);
            if (!isNaN(pageNumber)) {
                goToPage(pageNumber);
            } else {
                alert("Please enter a valid page number.");
            }
        });

        const saveFilterButton = document.getElementById("eventFilterButton");

        saveFilterButton.addEventListener("click", saveFilter);
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
    const totalPages = Math.ceil(events.length / pageSize);
    if (pageNumber >= 1 && pageNumber <= totalPages) {
        currentPage = pageNumber;
        updateTable(events);
    } else {
        alert(`Please enter a valid page number between 1 and ${totalPages}.`);
    }
}

function updateTable(event_dates) {
    renderTable(event_dates);
    renderPaginationControls(event_dates);
}

function filterEvents(events, selectedConferences, selectedTracks, selectedContentTypes) {
    return events.filter(event => {
        // Check if event's conference contains any of the selectedConferences as a substring
        const matchesConference = selectedConferences.some(conf => event.conference.includes(conf));

        // Check if event's track is in selectedTracks[conference] (if any tracks are selected for this conference)
        const matchesTrack = selectedTracks[event.conference]?.length 
            ? selectedTracks[event.conference].includes(event.track)
            : true; // If no tracks are selected for a conference, keep all tracks

        return matchesConference && matchesTrack
    });
}

// Function to fetch the filter data from the provided URL
async function fetchFilterConfig() {
    const url = "https://raw.githubusercontent.com/AI4Code-HUST/conference-date-tracker/refs/heads/main/filter_config.json";
    const response = await fetch(url);
    const filterConfig = await response.json();
    return filterConfig;
}

// Function to generate the conference checkboxes
function generateConferenceCheckboxes(conferenceData) {
    const container = document.getElementById("conferenceFilter");
    container.innerHTML = ""; // Clear existing content
    
    Object.entries(conferenceData).forEach(([conference, tracks]) => {
        // Create the conference checkbox
        const conferenceDiv = document.createElement("div");
        conferenceDiv.classList.add("form-check");
        
        const conferenceCheckbox = document.createElement("input");
        conferenceCheckbox.type = "checkbox";
        conferenceCheckbox.classList.add("form-check-input", "conference-checkbox");
        conferenceCheckbox.id = conference;
        conferenceCheckbox.checked = true; // Default to true
        
        const conferenceLabel = document.createElement("label");
        conferenceLabel.classList.add("form-check-label", "fw-bold");
        conferenceLabel.htmlFor = conference;
        conferenceLabel.textContent = conference;
        
        const toggleButton = document.createElement("button");
        toggleButton.classList.add("btn", "btn-link", "btn-sm");
        toggleButton.textContent = "Toggle";
        toggleButton.type = "button";
        
        conferenceDiv.appendChild(conferenceCheckbox);
        conferenceDiv.appendChild(conferenceLabel);
        conferenceDiv.appendChild(toggleButton);
        
        // Create a container for track checkboxes
        const trackContainer = document.createElement("div");
        trackContainer.classList.add("ps-3");
        trackContainer.style.display = "none"; // Initially hidden
        
        Object.entries(tracks).forEach(([track, _]) => {
            const trackDiv = document.createElement("div");
            trackDiv.classList.add("form-check");
            
            const trackCheckbox = document.createElement("input");
            trackCheckbox.type = "checkbox";
            trackCheckbox.classList.add("form-check-input", "track-checkbox");
            trackCheckbox.id = `${conference}-${track.replace(/\s+/g, "-")}`;
            trackCheckbox.checked = true; // Default to true
            
            const trackLabel = document.createElement("label");
            trackLabel.classList.add("form-check-label");
            trackLabel.htmlFor = trackCheckbox.id;
            trackLabel.textContent = track;
            
            trackDiv.appendChild(trackCheckbox);
            trackDiv.appendChild(trackLabel);
            trackContainer.appendChild(trackDiv);
        });
        
        conferenceDiv.appendChild(trackContainer);
        container.appendChild(conferenceDiv);
        
        // Event listeners to handle parent-child behavior
        conferenceCheckbox.addEventListener("change", function() {
            trackContainer.querySelectorAll(".track-checkbox").forEach(trackCb => {
                trackCb.checked = conferenceCheckbox.checked;
            });
        });
        
        trackContainer.querySelectorAll(".track-checkbox").forEach(trackCb => {
            trackCb.addEventListener("change", function() {
                const allTracks = trackContainer.querySelectorAll(".track-checkbox");
                const checkedTracks = trackContainer.querySelectorAll(".track-checkbox:checked");
                
                if (checkedTracks.length === allTracks.length) {
                    conferenceCheckbox.checked = true;
                    conferenceCheckbox.indeterminate = false;
                } else if (checkedTracks.length > 0) {
                    conferenceCheckbox.checked = false;
                    conferenceCheckbox.indeterminate = true;
                } else {
                    conferenceCheckbox.checked = false;
                    conferenceCheckbox.indeterminate = false;
                }
            });
        });
        
        // Toggle button for showing/hiding tracks
        toggleButton.addEventListener("click", function() {
            trackContainer.style.display = trackContainer.style.display === "none" ? "block" : "none";
        });
    });
}

// Initialize the filters by fetching data and generating the checkboxes
async function initFilters() {
    const filterConfig = await fetchFilterConfig();

    console.log('Filter Config:', filterConfig);

    // Initialize the conference filter
    generateConferenceCheckboxes(filterConfig.track_filter);
}

document.getElementById('uncheckConferences').addEventListener('click', function () {
    document.querySelectorAll('#conferenceFilter input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });
});


function saveFilter() {
    // Get selected conferences
    const selectedConferences = getSelectedFilters('conferenceFilter', '.conference-checkbox');

    // Gather selected tracks for each selected conference
    const selectedTracks = {};
    selectedConferences.forEach(conference => {
        const selectedTrackValues = getSelectedFilters('conferenceFilter', `.track-checkbox[id^="${conference}-"]`);
        selectedTracks[conference] = selectedTrackValues;
    });

    // Get selected content types
    const selectedContentTypes = getSelectedFilters('contentFilter', '.content-checkbox');

    console.log('Selected Conferences:', selectedConferences);
    console.log('Selected Tracks:', selectedTracks);
    console.log('Selected Content Types:', selectedContentTypes);

    // Call a function to filter the events based on the selected filters
    const filteredEvents = filterEvents(events, selectedConferences, selectedTracks, selectedContentTypes);
    console.log(filteredEvents);
    updateTable(filteredEvents); // Update the table with the filtered events
}

// Helper function to get selected checkboxes inside a container
function getSelectedFilters(containerId, selector) {
    return Array.from(document.querySelectorAll(`#${containerId} ${selector}:checked`))
        .map(checkbox => checkbox.id);
}


// Initialize filters when the page loads
initFilters();

renderTable(events);