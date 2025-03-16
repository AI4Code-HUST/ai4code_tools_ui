---
title: "Conference & Journal Papers Crawler"
date: 2025-03-02T11:31:51+07:00
author: "AI4Code"
draft: true
js:
  [
    "https://cdn.jsdelivr.net/npm/use-bootstrap-tag@2.2.2/dist/use-bootstrap-tag.min.js",
    "https://unpkg.com/gridjs/dist/gridjs.umd.js",
    "https://unpkg.com/tabulator-tables@5.4.3/dist/js/tabulator.min.js"
  ]
css:
  [
    "https://cdn.jsdelivr.net/npm/use-bootstrap-tag@2.2.2/dist/use-bootstrap-tag.min.css",
    "https://unpkg.com/gridjs/dist/theme/mermaid.min.css",
    "https://unpkg.com/tabulator-tables@5.4.3/dist/css/tabulator.min.css"
  ]
---

# Conference & Journal Papers Crawler

<div>
    <div class="justify-content-end pb-1">
        <button class="btn btn-outline-secondary" type="button" data-bs-toggle="collapse" data-bs-target="#confCrawlerSearch" aria-expanded="false" aria-controls="confCrawlerSearch">
            Filter
        </button>
    </div>
    <div class="collapse pb-1" id="confCrawlerSearch">
        <div class="card card-body">
            {{< tagsInput id="keywords" label="Keywords" >}}
            {{< tagsInput id="years" label="Years" >}}
            <button type="button" class="btn btn-outline-secondary" data-bs-toggle="collapse" data-bs-target="#confCrawlerSearch" aria-expanded="false" aria-controls="confCrawlerSearch" id="paperFilterButton">Save</button>
        </div>
    </div>
    <div id="papersTable"></div>
    {{< include-js path="paper.js" >}}
</div>

A tool designed to automatically extract and organize academic publications from conference and journal websites. By parsing the websites, this project collects metadata such as article titles and theirs links to help researchers stay updated with the latest publications in their field.
