import wave
import numpy
import math
from scipy.fftpack import fft
import random
import os
import sys
import json

# from json import encoder
# encoder.FLOAT_REPR = lambda o: format(o, '.2f')

# mono files only

BUFFER_SIZE = 64
VERSION = 'v0.02'
halfBufferSize = int(BUFFER_SIZE / 2)


wavsToProcess = [
    {"path": "./../data/g_string.wav", "string": "g"},
    {"path": "./../data/d_string.wav", "string": "d"},
    {"path": "./../data/a_string.wav", "string": "a"},
    {"path": "./../data/e_string.wav", "string": "e"}
]

allLinesToWrite = []


def writeHeaders():
    headers = "string"
    for i in range(0, halfBufferSize):
        headers += ",bin" + str(i)
    allLinesToWrite.append(headers)


def getListFromWavFile(wavFile):
    totalFrames = wavFile.getnframes()
    wavFileBytesObject = wavFile.readframes(totalFrames)
    wavFile.rewind()
    wavFileAsIntArray = numpy.fromstring(wavFileBytesObject, 'Int16')
    return wavFileAsIntArray


def getChannelMultiplesOfBufferSize(wavFile, bufferSize):
    totalFrames = wavFile.getnframes()
    wavFileAsIntArray = getListFromWavFile(wavFile)

    maxNumberOfBuffersToReturn = math.floor(totalFrames / bufferSize)
    numberOfSamplesToGoThrough = maxNumberOfBuffersToReturn * bufferSize * 1  # assumes mono

    return wavFileAsIntArray[0:numberOfSamplesToGoThrough]


def chunks(l, n):
    for i in range(0, len(l), n):
        yield l[i:i + n]


def splitListIntoChunks(aList, chunkSize):
    return list(chunks(aList, chunkSize))


def makeChunkedUpFFTFromChunks(chunksOfBuffers):
    ret = []
    for chunk in chunksOfBuffers:
        theFft = fft(chunk)
        ret.append(numpy.abs(theFft)[0:halfBufferSize])
    return ret

def getHotEncodedList(string):
    if string == 'g':
        return [1, 0, 0, 0]
    elif string == 'd':
        return [0, 1, 0, 0]
    elif string == 'a':
        return [0, 0, 1, 0]
    elif string == 'e':
        return [0, 0, 0, 1]
    else:
        sys.exit('data contained string name that was no a real string name... namely => ' + string)

def processWav(wavInfoObject):
    wavFile = wave.open(wavInfoObject["path"])
    wavFileAsIntArray = getChannelMultiplesOfBufferSize(wavFile, BUFFER_SIZE)
    chunkedUp = splitListIntoChunks(wavFileAsIntArray, BUFFER_SIZE)
    chunkedUpFftMags = makeChunkedUpFFTFromChunks(chunkedUp)
    for fftChunk in chunkedUpFftMags:
        hotEncoded = getHotEncodedList(wavInfoObject["string"])
        allLinesToWrite.append([hotEncoded, fftChunk])

def getRandomIndexArrayWithLength(len):
    ret = []
    for i in range(0, len):
        ret.append(i)
    random.shuffle(ret)
    return ret

def makeItHappen():

    specificFolder = VERSION + '__' + str(int(BUFFER_SIZE / 2)) + '_fft-size/'
    baseDir = '/tmp/tensorflow/whichString/' + specificFolder

    if os.path.exists(baseDir):
        print('You probably already have these files... if you do not, you probably need to delete this folder:')
        print(baseDir)
        sys.exit()

    os.makedirs(baseDir)

    for item in wavsToProcess:
        processWav(item)
    
    random.shuffle(allLinesToWrite)

    allLinesToWrite_length = len(allLinesToWrite)
    randomIndexArray = getRandomIndexArrayWithLength(allLinesToWrite_length)

    training_size = int(allLinesToWrite_length * 0.8)

    with open(baseDir + '/data_training.json', 'w') as file:
        training_data_tensor = []
        for i in range(0, training_size):
            line = allLinesToWrite[randomIndexArray[i]]
            training_data_tensor.append(line[1].tolist()) # 1 is the fftChunk
        json.dump(training_data_tensor, file)
    

    with open(baseDir + '/labels_training.json', 'w') as file:
        training_labels_tensor = []
        for i in range(0, training_size):
            line = allLinesToWrite[randomIndexArray[i]]
            training_labels_tensor.append(line[0]) # 0 is the y hotEncoded
        json.dump(training_labels_tensor, file)

    with open(baseDir + '/data_test.json', 'w') as file:
        test_data_tensor = []
        for i in range(training_size, allLinesToWrite_length):
            line = allLinesToWrite[randomIndexArray[i]]
            test_data_tensor.append(line[1].tolist()) # 1 is the fftChunk
        json.dump(test_data_tensor, file)


    with open(baseDir + '/labels_test.json', 'w') as file:
        test_labels_tensor = []
        for i in range(training_size, allLinesToWrite_length):
            line = allLinesToWrite[randomIndexArray[i]]
            test_labels_tensor.append(line[0]) # 0 is the y hotEncoded
        json.dump(test_labels_tensor, file)


makeItHappen()