# NICAR 2024 Cheat Sheet: Historical Weather Data
_March 7, 2024 | John Keefe + Bea Malsky_

## United States only

#### When you need to find a historical baseline for normal weather

📍 [U.S. Climate Normals](https://www.ncei.noaa.gov/products/land-based-station/us-climate-normals)

>The U.S. Climate Normals are a large suite of data products that provide information about typical climate conditions for thousands of locations across the United States. Normals act both as a ruler to compare today’s weather and tomorrow’s forecast, and as a predictor of conditions in the near future. The official normals are calculated for a uniform 30 year period, and consist of annual/seasonal, monthly, daily, and hourly averages and statistics of temperature, precipitation, and other climatological variables from almost 15,000 U.S. weather stations.

Example of this data set in use ([link](https://www.nytimes.com/interactive/2023/12/22/us/christmas-snow-weather-forecast.html)): 

![CleanShot 2024-03-06 at 20 56 40@2x](https://github.com/jkeefe/nicar2024-weather/assets/1094243/db81bf29-2f54-4093-ba67-5b22aacd5940)

#### …and you want to compare that to current precipitation

📍 [Advanced Hydrologic Prediction Service (AHPS) Precipitation Analysis](https://water.weather.gov/precip/)

A NOAA product with observed precipitation estimates (for the last 1 day up to a year back) that also includes departures from normal and percent of normal.

![CleanShot 2024-03-06 at 20 57 27@2x](https://github.com/jkeefe/nicar2024-weather/assets/1094243/8938aad0-ae53-4027-9c3f-5c48c020be09)

Example of this data set in use ([link](https://www.nytimes.com/interactive/2024/uri/embeddedinteractive/b167f5e0-6c8b-561f-b878-7970bbcfd9bd)):

![CleanShot 2024-03-06 at 20 58 07@2x](https://github.com/jkeefe/nicar2024-weather/assets/1094243/4418c2ed-2aae-484e-922d-d97c4e2a6b90)

#### When you need to find state-level records

📍 [State Climate Extremes Committee Climate Monitoring](https://www.ncei.noaa.gov/access/monitoring/scec/)

> The SCEC tracks 5 core climatological elements for every state (Maximum Temperature, Minimum Temperature, 24-Hour Precipitation, Monthly Snowfall, Snow Depth).

#### When you need to check if your weather forecast office (WFO) reported a record

📍  Check the WFO page for your location office. For example, here’s Baltimore’s: https://www.weather.gov/lwx/ObservedWeatherMaps

Also: https://www.weather.gov/wrh/Climate?wfo=lwx

NWS Twitter accounts are also often quite useful!

#### When you want to check the long-term records of a particular location, threaded over time

📍 [ThreadEx: Long-Term Station Extremes for America](https://threadex.rcc-acis.org/)

>ThreadEx is a project designed to address the fragmentation of station information over time due to station relocations for the express purpose of calculating daily extremes of temperature and precipitation. There are often changes in the siting of instrumentation for any given National Weather Service/Weather Bureau location over the observational history in a given city/region. As a result, obtaining a long time series (i.e., one hundred years or more) for computation of extremes is difficult, unless records from the various locations are "threaded" or put together. This has been done, but different approaches and combinations of stations have resulted in confusion among data users and the general public about what constitutes an official daily extreme record.

Note that records recorded by WFOs and as noted by ThreadEx don’t always line up, because ThreadEx is bringing together records from multiple nearby locations.

#### When you need to know whether or not there’s a daily temperature record in the forecast

📍 [NDFD Forecast Records](https://www.wpc.ncep.noaa.gov/exper/ndfd/ndfd.html)

A prototype product using [ThreadEx](https://threadex.rcc-acis.org/) and the [National Digital Forecast Database (NDFD) grids](https://digital.weather.gov/) to show if there’s a record maximum or minimum temperature (high or low) in the daily forecast for the upcoming week. 

Handy period of record by station lookup: https://www.wpc.ncep.noaa.gov/exper/ndfd/inv.all.txt

Example of a story using that hi min parameter ([link](https://www.nytimes.com/2021/07/09/upshot/record-breaking-hot-weather-at-night-deaths.html)):

![CleanShot 2024-03-06 at 21 13 27@2x](https://github.com/jkeefe/nicar2024-weather/assets/1094243/472280af-4bf2-4b05-bba0-31790c17c0ae)

#### When you need an archive of National Weather Service watches, warnings, and advisories

📍 [Iowa State University NWS Warning Search](https://mesonet.agron.iastate.edu/vtec/search.php)

Archive back to 2005 and includes polygons. You can search by county or by point.

The Iowa State Mesonet has a variety of other useful data projects: https://mesonet.agron.iastate.edu/request/download.phtml?network=FR__ASOS

## International

#### When you need historical *daily* observations

📍 [Global Historical Climatology Network Daily Summaries (GHCN-Daily)](https://www.ncei.noaa.gov/access/search/data-search/daily-summaries)

> The Global Historical Climatology Network - Daily (GHCN-Daily) dataset integrates daily climate observations from approximately 30 different data sources. [...] Version 3 contains station-based measurements from well over 90,000 land-based stations worldwide, about two thirds of which are for precipitation measurement only. Other meteorological elements include, but are not limited to, daily maximum and minimum temperature, temperature at the time of observation, snowfall and snow depth.

#### When you need historical *hourly* observations

📍 [Global Historical Climatology Network Hourly Summaries (GHCNh)](https://www.ncei.noaa.gov/access/search/data-search/global-historical-climatology-network-hourly)

>Global Historical Climatology Network-hourly (GHCNh) is a multisource collection of weather station (meteorological) observations from the late 18th Century to the present from fixed weather stations over land across the globe.

Also worth looking through other NOAA National Centers for Environmental Information (NCEI) datasets: https://www.ncei.noaa.gov/access/search/dataset-search

#### When you need records from airport sensors

📍 [Iowa Environmental Mesonet](https://mesonet.agron.iastate.edu/request/download.phtml?network=FR__ASOS)

> The IEM maintains an ever growing archive of automated airport weather observations from around the world! 

#### When you need to access climate data programatically 

📍 [Applied Climate Information System](http://www.rcc-acis.org/index.html)

Docs: http://www.rcc-acis.org/docs_webservices.html
