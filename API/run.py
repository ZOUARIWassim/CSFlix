from flask import Flask, request
from utils import *
from flask_cors import CORS

app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

@app.route('/recommend/<userId>', methods=['GET'])
def recommend(userId):
    userVec = getuserData(userId)
    tdmbIds = Recommend(userVec)
    return tdmbIds

if __name__ == '__main__':
    app.run(port=5000, debug=True)
    