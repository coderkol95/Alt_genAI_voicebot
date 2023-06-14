from flask import Flask, render_template, request, jsonify
import os
from datetime import datetime
import re
import whisper
model = whisper.load_model("small")
import time

def filename():
    return re.sub('[^0-9]','',str(datetime.now()))

app = Flask(__name__)
app.config["UPLOAD_FOLDER"] = "./data/"

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/chatbot', methods=['GET','POST'])
def chatbot():

    if request.method == "POST":
        if 'data' in request.files:
            file = request.files['data']
            filepath=os.path.join(app.config["UPLOAD_FOLDER"], "audio.wav")
            # Write the data to a file.
            file.save(filepath)
        
            question = _convert_speech_to_text(filepath)
        else:
            question = request.get_json()

        with open(os.path.join(app.config["UPLOAD_FOLDER"], "question.txt"), 'w') as f:
            f.write(question)
        
        return 'OK', 200
    
    else:
        reply=_prompt_openAI()
        return jsonify({'reply':reply})

def _convert_speech_to_text(file_path):

    text = model.transcribe(file_path)

    # Delete audio file so that same file's transcription is not possible next time
    os.remove('./data/audio.wav')

    return text['text']


def _prompt_openAI():

    file_name=os.path.join(app.config["UPLOAD_FOLDER"], "question.txt")

    # Wait if an audio file has not been transcribed yet
    while not os.path.exists(file_name):
        time.sleep(1)

    with open(file_name, 'r') as f:
        question=f.read()

    reply=f"{question}, {len(question.split())}"

    # Delete file so that same file is not re-read
    os.remove('./data/question.txt')

    return reply

if __name__=='__main__':

    audio_file=os.path.join(app.config["UPLOAD_FOLDER"], "audio.wav")
    text_file=os.path.join(app.config["UPLOAD_FOLDER"], "question.txt")

    if os.path.exists(audio_file):
        os.remove(audio_file)
    
    if os.path.exists(text_file):
        os.remove(text_file)


    app.run(debug=True, port=5001)