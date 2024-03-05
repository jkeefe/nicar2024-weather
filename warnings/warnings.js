import * as fs from 'fs'

// dayjs
import dayjs from 'dayjs';
//  in case of module not found errors, try adding .js to end of filenames below
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';

dayjs.extend(utc);
dayjs.extend(timezone);

// Globals / settings

const truncator = (text) => {

    if (text.length < 200) return text

    return text.substring(0, 200) + "... [truncated]"

}


// core functions


const warningIsNew = (current, seen) => {

    // determine whether we've seen current warning ...
    // specifically, does this warning's id exist in 
    // the set of previous warning ids
    let matches = seen.indexOf(current.properties.id)

    if (matches > -1) {

        // We have a match, so this one is not new
        return false

    } else {

        // no match, this is new!
        return true

    }


}

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

const outputTheWarning = (warning) => {

    console.log(`NEW WARNING!`)
    console.log(`${warning.features[0].properties.event}`)
    console.log(`${warning.headline}`)
    console.log(`Locations/counties included: ${truncator(warning.areaDesc)}`)
    warning.slack.lines.push(`Warning time: *${dayjs(warning.effective).tz('America/New_York').format('dddd, MMM D, YYYY [at] h:mm a [Eastern]')}*`)

    return true

}

// primary function

const main = async () => {

    // read seen file
    const seen = await loadFile('./data/seen.json')
    const current_warnings = await loadFile('./tmp/download.json')

    console.log(current_warnings.title)
    console.log(`Last updated: `, current_warnings.updated)

    // loop through current warnings
    console.log(`${current_warnings.features.length} warnings in file...`)

    // loop through the latest warning file from the
    for (let i = 0; i < current_warnings.features.length; i++) {

        const warning = current_warnings.features[i]

        // skip if this warning is not new
        if (!warningIsNew(warning, seen)) {
            console.log(`Warning ${i + 1} not new. Skipping.`)
            continue
        }

        // here's where you could test if warnings meet other conditions you might have
        // and "continue" if not met

        outputTheWarning(warning)

    }

    await saveFile('./data/', 'seen.json', seen)

    console.log("Done!")
}


main()
    .catch((err) => {
        console.error(err)
        process.exit(1)
    })
