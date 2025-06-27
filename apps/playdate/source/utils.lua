local NOTES = {"A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"}
-- 9 is "A" note
local FIRST_NOTE_OFFSET = 9

local STANDARD_TUNING = {64, 59, 55, 50, 45, 40}

function noteIdToString(noteId)
    return NOTES[((noteId - FIRST_NOTE_OFFSET - 1) % #NOTES) + 1]
end

function stringToNoteId(note, stringNo)
    local closestNumber = STANDARD_TUNING[stringNo + 1]
    for i = 0, 9 do
        local variant = (NOTES.indexOf(note) + FIRST_NOTE_OFFSET + i * 12)
        if math.abs(variant - closestNumber) <= 6 then
            return variant
        end
    end
    return 0
end

function getSongExternalUrl(sonsterrSongId)
    return "https://www.songsterr.com/a/wsa/SONG-tab-s" .. sonsterrSongId
end

function getSongTuningString(song)
    local tuningString = ""
    for index = 6, 1, -1 do
        local key = "string" .. index .. "TuningId"
        if song[key] then
            tuningString = tuningString .. noteIdToString(song[key])
        end
    end
    return tuningString
end

function tuningToString(tuning)
    local reversed = {}
    for i = #tuning, 1, -1 do
        table.insert(reversed, tuning[i])
    end
    return table.concat(reversed, "")
end

-- Helper function to find index of element in table
function table.indexOf(tbl, value)
    for i, v in ipairs(tbl) do
        if v == value then
            return i
        end
    end
    return nil
end

-- Add indexOf method to NOTES table
NOTES.indexOf = function(self, value)
    return table.indexOf(self, value)
end

-- Export the utility functions
return {
    noteIdToString = noteIdToString,
    stringToNoteId = stringToNoteId,
    getSongExternalUrl = getSongExternalUrl,
    getSongTuningString = getSongTuningString,
    tuningToString = tuningToString,
    NOTES = NOTES,
    STANDARD_TUNING = STANDARD_TUNING
}