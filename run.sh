#!/bin/zsh

source ~/miniconda3/etc/profile.d/conda.sh

conda activate chromprocess-env

python ChromeFish/app.py

conda deactivate
