import uuid 
from os import path, listdir

directory = path.join("./", "static")
tierListArray = [
    {
        "id": str(uuid.uuid4()), 
        "image": "./static/{filename}".format(filename = filename) 
    } for filename in listdir(directory) 
]
print(tierListArray)