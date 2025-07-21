local GuitarString = {}
GuitarString.__index = GuitarString

local gfx<const> = playdate.graphics
local STRING_LENGTH = 100

function GuitarString:init(stringSize)
  local newSelf = setmetatable({}, GuitarString)
  newSelf.stringSize = stringSize
  return newSelf
end

function GuitarString:draw(x, y)
  gfx.setColor(gfx.kColorBlack)
  gfx.setLineWidth(self.stringSize)
  gfx.drawLine(x, y, x, y + STRING_LENGTH)
end

return GuitarString