from flask import Flask, request
app = Flask(__name__)

import json
base_dir = '/tmp/tensorflow/whichString/v0.06__1024_fft-size/'
import numpy as np

with open(base_dir + 'labels_test.json') as data:
    test_labels = json.load(data)
with open(base_dir + 'labels_training.json') as data:
    training_labels = json.load(data)
with open(base_dir + 'data_test.json') as data:
    test_data = json.load(data)
with open(base_dir + 'data_training.json') as data:
    training_data = json.load(data)

def next_batch(batch_size):
    idx = np.arange(0 , len(training_data))
    np.random.shuffle(idx)
    idx = idx[:batch_size]
    data_shuffle = [training_data[i] for i in idx]
    labels_shuffle = [training_labels[i] for i in idx]
    # return np.asarray(data_shuffle), np.asarray(labels_shuffle)
    return data_shuffle, labels_shuffle


@app.route('/')
def hello():
	batch_size = int(request.args.get('batchsize'))
	data, labels = next_batch(batch_size)
	print(len(data))
	return json.dumps({
		'data': data,
		'labels': labels
	})
