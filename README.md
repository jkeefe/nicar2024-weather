# nicar2024-weather

## Overview

- A bit about us and the NYT Weather Data Team
- Monitoring real-time warnings
- Finding and using historical data

## Monitoring Real Time Warnings

### The Weather Service API 

  - Documentation: https://www.weather.gov/documentation/services-web-api
  - Click on "Specification"
  - Building a URL:
    - Base endpoint: `https://api.weather.gov/alerts/active`
    - We want actual warnings, not tests: `?status=actual`
    - Area? Let's say Maryland, Virginia and D.C. You can get fancier here, but states are easy: `&area=MD,DC,VA`
    - Code. This is the warning type. Tornado warning, tornado watch, etc. List is [here](https://www.weather.gov/nwr/eventcodes).
    - Limit. `&limit=500`

    - 
  - But what about monitoring it ... for free!

### The Bot Tooling We Use

- Github Actions
- Makefiles
- Slack

### Setup for this class

1. Sign into Github (or quickly make an account if you haven't already)
1. Go to **[github.com/jkeefe/nicar2024-weather](git@github.com:jkeefe/nicar2024-weather.git)**
1. Chose the "Fork" button
1. Note that the **owner** is now **you**. Click "Create fork"
1. After a minute, you will have a new screen. Note that your name is up at the top! This is your copy. You can use this now or just watch and return to it later. (If you see **jkeefe** instead of your name, you're on the wrong screen. Go find your copy in your github account.)
1. Now click the green "<> Code" button and, after you do, the "Codespaces" tab under it.
1. Click "Create Codespace on Main"

#### Take a look around!

- File list on the left side
- Coding happens in the big window
- There's a terminal window at the bottom.

#### How to save your work

This is an ephemperal instance! The instance will live in your account for a few days, but unless you take active steps, it will disappear. Which is good! You need to actively save your code back to the repo to make sure you have it.

- Save all of the files you want to commit to your code
- Maybe even close them to make sure!
- Click the github source-control button
- Enter a commit message, like "edited readme"
- Use the blue dropdown arrow
- Pick "Commit & Sync"
- You will be warned that there are no changes staged, and do you want to stage and all of your changes. Say "Yes" 

#### When you're done for the day

Running computers cost money. You get 60 hours free every month and 15 gigabytes of storage. But let's not waste those free hours.

- Go to (github.com/codespaces)[https://github.com/codespaces]
- Pick the three dots next to the Active codespace.
- Chose "Stop codespace"
- If you forget, don't worry: It'll shut down automatically after 30 minutes. But why waste that?
- Go back to the main tab, and you'll see it's gone
- Can restart

### Weather Warnings Code

- Look at the Makefile
- Open the Terminal
- `cd warnings`
- `make clean`
- `make download`




### Historical Data



- Details: https://www.weather.gov/documentation/services-web-api#/default/alerts_active


No authentication

Source for the "code" parameter: https://www.weather.gov/nwr/eventcodes

Request url: https://api.weather.gov/alerts/active?status=actual&message_type=alert&code=TOR&limit=500

Tornado watches: https://api.weather.gov/alerts/active?status=actual&message_type=alert&code=TOA&limit=500

```bash
curl -X GET "https://api.weather.gov/alerts/active?status=actual&message_type=alert&code=TOR&limit=500" -H "accept: application/geo+json"
```