#!/bin/bash

for dir in $(ls)
do
	if [ -d $dir ]
	then
		if [ -e "$dir/package.json" ]
		then
			echo -e "\x1B[01;94m Installing npm dependencies for $dir \x1B[0m"
			cd $dir
    		npm install
    		cd ../
    	fi
    fi
done