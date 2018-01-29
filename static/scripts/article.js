"use-strict";

/**
* Get the text that was highlighted by the user.
*/
function getSelectedText() {
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

/**
* Check that the string is already highlighted.
*
* @param highlighted represents that the user wants to add to the highlighted list.
*/
function isAlreadyHighlighted(highlighted) {
    var highlights = getFinalText();
    for (var i = 0; i < highlights.length; i++) {
        if (highlights[i].includes(highlighted)) {
            return true;
        }
    }
    return false;
}

/**
* Add the text to the on-going list.
*/
function add() {
    var highlighted = getSelectedText();

    if (highlighted === "") {
      return ;
    }

    if (isAlreadyHighlighted(highlighted) === true) {
        $("#warning").append("<p>Text has already been selected.</p>")
        return;
    }

    $("#selected").append("<li>" + highlighted + "</li>");
    $("#warning").empty();
    document.getElementById("submit-but").disabled = false;

}

/**
* Returns an array of all the text that has been highlighted by the user.
*/
function getFinalText() {
    var results = [];
    var annotations = $("#selected li");
    annotations.each(function(idx, li) {
        results.push($(li).text());
    });
    return results;
}

/**
* Returns the text of whatever the user selected for the drop-down menu.
* i.e. "Significantly increased/decreased... etc."
*/
function getCheckBoxSelection() {
    var e = document.getElementById("checkbox-list");
    var text = e.options[e.selectedIndex].text;
    return text;
}

/**
* Send the data to the python code.
*/
function submit() {
    var userid = document.getElementById("userid").innerHTML;
    var id = document.getElementById("id").innerHTML;
    var annotations = getFinalText();
    var selection = getCheckBoxSelection();

    if (selection === 'Invalid prompt') {
        $("#myModal").modal('show');
    } else if (annotations.length > 0 || selection === 'Cannot tell based on the abstract') {
        post("/submit/", {"userid": userid, "id": id,
                          "annotations": JSON.stringify(annotations),
                          "selection": selection});
    }
}

/**
* After getting a response, the user will press a button which will save their response.
*/
function submit_invalid_prompt() {
  var userid = document.getElementById("userid").innerHTML;
  var id = document.getElementById("id").innerHTML;
  var text = document.getElementById("response").value;

  if (text !== '') {
    post("/submit/", {"userid": userid, "id": id,
                      "annotations": JSON.stringify([text]),
                      "selection": "Invalid prompt"});
  }

}

/**
* Enable the submit button iff there is selected-text or the user cannot tell
* based on the abstract.
*/
function list_change() {
  var selection = getCheckBoxSelection();
  if (selection === 'Cannot tell based on the abstract' || selection === 'Invalid prompt') {
    document.getElementById("submit-but").disabled = false;
  } else if (getFinalText().length === 0) {
    document.getElementById("submit-but").disabled = true;
  }
}

/**
* Clear all input and disable the submit button.
*/
function clear() {
    var selection = getCheckBoxSelection();
    if (selection !== 'Cannot tell based on the abstract' || selection === 'Invalid prompt') {
      document.getElementById("submit-but").disabled = true;
    }

    $("#selected").empty();
    $("#warning").empty();
    $("#warning").hide();
}


/**
* Disable the submit button unless they've typed something.
*/
function must_type_invalid_prompt() {
    if (document.getElementById("response").value.length > 0) {
      document.getElementById("invalid-submit-but").disabled = false;
    } else {
      document.getElementById("invalid-submit-but").disabled = true;
    }
}

$("#add-but").click(add);
$("#submit-but").click(submit);
$("#restart-but").click(clear);
$("#invalid-submit-but").click(submit_invalid_prompt);
document.getElementById('checkbox-list').onchange = list_change;

var response = document.getElementById('response');
if (response !== null) {
  response.addEventListener("keyup", must_type_invalid_prompt);
}
