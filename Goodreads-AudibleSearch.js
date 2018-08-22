// ==UserScript==
// @name         goodreads - audible search
// @namespace    http://your.homepage/
// @version      0.8
// @description  On goodreads book page, search audible to see if the book is available
// @author       jason engler
// @match        https://www.goodreads.com/book/show/*
// @match        https://www.goodreads.com/review/list/*
// @match        https://www.goodreads.com/author/show/*
// @match        https://www.goodreads.com/author/list/*
// @match        https://www.goodreads.com/list/show/*
// @match        https://www.goodreads.com/series/*
// @match        https://www.goodreads.com/search*
// @grant        GM_xmlhttpRequest
// @require      http://code.jquery.com/jquery-latest.js
// ==/UserScript==

(function() {
    'use strict';

    run();
})();

function run(){
    if (window.location.href.indexOf("goodreads.com/book/show") > -1) {
        runBookShow();
    } else if (window.location.href.indexOf("goodreads.com/review/list") > -1) {
        runReviewList();
    } else if (window.location.href.indexOf("goodreads.com/author/show") > -1) {
        runAuthorShow();
    } else if (window.location.href.indexOf("goodreads.com/author/list") > -1) {
        runAuthorList();
    } else if (window.location.href.indexOf("goodreads.com/list/show") > -1) {
        runListShow();
    } else if (window.location.href.indexOf("goodreads.com/series") > -1) {
        runSeries();
    } else if (window.location.href.indexOf("goodreads.com/search") > -1) {
        runSearch();
    }
}

function runSearch() {
    $("table.tableList > tbody > tr").each(function(){
        var tr = $(this);
        var title = getListShowTitle(tr);
        var author = getListShowAuthor(tr);

        var onSearchSuccess = function(url, linkHtml) {
            // show it below the overdrive section
            $(linkHtml + "<br/>").insertBefore(tr.find("td").eq(1).find("span.greyText.smallText.uitext"));
        };

        search(title, author, onSearchSuccess);
    });
}

// shows the audible search results for the book's main page
// eg: https://www.goodreads.com/book/show/34938114-raven-maid
function runBookShow() {
    var title = getBookShowTitle();
    var author = getBookShowAuthor();

    var onSearchSuccess = function(url, linkHtml) {
        // show it below the overdrive section, above "GET A COPY"
        $("div#descriptionContainer").append(linkHtml);
    };

    search(title, author, onSearchSuccess);
}

function getBookShowTitle() {
    var title = "";
    $("h1#bookTitle").first().each(function(){
        title = $(this).text();
    });
    var parenthesisIndex = title.indexOf("(");
    if (parenthesisIndex > 0) {
        // books in a series get parenthesis with the series name at the end
        title = title.substring(0, parenthesisIndex);
    }
    title = title.trim();
    return title;
}

function getBookShowAuthor() {
    var author = "";
    // could be multiple authors. just grab the first one
    $("span[itemprop='name']").first().each(function(){
        author = $(this).text().trim();
    });
    return author;
}

// shows the audible search results for the bookshelves page
// eg: https://www.goodreads.com/review/list/30828001-scott?page=1&per_page=100&shelf=ff-romance&sort=rating&utf8=✓
function runReviewList() {
    $("tbody#booksBody > tr").each(function(){
        var tr = $(this);
        var title = getReviewListTitle(tr);
        var author = getReviewListAuthor(tr);

        var onSearchSuccess = function(url, linkHtml) {
            // show it below the title, above "GET A COPY"
            tr.find("td.field.title > div.value").first().append(linkHtml);
        };

        search(title, author, onSearchSuccess);
    });
}

function getReviewListTitle(tr) {
    var title = "";
    tr.find("td.field.title > div.value > a").first().each(function(){
        title = $(this).text();
    });
    var parenthesisIndex = title.indexOf("(");
    if (parenthesisIndex > 0) {
        // books in a series get parenthesis with the series name at the end
        title = title.substring(0, parenthesisIndex);
    }
    title = title.trim();
    return title;
}

function getReviewListAuthor(tr) {
    var author = "";
    // could be multiple authors. just grab the first one
    tr.find("td.field.author > div.value > a").first().each(function(){
        author = $(this).text();
    });
    return author;
}

// shows the audible search results for the book's main page
// eg: https://www.goodreads.com/book/show/34938114-raven-maid
function runAuthorShow() {
    var author = getAuthorShowAuthor();
    $("table.stacked.tableList > tbody > tr").each(function(){
        var tr = $(this);
        var title = getAuthorShowTitle(tr);

        var onSearchSuccess = function(url, linkHtml) {
            // show it below the overdrive section
            $(linkHtml + "<br/>").insertBefore(tr.find("td").eq(1).find("span.greyText.smallText.uitext"));
        };

        search(title, author, onSearchSuccess);
    });
}

function getAuthorShowTitle(tr) {
    var title = "";
    tr.find("td > a.bookTitle > span[itemprop='name']").first().each(function(){
        title = $(this).text();
    });
    var parenthesisIndex = title.indexOf("(");
    if (parenthesisIndex > 0) {
        // books in a series get parenthesis with the series name at the end
        title = title.substring(0, parenthesisIndex);
    }
    title = title.trim();
    return title;
}

function getAuthorShowAuthor() {
    var author = "";
    // could be multiple authors. just grab the first one
    $("h1.authorName > span[itemprop='name']").first().each(function(){
        author = $(this).text();
    });
    return author;
}

// shows the audible search results for the book's main page
// eg: https://www.goodreads.com/book/show/34938114-raven-maid
function runAuthorList() {
    var author = getAuthorListAuthor();
    $("table.tableList > tbody > tr").each(function(){
        var tr = $(this);
        var title = getAuthorListTitle(tr);

        var onSearchSuccess = function(url, linkHtml) {
            // show it below the overdrive section
            $(linkHtml + "<br/>").insertBefore(tr.find("td").eq(1).find("span.greyText.smallText.uitext"));
        };

        search(title, author, onSearchSuccess);
    });
}

function getAuthorListTitle(tr) {
    var title = "";
    tr.find("td > a.bookTitle > span[itemprop='name']").first().each(function(){
        title = $(this).text();
    });
    var parenthesisIndex = title.indexOf("(");
    if (parenthesisIndex > 0) {
        // books in a series get parenthesis with the series name at the end
        title = title.substring(0, parenthesisIndex);
    }
    title = title.trim();
    return title;
}

function getAuthorListAuthor() {
    // could be multiple authors. just grab the first one
    var author = $("a.authorName").first().text();
    return author;
}

// shows the audible search results for the book's main page
// eg: https://www.goodreads.com/book/show/34938114-raven-maid
function runListShow() {
    $("table.js-dataTooltip.tableList > tbody > tr").each(function(){
        var tr = $(this);
        var title = getListShowTitle(tr);
        var author = getListShowAuthor(tr);

        var onSearchSuccess = function(url, linkHtml) {
            // show it below the overdrive section
            $(linkHtml + "<br/>").insertBefore(tr.find("td").eq(2).find("span.greyText.smallText.uitext"));
        };

        search(title, author, onSearchSuccess);
    });
}

function getListShowTitle(tr) {
    var title = "";
    tr.find("td > a.bookTitle > span[itemprop='name']").first().each(function(){
        title = $(this).text();
    });
    var parenthesisIndex = title.indexOf("(");
    if (parenthesisIndex > 0) {
        // books in a series get parenthesis with the series name at the end
        title = title.substring(0, parenthesisIndex);
    }
    title = title.trim();
    return title;
}

function getListShowAuthor(tr) {
    var author = "";
    // could be multiple authors. just grab the first one
    tr.find("a.authorName > span[itemprop='name']").first().each(function(){
        author = $(this).text();
    });
    return author;
}

// eg: https://www.goodreads.com/series/144297
function runSeries() {
    $("table.js-dataTooltip.tableList > tbody > tr").each(function(){
        var tr = $(this);
        var title = getListShowTitle(tr);
        var author = getListShowAuthor(tr);

        var onSearchSuccess = function(url, linkHtml) {
            // show it below the overdrive section
            $(linkHtml + "<br/>").insertBefore(tr.find("td").eq(1).find("span.greyText.smallText.uitext"));
        };

        search(title, author, onSearchSuccess);
    });
}

function search(title, author, onAudibleSuccess, onLibrarySuccess) {
    searchAudible(title, author, onAudibleSuccess);
    if (!onLibrarySuccess) {
        onLibrarySuccess = onAudibleSuccess;
    }
    searchLibrary(title, author, onLibrarySuccess);
}

// web request to audible to get search results
// returns html to display on the page
// eg: https://www.audible.com/search?advsearchKeywords=&searchTitle=colorblind&searchAuthor=siera+maley
function searchAudible(title, author, onSearchSuccess) {
    title = title.split(' ').join('+');
    author = author.split(' ').join('+');

    // run a search on audible with the title / author to see if the book is there
    // eg: https://www.audible.com/search?advsearchKeywords=&title=colorblind&searchAuthor=siera+maley
    var url = "https://www.audible.com/search?advsearchKeywords=&title=" + title + "&searchAuthor=" + author;
    console.log("About to check url=" + url);

    var onSuccess = function(data) {
        console.log("web request success");
        // get number of results
        data = data.responseText;
        var numResults = $(data).find("span.bc-text.resultsSummarySubheading").first().text().replace(" results", "");
        if (numResults == "") {
            //console.log("no results found");
            return;
        }
        var text = "Found " + numResults + " results on audible";
        console.log(text);
        url = url.replace(/'/g, "");
        if (numResults == "1") {
            // instead of linking search results, link the direct page
            console.log("size=" + $(data).find("ul.bc-list > li.bc-list-item.productListItem").first().length);
            $(data).find("ul.bc-list > li.bc-list-item.productListItem").first().each(function(){
                // url is a relative link /pd/...
                url = "https://www.audible.com" + $(this).find("a.bc-link").first().attr("href");
                // load the url and find the narrator since there's only one result
                function onNarratorSuccess(narrator) {
                    var linkHtml = "<div id='audible'><a href='" + url + "' style='color:red;'>" + text + " narrated by " + narrator + "</a></div>";
                    onSearchSuccess(url, linkHtml);
                }
                console.log("about to get narrator at url " + url);
                getNarrator(url, onNarratorSuccess);
            });
        } else {
            // multiple results, so show search page
            var linkHtml = "<div id='audible'><a href='" + url + "' style='color:red;'>" + text + "</a></div>";
            onSearchSuccess(url, linkHtml);
        }
        // nothing happens if there are no results
    };

    // http://stackoverflow.com/questions/24688294/how-do-i-allow-cross-origin-requests-from-greasemonkey-scripts-in-firefox
    GM_xmlhttpRequest({
        method: "GET",
        url: url,
        onload: onSuccess
    });
    searchLibrary(title, author, null);
}

function searchLibrary(title, author, onSearchSuccess) {
    //https://cbpl.ent.sirsi.net/client/en_US/default/search/results?qu=&qu=TITLE=finders keepers &qu=AUTHOR=stephen king
    var url = "https://cbpl.ent.sirsi.net/client/en_US/default/search/results?qu=&qu=TITLE=" + title + " &qu=AUTHOR=" + author + "&qf=FORMAT%09Format%09BOOK%09Books";
    var onSuccess = function(data) {
        console.log("web request success from library");
        data = data.responseText;
        var resultsText = $(data).find("div.resultsToolbar_num_results").first().text();
        if (!resultsText) {
            // not found in library
            return;
        }

        console.log("library results: " + resultsText.trim());
        var text = resultsText + " in library";
        var linkHtml = "<div id='audible'><a href='" + url + "' style='color:orange;'>" + text + "</a></div>";
        if (onSearchSuccess) {
            onSearchSuccess(url, linkHtml);
        }
    }
    GM_xmlhttpRequest({
        method: "GET",
        url: url,
        onload: onSuccess
    });
}

// get the narrator from a book's url.
// eg: https://www.audible.com/pd/Sci-Fi-Fantasy/The-Fifth-Season-Audiobook/B012HQ7IPY
// returns narrator's name as text
function getNarrator(url, onSuccess) {
    var onLoadSuccess = function(data) {
        data = data.responseText;
        var narrators = [];
        $(data).find("li.bc-list-item.narratorLabel > a").each(function(){
            var narrator = $(this).text();
            narrators.push(narrator);
        });
        var narratorList = narrators.join(", ");
        console.log("found narratorList " + narratorList);
        onSuccess(narratorList);
    };
    // http://stackoverflow.com/questions/24688294/how-do-i-allow-cross-origin-requests-from-greasemonkey-scripts-in-firefox
    GM_xmlhttpRequest({
        method: "GET",
        url: url,
        onload: onLoadSuccess
    });
}
