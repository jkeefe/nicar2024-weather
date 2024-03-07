import * as fs from 'fs'
import jsonminify from 'jsonminify'

// utility functions

const loadFile = async (file) => {

    let rawdata = fs.readFileSync(file)
    const data = JSON.parse(rawdata)

    return data
}

const saveFile = async (dir, filename, data) => {

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    const path = dir + filename
    const data_string = JSON.stringify(data)

    const debug = fs.writeFileSync(path, data_string, (err) => {
        if (err) throw err;
    })

    console.log(`${filename} saved.`)

    return true

}

const makeMapURL = (warning) => {

    // skip if no geometry
    if (!warning.geometry) return null

    const geojson = {
        type: "FeatureCollection",
        features: [{ geometry: warning.geometry }]

    }

    // make the tiniset json possible, and urlencode it
    const map_data = encodeURIComponent(jsonminify(JSON.stringify(geojson)))

    const url = `https://geojson.io/#data=data:application/json,${map_data}`

    return url

}

// primary function

const main = async () => {

    // const seen = await loadFile('./data/seen.json')
    const current_warnings = await loadFile('./tmp/download.json')

    console.log('- - - - - - -\n')
    console.log(current_warnings.title)
    console.log(`Last updated: `, current_warnings.updated)

    // loop through current warnings
    console.log(`${current_warnings.features.length} warnings in file...`)

    for (let i = 0; i < current_warnings.features.length; i++) {

        const warning = current_warnings.features[i]

        // // skip if this warning is not new
        // let matches = seen.indexOf(warning.properties.id)
        // if (matches > -1) {

        //     // We have a match, so this one is not new
        //     console.log(`Warning ${i + 1} is not new. Skipping.`)
        //     continue

        // }

        console.log(`\n-+-+-+- NEW WARNING! -+-+-+-\n`)
        console.log(`${warning.properties.event}`)
        console.log(`${warning.properties.headline}`)
        console.log(`Locations/counties included: ${warning.properties.areaDesc}`)
        console.log(`Warning time: ${warning.properties.effective}`)

        // console.log(warning.properties.description)

        // const url = makeMapURL(warning)
        // if (url) {
        //     console.log(`Map url: ${url}`)
        // }

        // seen.push(warning.properties.id)

    }

    // await saveFile('./data/', 'seen.json', seen)

    console.log("\nDone!")
}


main()
    .catch((err) => {
        console.error(err)
        process.exit(1)
    })
