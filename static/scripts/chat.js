// Collapsible
var coll = document.getElementsByClassName("collapsible");

for (let i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function () {
        this.classList.toggle("active");

        var content = this.nextElementSibling;

        if (content.style.maxHeight) {
            content.style.maxHeight = null;
        } else {
            content.style.maxHeight = content.scrollHeight + "px";
        }

    });
}

function getTime() {
    let today = new Date();
    hours = today.getHours();
    minutes = today.getMinutes();

    if (hours < 10) {
        hours = "0" + hours;
    }

    if (minutes < 10) {
        minutes = "0" + minutes;
    }

    let time = hours + ":" + minutes;
    return time;
}

// Gets the first message
function firstBotMessage() {
    let firstMessage = "Welcome to QnA session powered by Generative AI!"
    document.getElementById("botStarterMessage").innerHTML = '<p class="botText"><span>' + firstMessage + '</span></p>';

    let time = getTime();

    $("#chat-timestamp").append(time);
    document.getElementById("userInput").scrollIntoView(false);
}

firstBotMessage();

// Retrieves the response
function getBackendResponse() {
    fetch('/chatbot')
      .then(response => response.json())
      .then(data => {
        var reply = data.reply
    let botHtml = '<p class="botText"><span>' + reply + '</span></p>';
    $("#chatbox").append(botHtml);

    document.getElementById("chat-bar-bottom").scrollIntoView(true);
        // You can use the myString variable in JavaScript as needed
      })
      .catch(error => {
        console.error('Error:', error);
      });
    l
}

function getBotResponse() {
    fetch('/chatbot' )
      .then(response => response.json())
      .then(data => {
        var myString = data.reply
        reply = data.reply
        // You can use the myString variable in JavaScript as needed
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

//Gets the text text from the input box and processes it
// Implemented in Python, by sending it through ajax
function getResponse() {

    let userText = $("#textInput").val();

    if (userText == "") {
        userText = "Your recorded audio was sent!";
    }

    let userHtml = '<p class="userText"><span>' + userText + '</span></p>';

    $("#textInput").val("");
    $("#chatbox").append(userHtml);
    document.getElementById("chat-bar-bottom").scrollIntoView(true);
    
    setTimeout(() => {
      getBackendResponse();
    }, 5000)

}

// Handles sending text via button clicks
function buttonSendText(sampleText) {
    let userHtml = '<p class="userText"><span>' + sampleText + '</span></p>';

    $("#textInput").val("");
    $("#chatbox").append(userHtml);
    document.getElementById("chat-bar-bottom").scrollIntoView(true);

}

// Press enter to send a message
// Data is also sent to the flask backend
$("#textInput").keypress(function (e) {
    if (e.which == 13) {
    var input = document.getElementById("textInput");

  $.ajax({
    type: 'POST',
    url: '/chatbot',
    data: JSON.stringify(input.value),
    contentType: "application/json",
    dataType: 'json'
  });
        
    getResponse();

    }
});


