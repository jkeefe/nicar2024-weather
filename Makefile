SOURCE_URL:="https://api.weather.gov/alerts/active?status=actual&area=MD,DC,VA&code=TOR,FFW,EWW,BZW,HLS,HUA,HUW,TRA,TRW,TSY,TSA,TSW,SSW,NUW,RHW,SPW,VOW,CEM&limit=500"

all: clean download warnings

clean:
	-rm ./tmp/download.json

download:
	-mkdir tmp
	wget --continue --progress=dot:mega --waitretry=60 ${SOURCE_URL} \
		--header='accept: application/geo+json' \
		--header='User-Agent: (nytimes.com, john.keefe@nytimes.com)' \
		-O tmp/download.json

warnings:
	node warnings.js
