from flask import Flask, request, jsonify
from flask_cors import CORS
app = Flask(__name__)
CORS(app)

import json, numpy as np, os
from download_raw_data import make_dirs_if_not_exists, maybe_download_files
from build_data import maybe_build_data_from_raw_data, get_target_dir
from constants import BASE_PATH_WITH_RAW_DATA


def reform_tensor_for_deeplearnjs(arr):
    newArr = []
    arrLen = len(arr[0])
    for item in arr:
        array1d = {
            'data': {
                'values': item
            },
            'shape': [arrLen],
            'size': arrLen
        }
        newArr.append(array1d)
    return newArr


print("making directories if they' don't already exist...")
make_dirs_if_not_exists()
print("downloading wavs if they haven't already been downloaded...")
maybe_download_files()
print("building out training and test data from the raw wav files...")
maybe_build_data_from_raw_data(2048, 0.8)
print("setting target directory...")
target_dir = get_target_dir(2048)
print("opening files")
with open(os.path.join(target_dir, 'labels_test.json')) as data:
    test_labels = reform_tensor_for_deeplearnjs(json.load(data))
with open(os.path.join(target_dir, 'labels_training.json')) as data:
    training_labels = reform_tensor_for_deeplearnjs(json.load(data))
with open(os.path.join(target_dir, 'data_test.json')) as data:
    test_data = reform_tensor_for_deeplearnjs(json.load(data))
with open(os.path.join(target_dir, 'data_training.json')) as data:
    training_data = reform_tensor_for_deeplearnjs(json.load(data))

def next_batch(batch_size):
    idx = np.arange(0 , len(training_data))
    np.random.shuffle(idx)
    idx = idx[:batch_size]
    data_shuffle = [training_data[i] for i in idx]
    labels_shuffle = [training_labels[i] for i in idx]
    # return np.asarray(data_shuffle), np.asarray(labels_shuffle)
    return data_shuffle, labels_shuffle


@app.route('/', methods=['GET'])
def hello():
    batch_size = int(request.args.get('batchsize'))
    data, labels = next_batch(batch_size)
    return jsonify({
        'inputs': data,
        'labels': labels
    })

@app.route('/getAllData', methods=['GET'])
def getAllTrainingData():
    data_type = request.args.get('type')
    if data_type == 'TRAINING':
        data = { 'inputs': training_data, 'labels': training_labels }
    elif data_type == 'TEST':
        data = { 'inputs': test_data, 'labels': test_labels }

    
    return jsonify(data)
