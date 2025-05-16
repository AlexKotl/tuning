# Tuning geeks

App that allows to fing songs in specified guitar tuning.

## Tech stack

UI: https://daisyui.com/

## Dev

If netlify cli not installed: `npm install -g netlify-cli`
`yarn dev-netlify`
This will run netlify functions + local server

## Data parser

To run parser locally:
Run dev server: `yarn dev:functions`
Follow URL: http://localhost:4001/.netlify/functions/parser

## Misc

Songsterr API :
https://www.songsterr.com/api/songs?size=10&from=10&tuning=64,59,55,50,45,40

Known parameters:

- size: number
- from: number
- pattern: string
- inst: guitar
- difficulty: 0 | 1 | 2
- tuning: 62,57,53,48,43,38

## Links

All piano notes samples: https://freesound.org/search/?f=grouping_pack%3A%222489_Piano+FF%22&s=Date+added+%28newest+first%29&g=1&page=2#sound
