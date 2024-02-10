
import json
import os

# Create a list of all the JSON files that you want to combine.
filenames = os.listdir('./json')

print(filenames)

# Create an empty list to store the Python objects.
python_objects = []

# Load each JSON file into a Python object.
for json_file in filenames:
    with open("./json/"+json_file, "r", encoding='UTF-8') as f:
        python_objects.append(json.load(f))

# Dump all the Python objects into a single JSON file.
with open("combined.json", "w+", encoding='UTF-8') as f:
    json.dump(python_objects, f, indent=4, ensure_ascii=False)