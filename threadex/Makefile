BOT_NAME:=threadex

all: initialize scrape # alerts

initialize:
	echo "Run time: $$(date)"
	-mkdir data
	-mkdir tmp

scrape:
	node scrape.js

#### --- Below are commands that are intended to run locally and manually --- ####

# @TODO - get this to write out a file
get-station-ids:
	node getStationIds.js
	
clean:
# delete tmp and public directories for simulating initial state locally
	-rm -rf tmp
	-rm -rf data
