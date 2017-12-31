import pyaudio

FFT_SIZE = 512
FORMAT = pyaudio.paFloat32
CHANNELS = 1
SAMPLE_RATE = 44100
BUFFER_SIZE = FFT_SIZE * 2
RECORD_SECONDS = 0.5

import aubio
pDetection = aubio.pitch("default", BUFFER_SIZE, BUFFER_SIZE, SAMPLE_RATE)
pDetection.set_unit("Hz")
pDetection.set_silence(-40)

import tensorflow as tf
import numpy, time
from train_model import one_inference

sess = tf.Session()
sess.run(tf.global_variables_initializer())
saver = tf.train.Saver()
saver.restore(sess, "/Users/josephweidinger/Downloads/a-0.95351_buf1024_fft512_h350b3_v1")
 
audio = pyaudio.PyAudio()

def callback(in_data, frame_count, time_info, status):
    decoded_signal_buffer = numpy.fromstring(in_data, aubio.float_type)
    samples = numpy.fromstring(in_data, dtype=aubio.float_type)
    input_fft = abs(numpy.fft.fft(decoded_signal_buffer))[0:FFT_SIZE]

    # print('input_fft', input_fft)
    feed_dict = { "x_:0": [input_fft], "keep_prob:0": 1.0 }
    guess = sess.run(one_inference, feed_dict=feed_dict)
    print(guess, pDetection(samples)[0])

    return (in_data, pyaudio.paContinue)

stream = audio.open(format=FORMAT, channels=CHANNELS, rate=SAMPLE_RATE, input=True, stream_callback=callback)

stream.start_stream()

while stream.is_active():
    time.sleep(90)
    stream.stop_stream()

sess.close()
stream.close()
audio.terminate()
    