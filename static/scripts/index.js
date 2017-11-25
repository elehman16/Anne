var start = function () {
    var id = document.getElementById("textfield").value;
    post("/start/", {'userid': id})
}

$("#start-but").click(start);
