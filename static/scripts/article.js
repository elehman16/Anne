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

    // store the data in the corresponding box
    $("#selected").append("<li>" + highlighted + "</li>");
    $("#warning").empty();

    // disable the add-text button, and enable the clear button
    document.getElementById("add-but").disabled = true;
    document.getElementById("restart-but").disabled = false;

    // only enable the submit button if the user has selected a dragdown.
    var selection = getCheckBoxSelection();
    if (selection !== "") {
      document.getElementById("submit-but").disabled = false;
    }
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
  var selected = document.getElementsByName('select');
  var ans = "";
  for (var i = 0; i < selected.length; i++){
    if (selected[i].checked) {
        ans = selected[i].value;
        break;
    }
  }


  return ans;
}

/**
* Send the data to the python code.
*/
function submit() {
    var userid = document.getElementById("userid").innerHTML;
    var id = document.getElementById("id").innerHTML;
    var pid = document.getElementById("pid").innerHTML;
    var annotations = getFinalText();
    var selection = getCheckBoxSelection();
    var outcome = document.getElementById("outcome_save").innerHTML;
    var comparator = document.getElementById("comparator_save").innerHTML;
    var intervention = document.getElementById("intervention_save").innerHTML;
    var xml_file = document.getElementById("xml_file").innerHTML;

    // Modify the necessary annotations to include the whole table.
    for (var j = 0; j < annotations.length; j++) {
    // Determine if this is in a table.
      var trs = document.getElementsByTagName("tr");
      var text = annotations[j];
      for (var i = 0; i < trs.length; i++) {
        var tr = trs[i];
        var txt = tr.innerText;
        // Check if either are a substring of another -> if so, save it.
        if (text.indexOf(txt) != -1 || txt.indexOf(text) != -1) {
          annotations[j] = tr.innerHTML;
        }
      }
    }

    if (selection === 'Invalid Prompt') {
        $("#myModal").modal('show');
    } else if (annotations.length > 0 || selection === 'Cannot tell based on the abstract') {
        post("/submit/", {"userid": userid,
                          "pid": pid, 
                          "id": id,
                          "annotations": JSON.stringify(annotations),
                          "selection": selection,
                          "outcome": outcome,
                          "comparator": comparator,
                          "intervention": intervention,
                          "xml_file": xml_file});
    }
}

/**
* After getting a response, the user will press a button which will save their response.
*/
function submit_invalid_prompt() {
  var userid = document.getElementById("userid").innerHTML;
  var id = document.getElementById("id").innerHTML;
  var text = document.getElementById("response").value;
  var selection = getCheckBoxSelection();
  var outcome = document.getElementById("outcome_save").innerHTML;
  var comparator = document.getElementById("comparator_save").innerHTML;
  var intervention = document.getElementById("intervention_save").innerHTML;
  var xml_file = document.getElementById("xml_file").innerHTML;

  if (text !== '') {
    post("/submit/", {"userid": userid, "id": id,
                      "annotations": JSON.stringify([text]),
                      "selection": selection,
                      "outcome": outcome,
                      "comparator": comparator,
                      "intervention": intervention,
                      "xml_file": xml_file});
  }

}

/**
* Enable the submit button iff there is selected-text or the user cannot tell
* based on the abstract.
*/
function list_change() {
  var selection = getCheckBoxSelection();
  if (selection === 'Cannot tell based on the abstract' || selection === 'Invalid Prompt') {
    document.getElementById("submit-but").disabled = false;
  } else if (getFinalText().length === 0) {
    document.getElementById("submit-but").disabled = true;
  } else {
    document.getElementById("submit-but").disabled = false;
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

    document.getElementById("restart-but").disabled = true;

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

/**
* When the user moves mouse onto this button, change the color.
*/
function hover_over(item) {
  item.style.background = "#ccc";
}

/**
* When the user moves mouse away from this button, change the color.
*/
function hover_away(item) {
   var names = item.className;
   if (names.includes('active')) {
     return ;
   }

   item.style.background = "#f1f1f1";
}

/**
* Gets the highlighted text without removing the selection.
*/
function get_Highlight_Text_No_Remove() {
  var text = "";
  if (window.getSelection) {
      text = window.getSelection().toString();
  } else if (document.selection && document.selection.type != "Control") {
      text = document.selection.createRange().text;
  }

  text = text.trim();
  return text;
}

/**
* Disable/enable the add button iff text is selected.
*/
function addButtonAvail() {
  var highlighted = get_Highlight_Text_No_Remove();

  if (highlighted === "") {
    document.getElementById("add-but").disabled = true;
  } else {
    document.getElementById("add-but").disabled = false;
  }
}

// add functions to the buttons
$("#add-but").click(add);
$("#submit-but").click(submit);
$("#restart-but").click(clear);
$("#invalid-submit-but").click(submit_invalid_prompt);
document.onmouseup = addButtonAvail; // call this function whenever the person lifts up his or her mouse

// add functionality to the modal
var response = document.getElementById('response');
response.addEventListener("keyup", must_type_invalid_prompt);
