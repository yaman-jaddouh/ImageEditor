from flask import Flask,render_template,send_from_directory,send_file,request

app = Flask(__name__)


@app.route('/')
def hello():
    return render_template('index.html')


@app.route('/images/<filename>') 
def sendImages(filename): 

    # return send_file(f"image\{filename}")
    return send_from_directory('images',filename)
import os 
@app.route('/ImageUploaded' , methods=['POST'])
def handle():
    print()
    files = request.files.getlist('files')
    for file in files:
        file.save(os.path.join(os.path.join(app.instance_path,'uploads'), file.filename))
    return "as"
app.run(host='0.0.0.0',port=5000)