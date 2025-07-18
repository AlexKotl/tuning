local constants = import "constants"
local utils = import "utils"

local gfx = playdate.graphics

local currentTuning = constants.tuningVariants[1].tuning

local selectedString = 6
local soundPlayer = nil

-- Enhanced visual parameters
local squareSize = 35  -- Slightly larger
local squareSpacing = 40  -- More spacing
local startX = 15
local startY = 70
local cornerRadius = 6  -- Rounded corners
local shadowOffset = 2  -- Shadow effect

-- Enhanced color scheme
local selectedColor = gfx.kColorBlack
local unselectedColor = gfx.kColorWhite
local borderColor = gfx.kColorBlack
local highlightColor = gfx.kColorWhite

-- Constants for sound file naming (same as web app)
local SOUND_FILE_INDEX_DIFF = 9

-- Helper function to draw rounded rectangle with shadow
function drawRoundedButton(x, y, width, height, fillColor, borderColor, isSelected)
    local shadowX = x + shadowOffset
    local shadowY = y + shadowOffset

    -- Draw shadow
    gfx.setColor(borderColor)
    gfx.fillRoundRect(shadowX, shadowY, width, height, cornerRadius)

    -- Draw main button
    gfx.setColor(fillColor)
    gfx.fillRoundRect(x, y, width, height, cornerRadius)

    -- Draw border
    gfx.setColor(borderColor)
    gfx.drawRoundRect(x, y, width, height, cornerRadius)

    -- Add highlight effect for selected button
    if isSelected then
        gfx.setColor(highlightColor)
        gfx.drawRoundRect(x + 1, y + 1, width - 2, height - 2, cornerRadius - 1)
    end
end

function playStringNote()
    if soundPlayer then
        soundPlayer:stop()
    end

    -- Calculate the sound file index
    local noteId = utils.stringToNoteId(currentTuning[selectedString], selectedString)
    local soundFileIndex = noteId - SOUND_FILE_INDEX_DIFF
    local filename = string.format("sounds/piano/piano-ff-%03d.wav", soundFileIndex)

    -- Load and play the sound
    soundPlayer = playdate.sound.sampleplayer.new(filename)
    if soundPlayer then
        soundPlayer:play()
    end
end

function playdate.update()
    gfx.clear()

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
    gfx.drawText("Tuning: " .. tuningName, 10, 35)

    -- Draw enhanced string buttons
    for i = 1, 6 do
        gfx.setLineWidth(1)
        local x = startX + (6-i) * squareSpacing

        local isSelected = (i == selectedString)
        local fillColor = isSelected and selectedColor or unselectedColor

        -- Draw the enhanced button
        drawRoundedButton(x, startY + 22, squareSize, squareSize, fillColor, borderColor, isSelected)

        gfx.setLineWidth(i+1)
        gfx.drawLine(x + 16, startY + 22 + 50, x + 16, startY + 22 + 100)

        -- Draw string number with better positioning
        local numberX = x + (squareSize - gfx.getTextSize(tostring(i))) / 2
        gfx.drawText(tostring(i), numberX, startY)
        if isSelected then
            gfx.setImageDrawMode(gfx.kDrawModeFillWhite)
        end

        -- Draw note name with better positioning
        local noteText = currentTuning[i]
        local noteX = x + (squareSize - gfx.getTextSize(noteText)) / 2
        gfx.drawText(noteText, noteX, startY + 32)
        gfx.setImageDrawMode(gfx.kDrawModeCopy)



    end

    -- Enhanced instructions with better spacing
    gfx.setColor(gfx.kColorBlack)
    gfx.drawText("A: Play note", 10, 180)
    gfx.drawText("⬅️➡️: Navigate", 10, 200)
    gfx.drawText("⬆️⬇️: Change tuning", 10, 220)
end

function playdate.AButtonDown()
    playStringNote()
end

function playdate.BButtonDown()

end

function playdate.leftButtonDown()

    if selectedString < 6 then
        selectedString = selectedString + 1
    end
end

function playdate.rightButtonDown()
    if selectedString > 1 then
        selectedString = selectedString - 1
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
