BOT_NAME:=threadex

all: initialize newdata # alerts

initialize:
	echo "Run time: $$(date)"
	-mkdir data
	-mkdir tmp

newdata:
	node scrape.js

alerts:
	# optional spot for running a script that sends slack messages
	# ... if not handled in the data processing step

#### --- Below are commands that are intended to run locally and manually --- ####

# @TODO - get this to write out a file
get-sids:
	node getSids.js
	
clean:
# delete tmp and public directories for simulating initial state locally
	-rm -rf tmp
	-rm -rf data
