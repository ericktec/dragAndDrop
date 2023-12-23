from flask import Flask, jsonify, request, make_response 
import uuid 
from os import path, listdir
from flask_socketio import SocketIO, emit

app = Flask(__name__, static_url_path="/static")
app.config["CORS_HEADERS"] = "Content-Type"
socketio = SocketIO(app, cors_allowed_origins="*")

STATIC_DIRECTORY = path.join("./", "static")

tierList = [
  { "id": "id0", "name": "S", "tierColor": "var(--tier-color-red)", "elements": [] },
  { "id": "id1", "name": "A", "tierColor": "var(--tier-color-orange)", "elements": [] },
  { "id": "id2", "name": "B", "tierColor": "var(--tier-color-yellow)", "elements": [] },
  { "id": "id3", "name": "C", "tierColor": "var(--tier-color-green)", "elements": [] },
  {
    "id": "id4",
    "name": "Elements",
    "tierColor": "var(--tier-color-transparent)",
    "elements": [
        {
            "id": str(uuid.uuid4()), 
            "image": "http://192.168.50.85:8000/static/{filename}".format(filename = filename) 
        } for filename in listdir(STATIC_DIRECTORY) 
    ]
  },
];


def _build_cors_preflight_response():
    response = make_response()
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add('Access-Control-Allow-Headers', "*")
    response.headers.add('Access-Control-Allow-Methods', "*")
    return response

def _corsify_actual_response(response):
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add('Access-Control-Allow-Headers', "*")
    return response

# @app.route("/getBloodborneTierList", methods = ["GET"])
# def tierListElements():

@socketio.on("connect")
def handleConnect(data): 
    emit("userConnected", tierList)

@socketio.on("onTierListItemChanged")
def handleOnTierListItemChanged(tierListData):
    global tierList 
    tierList = tierListData
    emit("syncTierList", tierList, broadcast=True, include_self=False)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)