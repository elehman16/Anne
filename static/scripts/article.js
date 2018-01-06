function preventMultiCheck() {
    var box = $(this);
    if (box.is(":checked")) {
        var group = "input:checkbox";
        $(group).prop("checked", false);
        box.prop("checked", true);
    } else {
        box.prop("checked", false);
    }
}

function getSelectionText() {
    var text = "";

    if (window.getSelection) {
        text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text;
    }
    window.getSelection().removeAllRanges();

    text = text.trim();
    return text;
}

function isAlreadyHighlighted(highlighted) {
    var highlights = getFinalText();
    for (var i = 0; i < highlights.length; i++) {
        if (highlights[i].includes(highlighted)) {
            return true;
        }
    }
    return false;
}

function add() {
    var highlighted = getSelectionText();

    if (isAlreadyHighlighted(highlighted) === true) {
        $("#warning").append("<p>Text has already been selected.</p>")
        return;
    }

    $("#selected").append("<li>" + highlighted + "</li>");
    $("#text").html($("#text").html().replace(
        highlighted,
        "<span style=\"font-weight: bold;\">" + highlighted + "</span>")
    );
    $("#warning").empty();
}

function getFinalText() {
    var results = [];
    var annotations = $("#selected li");
    annotations.each(function(idx, li) {
        results.push($(li).text());
    });
    return results;
}

function getSelection() {
    var choice = ""
    $("input:checkbox:checked").each(function(){
        choice = $(this).next("label").text();
    });
}

function submit() {
    var userid = document.getElementById("userid").innerHTML;
    var id = document.getElementById("id").innerHTML;
    var annotations = getFinalText();
    var selection = getSelection();
    if (annotations.length > 0) {
        post("/submit/", {"userid": userid, "id": id,
                          "annotations": JSON.stringify(annotations),
                          "selection": selection});
    }
}

function clear() {
    $("#selected").empty();
    $("#warning").empty();
    $("#warning").hide();
    $("#abstract").html($("#abstract").html().replace(
        new RegExp("<span.+\">|<\/span>", "g"),
        "")
    );
}

$("input:checkbox").click(preventMultiCheck);
$("#add-but").click(add);
$("#submit-but").click(submit);
$("#clear-but").click(clear);
