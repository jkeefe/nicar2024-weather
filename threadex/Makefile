BOT_NAME:=threadex
STATION_ID_PATH=resources/stationIds.json

all: initialize scrape # alerts

initialize:
	echo "Run time: $$(date)"
	-mkdir data
	-mkdir tmp

scrape:
	node scrape.js ${STATION_ID_PATH}

#### --- Below are commands that are intended to run locally and manually --- ####

# @TODO - get this to write out a file
get-station-ids:
	node getStationIds.js ${STATION_ID_PATH}
	
clean:
# delete tmp and public directories for simulating initial state locally
	-rm -rf tmp
	-rm -rf data
