import { sids } from "./resources/sids.js"

const yearToCheck = "2023"
const dayToCheck = "12-25"

const BASE_URL_DATA = "https://data.rcc-acis.org/StnData";

const getParams = (sid) => {
  return {
    sid,
    "sdate": "por",
    "edate": "por",
    "meta": [
        "name",
        "state",
        "sid_dates"
    ],
    "elems": [
        {
            "name": "maxt",
            "interval": [
                0,
                0,
                1
            ],
            "duration": 1,
            "smry": {
                "reduce": "max",
                "add": "date"
            },
            "smry_only": 1,
            "groupby": "year"
        }
    ]
  }
}

async function makeRequest(url, body) {
  const response = await fetch(url, { method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  body
});
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  
  const data = await response.json();
  return data
}

const main = async () => {
  // const sids = await getSids();
  
  let maxTempRecordCount = 0
  let stationCount = 0
  const maxTempLines = []
  for (const sid of sids) {
    // request record from a single station
    console.log(`Checking ${sid}`)
    const reqBody = JSON.stringify(getParams(sid))
    const data = await makeRequest(BASE_URL_DATA, reqBody)
   
    if (!data.smry) {
      console.log(`No data found for ${sid}`)
      continue
    }
    
    // NOTE: this value sometimes comes out as "0001" when there's an
    // earlier end of the range available on ThreadEx.
    // use these values with caution
    const earliestYear = data.meta.sid_dates[0][1].split("-")[0]
    
    // see if it had a record on the day we want to check
    const dayDict = {}
    data.smry[0].forEach(recordArray => {
      const maxTempRecord = recordArray[0]
      const dateSplit = recordArray[1].split("-")
      dayDict[`${dateSplit[1]}-${dateSplit[2]}`] = {
        maxTempRecord,
        year: dateSplit[0],
        date: recordArray[1]
      }
    })
    
    if (!dayDict[dayToCheck]) {
      console.log(`No recorded data yet for ${sid} on ${yearToCheck}-${dayToCheck}`)
    } else {
      stationCount++
    }
    
    if (dayDict[dayToCheck] && dayDict[dayToCheck].year === yearToCheck) {
      maxTempRecordCount++
      const line = `${data.meta.name}, ${data.meta.state} had a max temp of ${dayDict[dayToCheck].maxTempRecord}, the highest recorded since ${earliestYear}`
      maxTempLines.push(line)
      console.log(line)
    }
  }
  
  console.log(`Found ${maxTempRecordCount} max temperature records for ${yearToCheck}-${dayToCheck} out of ${sids.length} stations checked:\n`)
  console.log(maxTempLines.join("\n"))

  return
}

main()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
