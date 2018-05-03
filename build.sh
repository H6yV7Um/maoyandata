#!/bin/bash
mkdir -p output
cd ./output
mkdir -p webroot
cd ./webroot
mkdir -p static
cd ./static
mkdir -p maoyandata
cp -r ../../../build/** ./maoyandata
