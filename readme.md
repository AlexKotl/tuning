# Tuning geeks

App that allows to fing songs in specified guitar tuning.

## Tech stack

UI: https://daisyui.com/

## Data parser

To run parser locally:
Run dev server: `yarn dev:functions`
Follow URL: http://localhost:8888/.netlify/functions/parser

## Misc

Songsterr API :
https://www.songsterr.com/api/songs?size=10&from=10

Known parameters:
size: number
from: number
pattern: string
inst: guitar
difficulty: 0 | 1 | 2
tuning: 62,57,53,48,43,38
