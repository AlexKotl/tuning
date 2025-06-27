local constants = import "constants"
local utils = import "utils"

local currentTuning = constants.tuningVariants[1].tuning
local selectedString = 1
local isEditing = false

local squareSize = 30
local squareSpacing = 35
local startX = 20
local startY = 60

local selectedColor = playdate.graphics.kColorBlack
local unselectedColor = playdate.graphics.kColorWhite
local borderColor = playdate.graphics.kColorBlack

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

        playdate.graphics.drawText(currentTuning[i], x + 8, y + 18)
    end

    playdate.graphics.drawText("A: Select string", 10, 200)
    playdate.graphics.drawText("B: Change note", 10, 215)
    playdate.graphics.drawText("D-pad: Navigate", 10, 230)
end

function playdate.AButtonDown()
    isEditing = not isEditing
    if isEditing then
        playdate.graphics.drawText("Editing string " .. selectedString, 10, 180)
    end
end

function playdate.BButtonDown()
    if isEditing then
        local currentNoteIndex = 1
        for i, note in ipairs(constants.notesVariants) do
            if note == currentTuning[selectedString] then
                currentNoteIndex = i
                break
            end
        end

        currentNoteIndex = currentNoteIndex + 1
        if currentNoteIndex > #constants.notesVariants then
            currentNoteIndex = 1
        end

        currentTuning[selectedString] = constants.notesVariants[currentNoteIndex]
    end
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
