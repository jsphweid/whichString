# normalize in tensorflow
# tensor = [1., 2., 3., 4.]
# tensor = tf.div(
#    tf.subtract(
#       tensor, 
#       tf.reduce_min(tensor)
#    ), 
#    tf.subtract(
#       tf.reduce_max(tensor), 
#       tf.reduce_min(tensor)
#    )
# )

#################### Adding these two lines because tensorflow wasn't compiled on this machine (used pip install)
import os
os.environ['TF_CPP_MIN_LOG_LEVEL']='2'
####################

# from tensorflow.examples.tutorials.mnist import input_data
# mnist = input_data.read_data_sets("MNIST_data/", one_hot=True)

base_dir = '/tmp/tensorflow/whichString/v0.02__32_fft-size/'
import numpy as np

# in the future, figure out a better way of doing this shit
# https://www.tensorflow.org/programmers_guide/datasets

FFT_SIZE = 32
CONV_SIZE = 5
NUM_STRINGS = 4

import json

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
    return np.asarray(data_shuffle), np.asarray(labels_shuffle)

import tensorflow as tf 



def get_weight_variable(shape):
	initial = tf.truncated_normal(shape, stddev=0.1)
	return tf.Variable(initial)

def get_bias_variable(shape):
	initial = tf.constant(0.1, shape=shape)
	return tf.Variable(initial)

def conv1d(x, W):
	return tf.nn.conv1d(x, W, stride=1, padding='VALID')

# variables

MIDDLE_LAYER_SIZE = 256

x_ = tf.placeholder(tf.float32, shape=[None, FFT_SIZE], name="x_")
y_ = tf.placeholder(tf.float32, shape=[None, NUM_STRINGS], name="y_")
keep_prob = tf.placeholder(tf.float32)

W_conv1 = get_weight_variable([CONV_SIZE, 1, MIDDLE_LAYER_SIZE])
b_conv1 = get_bias_variable([MIDDLE_LAYER_SIZE])


x_resized = tf.reshape(x_, [-1, FFT_SIZE, 1])
conv1 = conv1d(x_resized, W_conv1)
h_conv1 = tf.nn.relu(conv1 + b_conv1)

LAYER_SIZE = (FFT_SIZE - CONV_SIZE + 1) * MIDDLE_LAYER_SIZE

W_fc = get_weight_variable([LAYER_SIZE, 4])
b_fc = get_bias_variable([4])
h_conv1_reshaped = tf.reshape(h_conv1, [-1, LAYER_SIZE])
y_conv = tf.matmul(h_conv1_reshaped, W_fc) + b_fc

y_conv_dropped = tf.nn.dropout(y_conv, keep_prob)


cross_entropy = tf.reduce_mean(tf.nn.softmax_cross_entropy_with_logits(labels=y_, logits=y_conv_dropped))
train_step = tf.train.AdamOptimizer(1e-4).minimize(cross_entropy)

correct_prediction = tf.equal(tf.argmax(y_conv_dropped, 1), tf.argmax(y_, 1))
accuracy = tf.reduce_mean(tf.cast(correct_prediction, tf.float32))

with tf.Session() as sess:

    sess.run(tf.global_variables_initializer())


    for i in range(10000):
        batch_xs, batch_ys = next_batch(100)
        feed_dict_train = {x_: batch_xs, y_: batch_ys, keep_prob: 0.5}
        feed_dict_test = {x_: batch_xs, y_: batch_ys, keep_prob: 1.0}
        if i % 100 == 0:
            train_accuracy = accuracy.eval(feed_dict=feed_dict_test)
            print('step %d, training accuracy %g' % (i, train_accuracy))
        sess.run(train_step, feed_dict=feed_dict_train)

    print(sess.run(accuracy, feed_dict=feed_dict_test))
    

