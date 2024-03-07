STATION_ID_PATH=resources/stationIds.json

all: scrape

stations:
	node getStationIds.js ${STATION_ID_PATH}
	
scrape:
	node scrape.js ${STATION_ID_PATH}
