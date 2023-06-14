// let recordBlob;
  
var recordButton = document.getElementById("recordButton");
var mediaRecorder;
var chunks = [];

function toggleRecording() {
  if (mediaRecorder && mediaRecorder.state === "recording") {
    // Stop recording
    mediaRecorder.stop();
    recordButton.innerHTML = "Record";
  } else {
    // Start recording
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(function(stream) {
        // Create MediaRecorder object
        mediaRecorder = new MediaRecorder(stream);

        // Event handlers for recording
        mediaRecorder.ondataavailable = function(e) {
          chunks.push(e.data);
        };

        mediaRecorder.onstop = function() {
          // Convert recorded data to a single Blob
          var audioBlob = new Blob(chunks, { type: {type:'audio/wav; codecs=MS_PCM'} });

          // Reset chunks array
          chunks = [];

          let formData = new FormData();
          formData.append('data', audioBlob, "data.wav");
          console.log('blob', audioBlob);

          $.ajax({
            type: 'POST',
            url: '/chatbot',
            data: formData,
            contentType: false,
            processData: false
          });
          getResponse();
        };

        // Start recording
        mediaRecorder.start();
        recordButton.innerHTML = "Stop";
      })
      .catch(function(err) {
        console.error("Error accessing microphone: ", err);
      });
  }
}
