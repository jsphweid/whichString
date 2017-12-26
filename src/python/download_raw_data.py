import os
from six.moves.urllib.request import urlretrieve
from constants import BASE_PATH, BASE_PATH_WITH_RAW_DATA, SOURCE_URL, RAW_DATA_DICT

def make_dirs_if_not_exists():
    base_dirs = [BASE_PATH, BASE_PATH_WITH_RAW_DATA]
    string_dirs = [os.path.join(BASE_PATH_WITH_RAW_DATA, folder_name) for folder_name in RAW_DATA_DICT]
    all_dirs = base_dirs + string_dirs
    for directory in all_dirs:
        if not os.path.exists(directory):
            os.mkdir(directory)

def maybe_download_files():
    for folder_name in RAW_DATA_DICT:
        some_wavs_that_should_exist = RAW_DATA_DICT[folder_name]
        for wav in some_wavs_that_should_exist:
            file_path = os.path.join(BASE_PATH_WITH_RAW_DATA, folder_name, wav)
            if not os.path.isfile(file_path):
                file_url = os.path.join(SOURCE_URL, folder_name, wav)
                new_file_path, _ = urlretrieve(file_url, file_path)
                statinfo = os.stat(new_file_path)
                print('successfully downloaded', file_path, statinfo.st_size, 'bytes.')
