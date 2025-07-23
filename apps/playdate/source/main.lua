import "CoreLibs/ui"

local constants = import "constants"
local utils = import "utils"
local GuitarString = import "components/guitar-string"

local gfx = playdate.graphics

local fontBigger<const> = gfx.font.new("fonts/Roobert/Roobert-9-Mono-Condensed")

local currentTuning = constants.tuningVariants[1].tuning

local selectedString = 6
local soundPlayer = nil

-- Grid display variables
local showInstructions = false
local gridStartX = 270
local gridStartY = 15
local gridItemWidth = 120
local gridItemHeight = 40
local gridSpacing = 5
local gridview = playdate.ui.gridview.new(gridItemWidth, gridItemHeight)
gridview:setNumberOfRows(#constants.tuningVariants)
gridview:setNumberOfColumns(1)
gridview:setSelection(1, 1, 1)

-- Enhanced visual parameters
local squareSize = 35 -- Slightly larger
local squareSpacing = 40 -- More spacing
local startX = 15
local startY = 50
local cornerRadius = 6 -- Rounded corners
local shadowOffset = 2 -- Shadow effect

-- Enhanced color scheme
local selectedColor = gfx.kColorBlack
local unselectedColor = gfx.kColorWhite
local borderColor = gfx.kColorBlack
local highlightColor = gfx.kColorWhite

local strings = {GuitarString:init(1), GuitarString:init(2), GuitarString:init(3), GuitarString:init(4),
                 GuitarString:init(5), GuitarString:init(6)}

-- Constants for sound file naming (same as web app)
local SOUND_FILE_INDEX_DIFF = 9

-- Gridview cell drawing function
function gridview:drawCell(section, row, column, selected, x, y, width, height)
    local tuningVariant = constants.tuningVariants[row]
    if not tuningVariant then
        return
    end

    local isCurrent = true
    for j, note in ipairs(tuningVariant.tuning) do
        if note ~= currentTuning[j] then
            isCurrent = false
            break
        end
    end

    gfx.setFont(fontBigger)
    gfx.setFontTracking(-0.5)
    gfx.setLineWidth(isCurrent and 3 or 1)
    gfx.setColor(gfx.kColorWhite)
    gfx.fillRoundRect(x, y, width - 3, height - 3, cornerRadius)

    gfx.setColor(gfx.kColorBlack)
    gfx.drawRoundRect(x, y, width - 3, height - 3, cornerRadius)

    gfx.setColor(gfx.kColorBlack)
    local titleX = x + (width - gfx.getTextSize(tuningVariant.title)) / 2
    gfx.drawText(tuningVariant.title, titleX, y + 5)

    local reversedTuning = {}
    for i = #tuningVariant.tuning, 1, -1 do
        table.insert(reversedTuning, tuningVariant.tuning[i])
    end
    local notesText = table.concat(reversedTuning, "-")
    local notesX = x + (width - gfx.getTextSize(notesText)) / 2
    gfx.drawText(notesText, notesX, y + 20)
end

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

    -- Trigger wave animation for the selected string
    strings[selectedString]:triggerWave()
end

function playdate.update()
    gfx.clear()
    gfx.setFont(playdate.graphics.getSystemFont())

    -- Update all strings for wave animation
    for i = 1, 6 do
        strings[i]:update()
    end

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

    gfx.drawText("Tuning: " .. tuningName, startX, 15)

    for i = 1, 6 do
        gfx.setLineWidth(1)
        local x = startX + (6 - i) * squareSpacing

        local isSelected = (i == selectedString)
        local fillColor = isSelected and selectedColor or unselectedColor

        drawRoundedButton(x, startY + 22, squareSize, squareSize, fillColor, borderColor, isSelected)

        strings[i]:draw(x + 18, startY + 22 + 37)

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

    -- Draw gridview with proper SDK approach
    gridview:drawInRect(gridStartX, gridStartY, gridItemWidth,
        #constants.tuningVariants * (gridItemHeight + gridSpacing))
    gfx.setFont(playdate.graphics.getSystemFont())

    if showInstructions then
        drawInstructions()
    end
end

function drawInstructions()
    local startX = 40
    local startY = 165
    local frameWidth = 185
    gfx.setColor(gfx.kColorWhite)
    gfx.fillRoundRect(startX, startY, frameWidth, 70, 10)
    gfx.setColor(gfx.kColorBlack)
    gfx.drawRoundRect(startX, startY, frameWidth, 70, 10)
    gfx.setColor(gfx.kColorBlack)
    gfx.drawText("Ⓐ: Play note", startX + 10, startY + 7)
    gfx.drawText("⬅️➡️: Navigate", startX + 10, startY + 27)
    gfx.drawText("⬆️⬇️: Change tuning", startX + 10, startY + 47)
end

function playdate.AButtonDown()
    playStringNote()
end

function playdate.BButtonDown()
    showInstructions = not showInstructions
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

function handleTuningChange(direction)
    local section, row, column = gridview:getSelection()
    local newRow = row + direction

    if newRow > #constants.tuningVariants then
        newRow = 1
    elseif newRow < 1 then
        newRow = #constants.tuningVariants
    end

    gridview:setSelection(section, newRow, column)
    currentTuning = constants.tuningVariants[newRow].tuning
end

function playdate.upButtonDown()
    handleTuningChange(-1)
end

function playdate.downButtonDown()
    handleTuningChange(1)
end

