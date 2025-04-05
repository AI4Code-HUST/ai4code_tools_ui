---
title: "Scholar Mails Crawler"
date: 2025-03-02T23:41:22+07:00
draft: false
author: "AI4Code"
---

# Scholar Mails Crawler

A tool designed to automatically extract and organize academic publications from Google Scholar received via email. By parsing alert emails, this project collects metadata such as article titles and theirs links to help researchers stay updated with the latest publications in their field.

---

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
    <div id="papersTable" class="pb-1"></div>
    <div class="d-flex flex-row justify-content-center pb-3">
        <nav>
            <ul class="pagination pagination-sm mx-3" id="pagination-controls">
                <!-- Pagination buttons will be dynamically inserted here -->
            </ul>
        </nav>
        <div class="input-group input-group-sm ml-2 pb-3" style="width: 13em;">
            <span class="input-group-text">Page</span>
            <input type="number" class="form-control" id="page-number-input" min="1" placeholder="Page #" value="1">
            <span class="input-group-text" id="total-pages">of X</span>
        </div>
    </div>
    {{< include-js path="scholar.js" >}}
</div>