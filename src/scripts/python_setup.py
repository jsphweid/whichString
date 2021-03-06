from download_raw_data import make_dirs_if_not_exists, maybe_download_files
from build_data import maybe_build_data_from_raw_data
from train_model import train_model

print("making directories if they' don't already exist...")
make_dirs_if_not_exists()

print("downloading wavs if they haven't already been downloaded...")
maybe_download_files()

print("building out training and test data from the raw wav files...")
target_folder_name = maybe_build_data_from_raw_data(512, 0.8)

print("training model...")
train_model(target_folder_name)
