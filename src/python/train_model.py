import numpy as np
import json
import tensorflow as tf
import os
from constants import BASE_PATH, BASE_PATH_WITH_DATA

FFT_SIZE = 512
CONV_SIZE = 5
NUM_LABELS = 5
POOLING_SIZE = 2

def next_batch(data, batch_size):
    idx = np.arange(0 , len(data["training_data"]))
    np.random.shuffle(idx)
    idx = idx[:batch_size]
    data_shuffle = [data["training_data"][i] for i in idx]
    labels_shuffle = [data["training_labels"][i] for i in idx]
    return np.asarray(data_shuffle), np.asarray(labels_shuffle)

def weight_variable(shape, name=None):
    initial = tf.truncated_normal(shape, stddev=0.1)
    if name != None:
        return tf.Variable(initial, name=name)
    else:
        return tf.Variable(initial)

def bias_variable(shape, name=None):
    initial = tf.constant(0.1, shape=shape)
    if name != None:
        return tf.Variable(initial, name=name)
    else:
        return tf.Variable(initial)

def conv1d(x, W):
  return tf.nn.conv1d(x, W, stride=1, padding='VALID')

def max_pool(x):
  return tf.nn.pool(x, window_shape=[POOLING_SIZE], strides=[POOLING_SIZE], pooling_type="MAX", padding='VALID')

x_ = tf.placeholder(tf.float32, shape=[None, FFT_SIZE], name="x_")
y_ = tf.placeholder(tf.float32, shape=[None, NUM_LABELS], name="y_")
keep_prob = tf.placeholder(tf.float32)

x_reshaped = tf.reshape(x_, [-1, FFT_SIZE, 1])

######## FIRST CONVOLUTIONAL / POOLING LAYER
FIRST_LAYER_SIZE = 32
W_conv1 = weight_variable([CONV_SIZE, 1, FIRST_LAYER_SIZE], 'weight-conv1')
b_conv1 = bias_variable([FIRST_LAYER_SIZE], 'bias-conv1')
h_conv1 = tf.nn.relu(conv1d(x_reshaped, W_conv1) + b_conv1)
h_pool1 = max_pool(h_conv1)

SIZE_AFTER_FIRST = int((FFT_SIZE - CONV_SIZE + 1) / POOLING_SIZE) # where does the 2 come from

######## SECOND CONVOLUTIONAL / POOLING LAYER
SECOND_LAYER_SIZE = 64
W_conv2 = weight_variable([CONV_SIZE, FIRST_LAYER_SIZE, SECOND_LAYER_SIZE], 'weight-conv2')
b_conv2 = bias_variable([SECOND_LAYER_SIZE], 'bias-conv2')
h_conv2 = tf.nn.relu(conv1d(h_pool1, W_conv2) + b_conv2)
h_pool2 = max_pool(h_conv2)

SIZE_AFTER_SECOND = int((SIZE_AFTER_FIRST - CONV_SIZE + 1) / POOLING_SIZE)
COMBINED_SIZE = SIZE_AFTER_SECOND * SECOND_LAYER_SIZE

######## FULLY CONNECTED LAYER
FULLY_CONNECTED_SIZE = 1024
W_fc1 = weight_variable([COMBINED_SIZE, FULLY_CONNECTED_SIZE], 'weight-fully-connected1')
b_fc1 = bias_variable([FULLY_CONNECTED_SIZE], 'bias-fully-connected1')
h_pool2_flat = tf.reshape(h_pool2, [-1, COMBINED_SIZE])
h_fc1 = tf.nn.relu(tf.matmul(h_pool2_flat, W_fc1) + b_fc1)

######## DROPOUT LAYER
keep_prob = tf.placeholder(tf.float32)
h_fc1_drop = tf.nn.dropout(h_fc1, keep_prob)

######## READOUT LAYER
W_fc2 = weight_variable([FULLY_CONNECTED_SIZE, NUM_LABELS], 'weight-fully-connected2')
b_fc2 = bias_variable([NUM_LABELS], 'bias-fully-connected2')

y_conv = tf.matmul(h_fc1_drop, W_fc2) + b_fc2

cross_entropy = tf.reduce_mean(
    tf.nn.softmax_cross_entropy_with_logits(labels=y_, logits=y_conv))
train_step = tf.train.AdamOptimizer(1e-4).minimize(cross_entropy)
correct_prediction = tf.equal(tf.argmax(y_conv, 1), tf.argmax(y_, 1))
accuracy = tf.reduce_mean(tf.cast(correct_prediction, tf.float32))

def train_model(target_folder_name):

    data_folder = os.path.join(BASE_PATH_WITH_DATA, target_folder_name)

    # load training / test data into memory
    with open(data_folder + '/labels_test.json') as data:
        test_labels = json.load(data)
    with open(data_folder + '/labels_training.json') as data:
        training_labels = json.load(data)
    with open(data_folder + '/data_test.json') as data:
        test_data = json.load(data)
    with open(data_folder + '/data_training.json') as data:
        training_data = json.load(data)
    training_obj = {
        "training_labels": training_labels,
        "training_data": training_data
    }

    with tf.Session() as sess:

        saver = tf.train.Saver()
        sess.run(tf.global_variables_initializer())

        highest_accuracy = 0

        for i in range(10000):
            batch_xs, batch_ys = next_batch(training_obj, 50)
            feed_dict_train = { x_: batch_xs, y_: batch_ys, keep_prob: 0.5 }
            sess.run(train_step, feed_dict=feed_dict_train)

            if i % 100 == 0:
                # check accuracy and display status
                feed_dict_test = { x_: test_data, y_: test_labels, keep_prob: 1.0 }
                train_accuracy = accuracy.eval(feed_dict=feed_dict_test)
                print('step %d, training accuracy %g' % (i, train_accuracy))

                # write checkpoint if it breaks previous accuracy record
                if train_accuracy > highest_accuracy:
                    highest_accuracy = train_accuracy
                    print('new highest accuracy... saving checkpoint...')
                    final_filename = 'a-' + str(train_accuracy) + '_' + target_folder_name
                    checkpoint_file = os.path.join(BASE_PATH, 'models', final_filename)
                    saver.save(sess, checkpoint_file)
        

        print(sess.run(accuracy, feed_dict=feed_dict_test))
    

