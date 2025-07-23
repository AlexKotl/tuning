local GuitarString = {}
GuitarString.__index = GuitarString

local gfx<const> = playdate.graphics
local STRING_LENGTH = 135

function GuitarString:init(stringSize)
    local newSelf = setmetatable({}, GuitarString)
    newSelf.stringSize = stringSize
    newSelf.isWaving = false
    newSelf.waveTime = 0
    newSelf.waveAmplitude = 5
    newSelf.waveFrequency = 0.75
    newSelf.waveDecay = 0.35
    newSelf.waveDuration = 40
    newSelf.waveTimer = 0
    return newSelf
end

function GuitarString:triggerWave()
    self.isWaving = true
    self.waveTime = 0
    self.waveTimer = self.waveDuration
end

function GuitarString:update()
    if self.isWaving then
        self.waveTime = self.waveTime + 1
        self.waveTimer = self.waveTimer - 1

        if self.waveTimer <= 0 then
            self.isWaving = false
            self.waveTime = 0
        end
    end
end

function GuitarString:draw(x, y)
    gfx.setColor(gfx.kColorBlack)
    gfx.setLineWidth(self.stringSize)

    if self.isWaving then
        self:drawWavingString(x, y)
    else
        gfx.drawLine(x, y, x, y + STRING_LENGTH)
    end
end

function GuitarString:drawWavingString(x, y)
    local segments = 30
    local segmentLength = STRING_LENGTH / segments
    local decay = math.pow(self.waveDecay, self.waveTime / 10)
    local amplitude = self.waveAmplitude * decay

    local prevX = x
    local prevY = y

    for i = 1, segments do
        local segmentY = y + (i - 1) * segmentLength
        local nextY = y + i * segmentLength

        local waveOffset = math.sin(self.waveTime * self.waveFrequency + i * 0.5) * amplitude
        local currentX = x + waveOffset

        gfx.drawLine(prevX, prevY, currentX, nextY)

        prevX = currentX
        prevY = nextY
    end
end

return GuitarString
