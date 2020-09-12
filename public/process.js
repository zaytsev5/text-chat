let socket = io("http://localhost:4000");
let currentRoom = '';
let missMess = 0;
let inRoom = [];
let room = [];


socket.on("server-send-rooms", function (data) {
    $("#dsRoom").html("");
    data.map(function (r) {
        //  $("#dsRoom").append("<h4 class='room'>" + r + "</h4>");
    });
});

// ACITVE BUTTON WHEN CLICK
function selected(x) {
    console.log(x)
    inRoom.forEach(function (r) {
        document.getElementById(r).style.backgroundColor = '#E24727';
        document.getElementById(r).style.color = '#dfdfdf';
    });
}

//WHEN handleSelected ROOM TO CHAT
function handleSelected(data) {
    console.log(room);
    // var dat=data;
    currentRoom = data;
    console.log(currentRoom);
    socket.emit("select_room", data);
    selected(data);
    document.getElementById(data).style.backgroundColor = '#E57953';
    document.getElementById(data).style.color = '#dfdfdf';
    document.querySelector('.room-name').innerHTML = `ROOM - ${data}`

}

socket.on("server-send-room-socket", function (data) {
    var name = data;
    room.push(name);
    $(".chat-room").append("<div  id='" + name + "' onclick='handleSelected(\"" + name + "\")' class='room'>" + data + "</div>");

    // $(".dropdown-menu").append("<a  id='"+ name + "' onclick='handleSelected(\""+ name + "\")' class='dropdown-item'>" + data + "</a>");
    //$(".dropdown-menu").append("<button  id='"+ name + "' onclick='handleSelected(\""+ name + "\")' class='"+data+"'>" + data + "</button>");
});

socket.on("show-message", function (data) {
    console.log(data)
    $(".show-message").html('');
    data.mes.forEach(function (r) {
        var date = new Date();
        var time = "  send " + date.getHours() + ':' + date.getMinutes()
        $(".show-message").append("<li class='show-message-item'>" + r.message + "<small>" + "<small></li>");
    })
    $(".badge-light").html('');
    //console.log(data.room)


});

socket.on("server-chat", function (data) {

    if (currentRoom == data.room) {
        $(".show-message").html('');
        data.mes.forEach(function (r) {
            $(".show-message").append("<li class='show-message-item'>" + r.message + "</li>");
        })

    } else {
        if (inRoom.includes(data.room)) {
            $(".badge-light").html('New');
            document.getElementById(data.room).style.color = 'white';
        }

    }
    $(".show-message").animate({scrollTop: $(document).height()}, "fast");
});

$(document).ready(function () {
    const chatBox = document.querySelector('.container')
    const crossBar = document.querySelector('.cross-bar')

    $("#btnTaoRoom").click(function () {
        socket.emit("tao-room", $("#action-add").val());
        inRoom.push($("#action-add").val())
        console.log(inRoom)
        $("#action-add").val('')


        //console.log(inRoom)
    });
    $("#btnChon").click(function () {
        // socket.emit("chon-room",'A');
        console.log("clicked");
    });

    $("#btnChat").click(function () {
        if ($("#action-chat").val()) {
            socket.emit("user-chat", $("#action-chat").val());
            $("#action-chat").val('');
            $(".show-message").animate({scrollTop: $(document).height()}, "fast");
        } else {
            alert('Please fill this field!')
        }

        //  console.log("a");

    });

    $('#action-chat').keypress(function (event) {

        var keycode = (event.keyCode ? event.keyCode : event.which);
        if (keycode == '13') {
            if ($("#action-chat").val()) {
                socket.emit("user-chat", $("#action-chat").val());
                $("#action-chat").val('');
                $(".show-message").animate({scrollTop: $(document).height()}, "fast");
            } else {
                alert('Please fill this field!')
            }
        }

    });

    $('#action-add').keypress(function (event) {

        var keycode = (event.keyCode ? event.keyCode : event.which);
        if (keycode == '13') {
            socket.emit("create-room", $("#action-add").val());
            inRoom.push($("#action-add").val())
            console.log(inRoom)

            $("#action-add").val('')
            //inRoom.push( $("#action-add").val(''))
        }

    });

// move chat box to anywhere
    crossBar.onmousedown = function (event) {
        console.log("onmousemoved");
        // console.log(event.clientX);
        let shiftX = event.clientX - chatBox.getBoundingClientRect().left;
        let shiftY = event.clientY - chatBox.getBoundingClientRect().top;
        // (1) prepare to moving: make absolute and on top by z-index
        chatBox.style.position = 'absolute';
        chatBox.style.zIndex = 1000;

        // move it out of any current parents directly into body
        // to make it positioned relative to the body
        //document.body.append(chatBox);

        // centers the chatBox at (pageX, pageY) coordinates
        function moveAt(pageX, pageY) {
            const left = pageX - shiftX
            const top = pageY - shiftY
            chatBox.style.left = left >= 0 ? left + 'px' : '0px';
            chatBox.style.top = top >= 0 ? top + 'px' : '0px';
        }

        // move our absolutely positioned chatBox under the pointer
        moveAt(event.pageX, event.pageY);

        function onMouseMove(event) {
            console.log(event.pageX);
            moveAt(event.pageX, event.pageY);
        }

        // (2) move the chatBox on mousemove
        document.addEventListener('mousemove', onMouseMove);

        // (3) drop the chatBox, remove unneeded handlers
        chatBox.onmouseup = function () {
            document.removeEventListener('mousemove', onMouseMove);
            crossBar.onmouseup = null;
        };

    };
});