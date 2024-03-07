const BASE_URL_META = "https://data.rcc-acis.org/StnMeta";

// from https://simple.wikipedia.org/wiki/U.S._postal_abbreviations
// as pointed to by ACIS docs
const stateAbbrevs = ["AK", "AL", "AR", "AZ", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "IA", "ID", "IL", "IN", "KS", "KY", "LA", "MA", "MD", "ME", "MI", "MN", "MO", "MS", "MT", "NC", "ND", "NE", "NH", "NJ", "NM", "NV", "NY", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VA", "VT", "WA", "WI", "WV", "WY", "DC", "AS", "GU", "MP", "PR", "VI", "FM", "MH", "PW", "AA", "AE", "AP"]

const getSids = async () => {
  // !! optional exercise: 
  // adjust which states we're pulling from for station ids
  const params = {
    "meta": "sids",
    "state": stateAbbrevs.join(",")
  }
  const reqBody = JSON.stringify(params)
  const sidsData = await makeRequest(BASE_URL_META, reqBody);
  
  const threadExSids = []
  // @TODO: why are we filtering this out? I think these 
  // are the threadex stations, but make sure
  sidsData.meta.forEach(s => {
    threadExSids.push(...s.sids.filter(id => id.includes(" 9")))
  })
  return sidsResponse
}
