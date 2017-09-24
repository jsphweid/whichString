import tensorflow as tf

signal = tf.constant([2., 1., 0., 1., 2., 1., 0., 1., 2., 1., 0., 1., 2., 1., 0., 1., 2.])
filter = tf.constant([1., 0., 0., 3.])

signal_reshaped = tf.reshape(signal, [1, int(signal.shape[0]), 1])
filter_reshaped = tf.reshape(filter, [int(filter.shape[0]), 1, 1])

convolve = tf.nn.conv1d(signal_reshaped, filter_reshaped, stride=1, padding='VALID')

with tf.Session() as sess:
    result = sess.run(convolve)
    print('-------result', result)
    print(result.shape[1])

resized = tf.reshape(convolve, [1, int(convolve.shape[1]), 1, 1])
max_pool = tf.nn.max_pool(resized, ksize=[1, 1, 1, 1], strides=[1, 1, 2, 1], padding='SAME')
flatten = tf.reshape(max_pool, [14])

with tf.Session() as sess:
    result = sess.run(flatten)
    print('done', result)



pooling = tf.layers.max_pooling1d(convolve, 2, strides=2)

with tf.Session() as sess:
    result = sess.run(pooling)
    print('done_simple', result)

