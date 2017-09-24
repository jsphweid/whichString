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
    # return tf.nn.conv2d(x, W, strides=[1, 1, 1, 1], padding='SAME')
	return tf.nn.conv1d(x, W, stride=1, padding='VALID')

def max_pool_2(x):
    # return tf.nn.max_pool(x, ksize=[1, 2, 2, 1], strides=[1, 2, 2, 1], padding='SAME')
	return tf.nn.max_pool(x, ksize=[1, 2, 2, 1], strides=[1, 2, 2, 1], padding='SAME')

x_ = tf.placeholder(tf.float32, shape=[None, FFT_SIZE], name="x_")
y_ = tf.placeholder(tf.float32, shape=[None, NUM_STRINGS], name="y_")
# W = tf.Variable(tf.zeros([FFT_SIZE, NUM_STRINGS]), name="weights")
# b = tf.Variable(tf.zeros([NUM_STRINGS]), name="biases")

# original => W_conv1 = get_weight_variable([5, 5, 1, 32])
W_conv1 = get_weight_variable([5, 1, 24])

# original => b_conv1 = get_bias_variable([32])
b_conv1 = get_bias_variable([24])

# original => x_image = tf.reshape(x_, [-1, 28, 28, 1])
x_image = tf.reshape(x_, [-1, FFT_SIZE, 1])

h_conv1 = tf.nn.relu(conv1d(x_image, W_conv1) + b_conv1)
h_pool1 = max_pool_2(h_conv1)

# original => W_conv2 = get_weight_variable([5, 5, 32, 64])
W_conv2 = get_weight_variable([5, 24, 48])
b_conv2 = get_bias_variable([48])

hconv2 = tf.nn.relu(conv1d(h_pool1, W_conv2) + b_conv2)
h_pool2 = max_pool_2(hconv2)

# W_fc1 = get_weight_variable([7 * 7 * 64, 1024]) # 7 * 7 is the size of the thing after 2 pool ops, 64 is the size of last num output layers

FFT_SIZE_AFTER_TWO_1D_POOLS = (FFT_SIZE / 2) / 2

W_fc1 = get_weight_variable([FFT_SIZE_AFTER_TWO_1D_POOLS * 48, 1024])
b_fc1 = get_bias_variable([1024])

h_pool2_flat = tf.reshape(h_pool2, [-1, FFT_SIZE_AFTER_TWO_1D_POOLS * 48])
h_fc1 = tf.nn.relu(tf.matmul(h_pool2_flat, W_fc1) + b_fc1)

keep_prob = tf.placeholder(tf.float32)
h_fc1_drop = tf.nn.dropout(h_fc1, keep_prob)

# W_fc2 = get_weight_variable([1024, 10])
W_fc2 = get_weight_variable([1024, NUM_STRINGS])
# b_fc2 = get_bias_variable([10])
b_fc2 = get_bias_variable([NUM_STRINGS])

y_conv = tf.matmul(h_fc1_drop, W_fc2) + b_fc2

cross_entropy = tf.reduce_mean(
	tf.nn.softmax_cross_entropy_with_logits(labels=y_, logits=y_conv))
train_step = tf.train.AdamOptimizer(1e-4).minimize(cross_entropy)
correct_prediction = tf.equal(tf.argmax(y_conv, 1), tf.argmax(y_, 1))
accuracy = tf.reduce_mean(tf.cast(correct_prediction, tf.float32))

with tf.Session() as sess:

    sess.run(tf.global_variables_initializer())

    for i in range(10000):
        batch_xs, batch_ys = next_batch(100)
        if i % 100 == 0:
            train_accuracy = accuracy.eval(feed_dict={x_: batch_xs, y_: batch_ys, keep_prob: 1.0})
            print('step %d, training accuracy %g' % (i, train_accuracy))
        sess.run(train_step, feed_dict={x_: batch_xs, y_: batch_ys, keep_prob: 0.5})

    # print(sess.run(accuracy, feed_dict={x_: mnist.test.images, y_: mnist.test.labels, keep_prob: 1.0}))
    

