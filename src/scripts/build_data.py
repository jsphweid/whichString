import wave, numpy as np, math, random, os, json, hashlib, struct
from constants import BASE_PATH, BASE_PATH_WITH_DATA, BASE_PATH_WITH_RAW_DATA, SOURCE_URL, RAW_DATA_DICT
random.seed(9001)
# changes when the algorithm to process wavs change
VERSION = 1

def get_list_of_wavs_to_process():
    wavs_to_process = []
    for folder in RAW_DATA_DICT:
        files = RAW_DATA_DICT[folder]
        string = folder[0:1]
        for file in files:
            wavs_to_process.append({
                'path': os.path.join(BASE_PATH_WITH_RAW_DATA, folder, file),
                'string': string
            })
    return wavs_to_process

def get_hash_of_job():
    stringified_data = json.dumps(RAW_DATA_DICT)
    return hashlib.sha1(stringified_data.encode("UTF-8")).hexdigest()[0:5]
    
def getListFromWavFile(wavFile):
    totalFrames = wavFile.getnframes()
    wavFileBytesObject = wavFile.readframes(totalFrames)
    a = struct.unpack("%ih" % (wavFile.getnframes()* wavFile.getnchannels()), wavFileBytesObject)
    a = [float(val) / pow(2, 15) for val in a]
    return a

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

def makeChunkedUpFFTFromChunks(fft_size, chunksOfBuffers):
    ret = []
    for chunk in chunksOfBuffers:
        theFft = np.fft.fft(chunk)
        ret.append(abs(theFft)[0:fft_size])
    return ret

def getHotEncodedList(string):
    if string == 'g':
        return [1, 0, 0, 0, 0]
    elif string == 'd':
        return [0, 1, 0, 0, 0]
    elif string == 'a':
        return [0, 0, 1, 0, 0]
    elif string == 'e':
        return [0, 0, 0, 1, 0]
    elif string == 'z':
        return [0, 0, 0, 0, 1]

def process_wav_to_lines_of_data(fft_size, buffer_size, wavInfoObject):
    wavFile = wave.open(wavInfoObject["path"])
    wavFileAsIntArray = getChannelMultiplesOfBufferSize(wavFile, buffer_size)
    chunkedUp = splitListIntoChunks(wavFileAsIntArray, buffer_size)
    chunkedUpFftMags = makeChunkedUpFFTFromChunks(fft_size, chunkedUp)
    file_as_lines = []
    for fftChunk in chunkedUpFftMags:
        hotEncoded = getHotEncodedList(wavInfoObject["string"])
        file_as_lines.append([hotEncoded, fftChunk])
    return file_as_lines

def getRandomIndexArrayWithLength(len):
    ret = []
    for i in range(0, len):
        ret.append(i)
    random.shuffle(ret)
    return ret

def get_target_dir(fft_size, buffer_size):
    str_buffer_size = str(buffer_size)
    str_fft_size = str(fft_size)
    hash = get_hash_of_job()
    target_folder_name = 'buf' + str_buffer_size + '_fft' + str_fft_size + '_h' + hash + '_v' + str(VERSION)
    return target_folder_name

def maybe_build_data_from_raw_data(fft_size, training_quantity):
    buffer_size = int(fft_size * 2)
    target_folder_name = get_target_dir(fft_size, buffer_size)
    target_dir = os.path.join(BASE_PATH_WITH_DATA, target_folder_name)

    if os.path.exists(target_dir):
        print('looks like you\'ve already processed the files as ' + target_dir + ' already exists...')
        return target_folder_name

    os.makedirs(target_dir)

    all_lines_to_write = []

    for wav in get_list_of_wavs_to_process():
        all_lines_to_write.append(process_wav_to_lines_of_data(fft_size, buffer_size, wav))
    
    all_lines_to_write = [item for sublist in all_lines_to_write for item in sublist] # flatten
    random.shuffle(all_lines_to_write)
    
    all_lines_to_write_length = len(all_lines_to_write)
    
    randomIndexArray = getRandomIndexArrayWithLength(all_lines_to_write_length)

    training_len = int(all_lines_to_write_length * training_quantity)

    with open(target_dir + '/data_training.json', 'w') as file:
        training_data_tensor = []
        for i in range(0, training_len):
            line = all_lines_to_write[randomIndexArray[i]]
            training_data_tensor.append(line[1].tolist())
        json.dump(training_data_tensor, file)

    with open(target_dir + '/labels_training.json', 'w') as file:
        training_labels_tensor = []
        for i in range(0, training_len):
            line = all_lines_to_write[randomIndexArray[i]]
            training_labels_tensor.append(line[0])
        json.dump(training_labels_tensor, file)

    with open(target_dir + '/data_test.json', 'w') as file:
        test_data_tensor = []
        for i in range(training_len, all_lines_to_write_length):
            line = all_lines_to_write[randomIndexArray[i]]
            test_data_tensor.append(line[1].tolist())
        json.dump(test_data_tensor, file)


    with open(target_dir + '/labels_test.json', 'w') as file:
        test_labels_tensor = []
        for i in range(training_len, all_lines_to_write_length):
            line = all_lines_to_write[randomIndexArray[i]]
            test_labels_tensor.append(line[0])
        json.dump(test_labels_tensor, file)

    return target_folder_name