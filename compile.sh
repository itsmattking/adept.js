#!/bin/sh

# Replace with your path to Google Closure Compiler
COMPILER=~/local/bin/compiler.jar

java -jar $COMPILER --js adept.js --compilation_level ADVANCED_OPTIMIZATIONS --warning_level VERBOSE --js_output_file adept.min.js
