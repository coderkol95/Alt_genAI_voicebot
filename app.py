from flask import Flask, render_template, request
from werkzeug.utils import secure_filename
import os
from datetime import datetime
import re

def filename():

    return re.sub('[^0-9]','',str(datetime.now()))

app = Flask(__name__)
app.config["UPLOAD_FOLDER"] = "./audio_files/"

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/result', methods=['GET','POST'])
def result():

    if request.method == "POST":
        if 'data' in request.files:
            file = request.files['data']
            print(file)
            # Write the data to a file.
            filepath = os.path.join(app.config["UPLOAD_FOLDER"], f"{filename()}.wav")
            file.save(filepath)
        
            ##########################################################################################
            # 
            # Call function to convert this file to string and return it in variable 'question'
            # question = _convert_speech_to_text(filepath)
            #
            ##########################################################################################

        else:
            question = request.form.get('question')
    
        ##########################################################################################
        # 
        # reply=_prompt_openAI(question)        
        # 
        ##########################################################################################


        return render_template("index.html", reply=reply)
    return render_template("index.html")

if __name__=='__main__':
    app.debug=True
    app.run(debug=True, port=5001)