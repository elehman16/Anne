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

function getFinalText(){
    var results = [];
    var annotations = $("#selected li");
    annotations.each(function(idx, li) {
      results.push($(li).text());
    });
    return results;
}

function submit() {
    console.log("submits");
    var userid = document.getElementById("userid").innerHTML;
    var id = document.getElementById("id").innerHTML;
    var annotations = getFinalText();
    if (annotations.length > 0) {
        post("/submit/", {'userid': userid, 'id': id, 'annotations': JSON.stringify(annotations)});
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

$("#add-but").click(add);
$("#submit-but").click(submit);
$("#clear-but").click(clear);
