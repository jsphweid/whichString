import tensorflow as tf

# two images each is a 3x3
one_img = [1., 2., 3., 4., 5., 6., 7., 8., 9.]
two_img = [2., 3., 4., 5., 6., 7., 8., 9., 10.]

two_imgs = [one_img, two_img]

# organized as an image
reshape_1 = tf.reshape(two_imgs, [2, 3, 3])

# organized as an image
reshape_2 = tf.reshape(two_imgs, [2, 3, 3, 1])

with tf.Session() as sess:
    # I expect the shape to be [2, 9]
    print('shape flattened', sess.run(tf.shape(two_imgs)))

    # I expect the shape to be [2, 3, 3]
    print('shape like an image', sess.run(reshape_1))
    print('and the shape', sess.run(tf.shape(reshape_1)))

    # I expect the shape to be [2, 3, 3, 1]
    print('shape like an image with color channel', sess.run(reshape_2))
    print('and the shape...', sess.run(tf.shape(reshape_2)))