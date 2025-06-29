local NOTES = {"A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"}
-- 9 is "A" note
local FIRST_NOTE_OFFSET = 9

local STANDARD_TUNING = {64, 59, 55, 50, 45, 40}

function noteIdToString(noteId)
    return NOTES[((noteId - FIRST_NOTE_OFFSET - 1) % #NOTES) + 1]
end

-- note: string, stringNo: number
function stringToNoteId(note, stringNo)
    local closestNumber = STANDARD_TUNING[stringNo]

    -- Find note index using Lua's native approach
    local noteIndex = nil
    for i, noteName in ipairs(NOTES) do
        if noteName == note then
            noteIndex = i
            break
        end
    end

    if noteIndex then
        for i = 0, 9 do
            local variant = (noteIndex + FIRST_NOTE_OFFSET + i * 12)
            if math.abs(variant - closestNumber) <= 6 then
                return variant
            end
        end
    end
    return 0
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

-- Export the utility functions
return {
    noteIdToString = noteIdToString,
    stringToNoteId = stringToNoteId,
    getSongTuningString = getSongTuningString,
    tuningToString = tuningToString,
    NOTES = NOTES,
    STANDARD_TUNING = STANDARD_TUNING
}