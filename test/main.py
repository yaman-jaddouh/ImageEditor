from flask import Flask,render_template, request, jsonify,send_from_directory
import base64
import os
app = Flask(__name__)

@app.route('/')
def hello():
    return render_template('index.html')

@app.route('/base64' ,methods=["POST"])
def upload_image():
    data = request.get_json()
    image_data = data['image']

    # Remove the data:image/jpeg;base64, part
    base64_image = image_data.split(',')[1]

    # Decode the base64 string
    image_bytes = base64.b64decode(base64_image)

    # Define a filename and save the image
    filename = 'uploaded_image.jpg'
    with open(filename, 'wb') as f:
        f.write(image_bytes)

    return jsonify({"message": "Image received and saved!", "filename": filename})


@app.route('/ww.jpg')
def sendJs():
    return send_from_directory("./","ww.jpg")

app.run(host='0.0.0.0',port=5000)