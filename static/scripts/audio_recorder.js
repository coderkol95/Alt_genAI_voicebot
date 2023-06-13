let recordBlob;
  
navigator.mediaDevices.getUserMedia({audio:true})
                      .then(stream => {handlerFunction(stream)})

function handlerFunction(stream) {
  rec = new MediaRecorder(stream);
  rec.ondataavailable = e => {
    audioChunks.push(e.data);
    if (rec.state == "inactive") {
      recordBlob = new Blob(audioChunks, {type:'audio/wav; codecs=MS_PCM'});
      recordedAudio.src = URL.createObjectURL(blob);
      recordedAudio.controls=true;
      recordedAudio.autoplay=true;
    }
  }
}

record.onclick = e => {
    record.disabled = true;
    record.style.backgroundColor = "blue"
    stopRecord.disabled=false;
    audioChunks = [];
    rec.start();
}

stopRecord.onclick = e => {
  record.disabled = false;
  stop.disabled=true;
  record.style.backgroundColor = "red"
  rec.stop();
// }
// sendRecord.onclick = e => {
  let formData = new FormData();
  
  formData.append('data', recordBlob, "data.wav");

  console.log('blob', recordBlob);

  $.ajax({
    type: 'POST',
    url: '/result',
    data: formData,
    contentType: false,
    processData: false,
    success: function(result) {
      console.log('success', result);

      $("#chatbox").append(`<p class ="userText"><audio style="background-color:white;" controls> <source src="${Url}" type="audio/wav"></audio></p>`);
      $("#chatbox").append(`<p class ="botText"><span>${result.emotion}</span></p>`);
      $("#textInput").val("")
    },
    error: function(result) {
      alert('sorry an error occured');
    }
  });
}