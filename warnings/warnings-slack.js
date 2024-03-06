import * as fs from 'fs'

import { WebClient } from '@slack/web-api'
const SLACK_TOKEN = process.env.SLACK_TOKEN;
const client = new WebClient(SLACK_TOKEN);

// dayjs
import dayjs from 'dayjs';
//  in case of module not found errors, try adding .js to end of filenames below
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';

dayjs.extend(utc);
dayjs.extend(timezone);

// Globals / settings

const SLACK_CHANNEL = "C02QCS7L3EW";
const TEST_MODE = false;

const three_ticks = "```"

// utility functions

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


const weShouldSend = (warning) => {

    if (!warning) {
        return null
    }

    console.log("Determining if we should send ...")

    let triggers = []
    const trigger_phrases = ["CATASTROPHIC", "PARTICULARLY DANGEROUS SITUATION", "CONSIDERABLE"]

    // add event details to the blob
    warning.metadata = warnings.filter(d => d.event == warning.features[0].properties.event.toLowerCase())[0]

    // some warnings don't require any filters; we send them all
    if (!warning.metadata.population_filtered) {
        triggers.push(`Alert any ${warning.metadata.event}`)
    }

    // if it contains trigger-phrases
    for (const phrase of trigger_phrases) {
        if (warning.features[0].properties.description.toUpperCase().includes(phrase)) {
            console.log("Should send ... warning includes key words: ", phrase)
            triggers.push(`Threat: '${phrase}'`)
        }
    }

    // if the population exceeds the threshold
    console.log("Population: ", warning.features[0].properties.population_sum)
    if (warning.features[0].properties.population_sum && warning.features[0].properties.population_sum >= POPULATION_THRESHOLD) {
        console.log("Should send: Meets population threshold.")
        triggers.push(`Population more than ${POPULATION_THRESHOLD.toLocaleString("en-US")}`)
    } else {
        console.log("Doesn't meet population threshold.")
    }

    // if it's in NY or NJ
    if (warning.features[0].properties.areaDesc.includes("NY") || warning.features[0].properties.areaDesc.includes("NJ")) {
        console.log("Should send: NY or NJ")
        triggers.push(`Any warning in New York or New Jersey`)
    }

    // any triggers?
    if (triggers.length > 0) {
        warning.features[0].properties.nyt_trigger = triggers.join(', ')
        console.log(`All triggers: ${triggers}`)
        return warning
    }

    console.log("Nope, don't send.")
    return null

}

const downloadFile = async (url, dir, filename) => {

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    const path = dir + filename

    const options = {
        headers: {
            "User-Agent": "(nytimes.com, john.keefe@nytimes.com)",
            "accept": "application/geo+json"
        }
    }

    const response = await fetch(url, options);
    const data = JSON.stringify(await response.json())
    const debug = fs.writeFileSync(path, data, (err) => {
        if (err) throw err;
    })

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
    console.log(`${warning.properties.event}`)
    console.log(`${warning.properties.headline}`)
    console.log(`Locations/counties included: ${truncator(warning.areaDesc)}`)
    warning.slack.lines.push(`Warning time: *${dayjs(warning.properties.effective).tz('America/New_York').format('dddd, MMM D, YYYY [at] h:mm a [Eastern]')}*`)

    return true

}


const buildSlackMessage = (warning) => {

    warning.slack = {
        lines: [],
        blocks: []

    }

    warning.slack.lines.push(`:warning: *${warning.features[0].properties.event}*\n`)
    warning.slack.lines.push(`*${warning.headline}*\n`)
    warning.slack.lines.push(`Locations/counties included: *${truncator(warning.areaDesc)}*`)
    warning.slack.lines.push(`Warning time: *${dayjs(warning.effective).tz('America/New_York').format('dddd, MMM D, YYYY [at] h:mm a [Eastern]')}*`)
    warning.slack.lines.push(`See thread :thread: for details ...`)

    let blockText = ""
    warning.slack.lines.forEach((message_part) => {
        blockText += message_part + "\n"
    })

    const new_block = {
        type: 'section',
        text: {
            type: 'mrkdwn',
            text: blockText
        }
    }

    warning.slack.blocks.push(new_block)

    return warning

}


const sendSlack = async (warning) => {

    if (!warning.slack.blocks) {
        console.log("No blocks to send to slack.")
        return null
    }

    const message = {}

    message.blocks = JSON.stringify(warning.slack.blocks)
    message.channel = SLACK_CHANNEL
    message.text = warning.features[0].properties.event
    message.unfurl_links = false

    console.log('Sending message to Slack.')
    console.log(message)

    if (!SLACK_TOKEN) {
        console.log(`-----`)
        console.log(`You haven't set a SLACK_TOKEN which probably means you're running on a local machine.`)
        console.log(`To use it locally, get your Slack token and then do:`)
        console.log(`export SLACK_TOKEN=  ... followed by the token`)
        return
    }

    //// SEND TO SLACK 

    try {
        // Call the chat.postMessage method using the WebClient
        const slack_response = await client.chat.postMessage(message);

        // thread the details
        if (slack_response.ts) {

            var description

            if (warning.features[0].properties.description.length < 3000) {
                description = warning.features[0].properties.description
            } else {
                description = warning.features[0].properties.description.slice(0, 2900) + " ... [Truncated]"
            }

            // send the description as a threaded message
            const new_block = [{
                type: 'section',
                text: {
                    type: 'mrkdwn',
                    text: `${three_ticks}${description}${three_ticks}`
                }
            }]
            const threaded_message = {}
            threaded_message.thread_ts = slack_response.ts
            threaded_message.blocks = JSON.stringify(new_block)
            threaded_message.channel = SLACK_CHANNEL
            threaded_message.text = "Weather warning details"
            const slack_response_2 = await client.chat.postMessage(threaded_message);

        }

        return true
    }
    catch (error) {
        console.error(error);
        process.exit(1)
    }



}

// primary function

const main = async () => {

    // read seen file
    const seen = await loadFile('./data/seen.json')
    const current_warnings = await loadFile('./tmp/download.json')

    console.log(current_warnings)

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

        // // finalize the slack blocks if there are lines
        // if (warning.slack.lines.length > 0) {
        //     warning = buildSlackMessage(warning)
        // }

        // // if there are blocks to send, send them to slack
        // if (warning.slack.blocks.length > 0) {
        //     const slack_response = await sendSlack(warning)
        //     seen.push(warning.properties.id)
        // }

    }

    await saveFile('./data/', 'seen.json', seen)

    console.log("Done!")
}


main()
    .catch((err) => {
        console.error(err)
        process.exit(1)
    })
