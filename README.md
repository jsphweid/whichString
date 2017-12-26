# Which String

### building the model
Requires these dependencies (I'd recommend making a virtualenv):
 - tensorflow
 - ?? 
`npm run build:model` This is all you really have to do. It downloads all the data files from AWS's S3 and trains the model. 

### src/tensorflow
I ran in a virtual python environment with 'virtualenv' using `source ~/tensorflow/bin/activate` (because that's where I put the virtual environment)


### todo
- probability that it is a violin at all... "I don't hear a violin..."
    - train the data again random noise / random noises / and silence
- take out parts of the violin signal that are not actually playing or too quiet to register...

## python dependencies
