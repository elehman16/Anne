function start() {
    var id_ = document.getElementById("textfield").value;
    post("/start/", {"userid": id_})
}

$("#start-but").click(start);
