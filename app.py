from flask import Flask, render_template, request, jsonify
import os
from datetime import datetime
import re
import whisper
model = whisper.load_model("small")

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
    #printing the transcribe
    return text['text']

def _prompt_openAI():

    with open(os.path.join(app.config["UPLOAD_FOLDER"], "question.txt"), 'r') as f:
        question=f.read()
    print(question)

    reply=f"{question}, {len(question.split())}"
    return reply

if __name__=='__main__':
    app.debug=True
    app.run(debug=True, port=5001)