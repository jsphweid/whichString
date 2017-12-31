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
- take out parts of the violin signal that are not actually playing or too quiet to register...
- will the web audio smoothing help?
- still memory leaking?
- need a way to take out silent parts of training data besides audacity...
- create a 'loading model' spinner and load weights on aws if not local
- adjust screen size can somehow update width of state object??
- pitchfinder types... / faster/better algorithm
- better system of points (not all in one flattened object...?)

## python dependencies
tensorflow, numpy, portaudio / pyaudio