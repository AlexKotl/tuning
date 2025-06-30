local constants = import "constants"
local utils = import "utils"

local currentTuning = constants.tuningVariants[1].tuning

local selectedString = 1
local soundPlayer = nil

-- Enhanced visual parameters
local squareSize = 35  -- Slightly larger
local squareSpacing = 40  -- More spacing
local startX = 15
local startY = 70
local cornerRadius = 6  -- Rounded corners
local shadowOffset = 2  -- Shadow effect

-- Enhanced color scheme
local selectedColor = playdate.graphics.kColorBlack
local unselectedColor = playdate.graphics.kColorWhite
local borderColor = playdate.graphics.kColorBlack
local highlightColor = playdate.graphics.kColorWhite

-- Constants for sound file naming (same as web app)
local SOUND_FILE_INDEX_DIFF = 8

-- Helper function to draw rounded rectangle with shadow
function drawRoundedButton(x, y, width, height, fillColor, borderColor, isSelected)
    local shadowX = x + shadowOffset
    local shadowY = y + shadowOffset

    -- Draw shadow
    playdate.graphics.setColor(borderColor)
    playdate.graphics.fillRoundRect(shadowX, shadowY, width, height, cornerRadius)

    -- Draw main button
    playdate.graphics.setColor(fillColor)
    playdate.graphics.fillRoundRect(x, y, width, height, cornerRadius)

    -- Draw border
    playdate.graphics.setColor(borderColor)
    playdate.graphics.drawRoundRect(x, y, width, height, cornerRadius)

    -- Add highlight effect for selected button
    if isSelected then
        playdate.graphics.setColor(highlightColor)
        playdate.graphics.drawRoundRect(x + 1, y + 1, width - 2, height - 2, cornerRadius - 1)
    end
end

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

    -- Enhanced title with better positioning
    playdate.graphics.setFont(playdate.graphics.getFont())
    playdate.graphics.drawText("Guitar Tuner", 10, 15)

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
    playdate.graphics.drawText("Tuning: " .. tuningName, 10, 35)

    -- Draw enhanced string buttons
    for i = 1, 6 do
        local x = startX + (i - 1) * squareSpacing
        local y = startY

        local isSelected = (i == selectedString)
        local fillColor = isSelected and selectedColor or unselectedColor

        -- Draw the enhanced button
        drawRoundedButton(x, y, squareSize, squareSize, fillColor, borderColor, isSelected)

        -- Draw string number with better positioning
        playdate.graphics.setColor(isSelected and unselectedColor or selectedColor)
        local numberX = x + (squareSize - playdate.graphics.getTextSize(tostring(i))) / 2
        playdate.graphics.drawText(tostring(i), numberX, y + 8)

        -- Draw note name with better positioning
        local noteText = currentTuning[i]
        local noteX = x + (squareSize - playdate.graphics.getTextSize(noteText)) / 2
        playdate.graphics.drawText(noteText, noteX, y + 22)
    end

    -- Enhanced instructions with better spacing
    playdate.graphics.setColor(playdate.graphics.kColorBlack)
    playdate.graphics.drawText("A: Play note", 10, 210)
    playdate.graphics.drawText("⬅️➡️ D-pad: Navigate", 10, 225)
    playdate.graphics.drawText("⬆️⬇️ Change tuning", 10, 240)
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
