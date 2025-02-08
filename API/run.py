from flask import Flask, request
from utils import *

app = Flask(__name__)

@app.route('/recommend', methods=['POST'])
def recommend():
    data = request.get_json()
    user = data.get('User', [])
    user = pd.DataFrame([user])
    MovieIDs = Recommend(user)
    return {'MovieIDs': MovieIDs.tolist()}

if __name__ == '__main__':
    app.run(port=5000, debug=True)
    