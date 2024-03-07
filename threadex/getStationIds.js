import fs from "fs";
import { makeRequest } from "./makeRequest.js";

const STATION_IDS_PATH = process.argv[2]
const BASE_URL_META = "https://data.rcc-acis.org/StnMeta";

// From https://simple.wikipedia.org/wiki/U.S._postal_abbreviations
// as pointed to by ACIS docs
// This value can be adjusted if you don't need all states
const stateAbbrevs = ["AK", "AL", "AR", "AZ", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "IA", "ID", "IL", "IN", "KS", "KY", "LA", "MA", "MD", "ME", "MI", "MN", "MO", "MS", "MT", "NC", "ND", "NE", "NH", "NJ", "NM", "NV", "NY", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VA", "VT", "WA", "WI", "WV", "WY", "DC", "AS", "GU", "MP", "PR", "VI", "FM", "MH", "PW", "AA", "AE", "AP"]

const main = async () => {
  const params = {
    "meta": "sids",
    "state": stateAbbrevs.join(",")
  }
  const reqBody = JSON.stringify(params)
  const sidsData = await makeRequest(BASE_URL_META, reqBody);
  
  // Filter here to ThreadEx stations, which end in " 9"
  // See: Table 1. Station Id Type Codes
  // http://www.rcc-acis.org/docs_webservices.html
  const threadExSids = { stationIds: [] }
  sidsData.meta.forEach(s => {
    threadExSids.stationIds.push(...s.sids.filter(id => id.includes(" 9")))
  })
  
  fs.writeFileSync(STATION_IDS_PATH, JSON.stringify(threadExSids));
  console.log("Wrote station ids to file!")
}

main()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
