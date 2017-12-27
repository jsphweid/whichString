# Which String

### building the model
Requires these dependencies (I'd recommend making a virtualenv):
 - tensorflow
 - ?? 
`npm run build:model` It downloads all the data files from AWS's S3 and trains the model. 
Once the model is trained, you'll need to port your favorite checkpoint file to deeplearnjs using this command `python ./src/python/dump_checkpoints/dump_checkpoint_vars.py --model_type=tensorflow --output_dir=localModel/ --checkpoint_file=/var/tmp/whichString/models/<your-checkpoint-file>` Please note that the checkpoint 'file' is a trio of files and you should NOT any extension on it.

### src/tensorflow
I ran in a virtual python environment with 'virtualenv' using `source ~/tensorflow/bin/activate` (because that's where I put the virtual environment)


### todo
- probability that it is a violin at all... "I don't hear a violin..."
    - train the data again random noise / random noises / and silence
- take out parts of the violin signal that are not actually playing or too quiet to register...

## python dependencies
