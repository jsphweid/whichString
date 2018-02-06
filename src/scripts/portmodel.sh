#!/bin/bash

checkpointsDir="/var/tmp/whichString/models/"

if [ -z "$(ls -A ${checkpointsDir})" ]; then
    echo "There are no models. Please run 'npm run build:model' first before you port!"
    exit 1
fi

shopt -s nullglob
checkpointFiles=(${checkpointsDir}*)
checkpointFiles=("${checkpointFiles[@]##*/}") # remove path
checkpointFiles=( $( for i in ${checkpointFiles[@]} ; do echo $i ; done | grep meta ) )
checkpointFiles=("${checkpointFiles[@]%.meta}") # remove meta

for i in "${!checkpointFiles[@]}"; do 
    printf "%s\t%s\n" "$i" "${checkpointFiles[$i]}"
done

echo "which index did you want as your model?"
while true; do
    read number
    if ! [[ $number =~ ^[0-9]+$ ]] ; then
        echo "please enter a valid selection..."
        continue
    fi
    if (( ${#checkpointFiles[number]} == 0 )) ; then
        echo "please enter a valid selection..."
        continue
    fi
    echo "You chose ${checkpointFiles[number]}"
    break
done

model=${checkpointsDir}${checkpointFiles[number]}

# -----------------------------

echo "deleting existing localModel and replacing it with your selection..."
rm -rf ./localModel
python ./src/scripts/dump_checkpoints/dump_checkpoint_vars.py --model_type=tensorflow --output_dir=localModel/ --checkpoint_file=${model}
