---
title: "Conference Dates Tracker"
date: 2025-03-02T12:49:16+07:00
author: "Trung Phong Au, Duc Manh Tran"
draft: false
---

# Conference Dates Tracker 

A tool that scrapes conference events from [conf.researchr.org](https://conf.researchr.org), filters them based on the user's needs, and daily updates user Google Calendar via GitHub Actions and emails.

---


<div>
    <div class="justify-content-end pb-1">
        <button class="btn btn-outline-secondary" type="button" data-bs-toggle="collapse" data-bs-target="#confCrawlerSearch" aria-expanded="false" aria-controls="confCrawlerSearch">
            Filter
        </button>
    </div>
    <div class="collapse pb-1" id="confCrawlerSearch">
        <div class="card card-body">
            <div class="d-flex align-items-center justify-content-between">
                <h4>Conferences & Tracks</h4>
                <div>
                    <button class="btn btn-link btn-sm" type="button" data-bs-toggle="collapse" data-bs-target="#conferenceFilter" aria-expanded="true" aria-controls="conferenceFilter">
                        Toggle Conferences & Tracks
                    </button>
                    <button type="button" class="btn btn-outline-danger btn-sm" id="uncheckConferences">Uncheck All</button>
                </div>
            </div>
            <div id="conferenceFilter" class="collapse show">
                <!-- Dynamically generated conference and track checkboxes -->
            </div>
            <div class="d-flex justify-content-between mt-2">
                <button type="button" class="btn btn-outline-secondary" data-bs-toggle="collapse" data-bs-target="#confCrawlerSearch" aria-expanded="false" aria-controls="confCrawlerSearch" id="eventFilterButton">
                    Save
                </button>
            </div>
        </div>
    </div>
    <div id="conferenceEventDateTable" class="pb-1"></div>
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
    {{< include-js path="event_dates.js" >}}
</div>
