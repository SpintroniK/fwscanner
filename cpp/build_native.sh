#!/bin/bash

g++ -std=c++17 -g3 -o main main.cpp `pkg-config opencv4 zbar --cflags --libs`