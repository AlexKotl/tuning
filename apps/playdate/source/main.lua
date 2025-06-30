local constants = import "constants"
local utils = import "utils"

local currentTuning = constants.tuningVariants[1].tuning


local selectedString = 1
local soundPlayer = nil

local squareSize = 30
local squareSpacing = 35
local startX = 20
local startY = 60

local selectedColor = playdate.graphics.kColorBlack
local unselectedColor = playdate.graphics.kColorWhite
local borderColor = playdate.graphics.kColorBlack

-- Constants for sound file naming (same as web app)
local SOUND_FILE_INDEX_DIFF = 8

function playStringNote()
    -- Stop any currently playing sound
    if soundPlayer then
        soundPlayer:stop()
    end

    -- Calculate the sound file index using the same logic as web app
    local actualIndex = 6 - selectedString
    local noteId = utils.stringToNoteId(currentTuning[actualIndex], actualIndex)
    local soundFileIndex = noteId - SOUND_FILE_INDEX_DIFF

    -- Format the filename with leading zeros
    local filename = string.format("sounds/piano/piano-ff-%03d.wav", soundFileIndex)

    -- Load and play the sound
    soundPlayer = playdate.sound.sampleplayer.new(filename)
    if soundPlayer then
        soundPlayer:play()
    end
end

function playdate.update()
    playdate.graphics.clear()

    playdate.graphics.drawText("Guitar Tuner", 10, 10)

    local tuningName = "Standard"
    for i, variant in ipairs(constants.tuningVariants) do
        local isMatch = true
        for j, note in ipairs(variant.tuning) do
            if note ~= currentTuning[j] then
                isMatch = false
                break
            end
        end
        if isMatch then
            tuningName = variant.title
            break
        end
    end
    playdate.graphics.drawText("Tuning: " .. tuningName, 10, 30)

    for i = 1, 6 do
        local x = startX + (i - 1) * squareSpacing
        local y = startY

        local fillColor = (i == selectedString) and selectedColor or unselectedColor

        playdate.graphics.setColor(fillColor)
        playdate.graphics.fillRect(x, y, squareSize, squareSize)

        playdate.graphics.setColor(borderColor)
        playdate.graphics.drawRect(x, y, squareSize, squareSize)

        playdate.graphics.setColor(playdate.graphics.kColorBlack)
        playdate.graphics.drawText(tostring(i), x + 10, y + 8)

        playdate.graphics.drawText(currentTuning[i], x + 8, y + 36)
    end

    playdate.graphics.drawText("A: Play note", 10, 200)
    playdate.graphics.drawText("D-pad: Navigate", 10, 215)
end

function playdate.AButtonDown()
    playStringNote()
end

function playdate.BButtonDown()

end

function playdate.leftButtonDown()
    if selectedString > 1 then
        selectedString = selectedString - 1
    end
end

function playdate.rightButtonDown()
    if selectedString < 6 then
        selectedString = selectedString + 1
    end
end

function playdate.upButtonDown()
    local currentPreset = 1
    for i, variant in ipairs(constants.tuningVariants) do
        local isMatch = true
        for j, note in ipairs(variant.tuning) do
            if note ~= currentTuning[j] then
                isMatch = false
                break
            end
        end
        if isMatch then
            currentPreset = i
            break
        end
    end

    currentPreset = currentPreset + 1
    if currentPreset > #constants.tuningVariants then
        currentPreset = 1
    end

    currentTuning = constants.tuningVariants[currentPreset].tuning
end

function playdate.downButtonDown()
    local currentPreset = 1
    for i, variant in ipairs(constants.tuningVariants) do
        local isMatch = true
        for j, note in ipairs(variant.tuning) do
            if note ~= currentTuning[j] then
                isMatch = false
                break
            end
        end
        if isMatch then
            currentPreset = i
            break
        end
    end

    currentPreset = currentPreset - 1
    if currentPreset < 1 then
        currentPreset = #constants.tuningVariants
    end

    currentTuning = constants.tuningVariants[currentPreset].tuning
end
