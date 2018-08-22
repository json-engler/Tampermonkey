// ==UserScript==
// @name         Audible - Library
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Shows the narrator below the author in audible's library
// @author       Jason Engler
// @match        https://www.audible.com/lib*
// @match        https://www.audible.com/a/library*
// @grant        none
// @require http://code.jquery.com/jquery-latest.js
// ==/UserScript==
// for sample image, see https://imgur.com/a/vvyZuX1

 var $ = jQuery.noConflict();
(function() {
    //'use strict';
    // requiring jquery causes audible's library search not to work. it's already there

    run();
})();

function run() {
    $("tr.bc-table-row.bc-color-background-secondary.bc-color-divider-base").each(function(){
        // exclude the headers / footers
        if (this.id.includes("adbl-library-content-row-")) {
            processRow(this);
        }
    });
}

function processRow(tr) {
    var bookId = tr.id.split("-").pop();
    console.log("found row id=" + bookId);
    var narrator = getNarrator(bookId);
    if (!narrator) {
        console.log("Didn't find a narrator for bookId " + bookId);
        return;
    }
    // find the author column
    var authorColumn = $(tr).find("td.bc-table-column.bc-color-border-base").get(2);
    $(authorColumn).find("a.bc-link.bc-color-link").first().each(function(){
        console.log("Found author " + $(this).text().trim());
        $(this).parent().append($("<br/><span style='color:green'>" + narrator + "</span>"));
    });
}

function getNarrator(bookId) {
    var narrator = null;
    var popup = $("div#product-list-flyout-" + bookId).first();
    if (popup) {
        console.log("found div for " + bookId);
        var narratedBy = $(popup).find("li.bc-list-item:contains('Narrated')").first();
        if (narratedBy) {
            narrator = $(narratedBy).text().trim().replace(/\s\s+/g, " ");
        }
    }
    console.log("Found narrator " + narrator);
    return narrator;
}
