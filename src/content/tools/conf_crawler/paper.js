const year = UseBootstrapTag(document.getElementById("years"));
const keyword = UseBootstrapTag(document.getElementById("keywords"));

let papers = [];

fetch(
    "https://raw.githubusercontent.com/manhtdd/conf-crawler/refs/heads/main/outputs/papers.jsonl"
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
    });

function filterPapers(papers, selectedYears, keywords) {
    return papers.filter((paper) => {
        const yearMatch =
            selectedYears.length === 0 ||
            selectedYears.includes(paper.conference.match(/\d{4}/)[0]);
        const keywordMatch =
            keywords.length === 0 ||
            keywords.some((keyword) =>
                paper.paper.toLowerCase().includes(keyword.toLowerCase())
            );
        return yearMatch && keywordMatch;
    });
}

function renderTable(papers) {
    new gridjs.Grid({
        columns: ["Conference", "Paper Title"],
        data: papers.map((paper) => [
            gridjs.html(
                `<a href="${paper.conference_url}" target="_blank">${paper.conference}</a>`
            ),
            gridjs.html(
                `<a href="${paper.paper_url}" target="_blank">${paper.paper}</a>`
            ),
        ]),
        search: true,
        pagination: {
            enabled: true,
            limit: 20,
        },
    }).render(document.getElementById("papersTable"));
}

const table = new Tabulator("#papersTable", {
    data: papers.slice(0,30), // Assign data to table
    layout: "fitColumns", // Fit columns to width of table
    height: "500px", // Set height of table to enable virtual DOM
    columns: [
        { title: "Conference", field: "conference", formatter: "link", formatterParams: { urlField: "conf_url" } },
        { title: "Paper", field: "paper", formatter: "link", formatterParams: { urlField: "paper_url" } }
    ],
});

document
    .getElementById("paperFilterButton")
    .addEventListener("click", function () {
        console.log("clicked");
    });
