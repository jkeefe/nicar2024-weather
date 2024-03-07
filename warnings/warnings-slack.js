import * as fs from 'fs'
import jsonminify from 'jsonminify'

// set up slack
import { WebClient } from '@slack/web-api'
const SLACK_TOKEN = process.env.SLACK_TOKEN;
const client = new WebClient(SLACK_TOKEN);
const SLACK_CHANNEL = "C17MR46KU";
const three_ticks = "```";


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

const truncator = (text) => {
    if (text.length < 200) return text
    return text.substring(0, 200) + "... [truncated]"
}


const buildSlackMessage = (warning) => {

    warning.slack = {
        lines: [],
        blocks: []

    }

    warning.slack.lines.push(`:warning: *${warning.properties.event}*\n`)
    warning.slack.lines.push(`*${warning.properties.headline}*\n`)
    warning.slack.lines.push(`Locations/counties included: *${truncator(warning.properties.areaDesc)}*`)

    if (warning.map_url) {
        warning.slack.lines.push(`View warning <${warning.map_url}|on a map>`)
    }

    warning.slack.lines.push(`Warning time: *${warning.properties.effective}*`)
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
    message.text = warning.properties.event
    message.unfurl_links = false

    console.log('Sending message to Slack.')
    console.log(message)

    if (!SLACK_TOKEN) {
        console.log(`-----`)
        console.log(`You haven't set a SLACK_TOKEN which probably means you're running on a local machine.`)
        console.log(`To use it locally, get your Slack bot token and then do:`)
        console.log(`export SLACK_TOKEN=  ... followed by the token`)
        console.log(`-----`)
        return
    }

    //// SEND TO SLACK 

    try {
        // Call the chat.postMessage method using the WebClient
        const slack_response = await client.chat.postMessage(message);

        // thread the details
        if (slack_response.ts) {

            var description

            if (warning.properties.description.length < 3000) {
                description = warning.properties.description
            } else {
                description = warning.properties.description.slice(0, 2900) + " ... [Truncated]"
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

    console.log('- - - - - - -\n')
    console.log(current_warnings.title)
    console.log(`Last updated: `, current_warnings.updated)

    // loop through current warnings
    console.log(`${current_warnings.features.length} warnings in file...`)

    for (let i = 0; i < current_warnings.features.length; i++) {

        const warning = current_warnings.features[i]

        // skip if this warning is not new
        let matches = seen.indexOf(warning.properties.id)
        if (matches > -1) {

            // We have a match, so this one is not new
            console.log(`Warning ${i + 1} is not new. Skipping.`)
            continue

        }

        console.log(`\n-+-+-+- NEW WARNING! -+-+-+-\n`)
        console.log(`${warning.properties.event}`)
        console.log(`${warning.properties.headline}`)
        console.log(`Locations/counties included: ${warning.properties.areaDesc}`)
        console.log(`\nWarning time: ${warning.properties.effective}`)

        warning.map_url = makeMapURL(warning)
        if (warning.url) {
            console.log(`Map url: ${url}`)
        }

        const message = buildSlackMessage(warning)

        // if there are blocks to send, send them to slack
        if (message.slack.blocks.length > 0) {
            const slack_response = await sendSlack(message)
            seen.push(warning.properties.id)
        }

    }

    await saveFile('./data/', 'seen.json', seen)

    console.log("Done!")
}


main()
    .catch((err) => {
        console.error(err)
        process.exit(1)
    })
