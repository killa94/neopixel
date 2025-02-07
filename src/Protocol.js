const SIZE_IN_FRAME = 4
const SIZE_OUT_FRAME = 7

const CMD_APPLY = 0x01
const CMD_SET = 0x02
const CMD_FILL = 0x03
const CMD_OFF = 0x04
const CMD_ON_PROC = 0x05
const CMD_OFF_PROC = 0x06

const RES_CONN_ACK = 0x01
const RES_APPLY_ACK = 0x02

const RES_INVALID = 0x99

class Protocol {
  static apply (buffer, offset) {
    buffer.writeUInt8(CMD_APPLY, offset)
    buffer.fill(0, offset + 1, offset + SIZE_OUT_FRAME)
    return buffer
  }

  static set (buffer, offset, led, red, green, blue, white) {
    buffer.writeUInt8(CMD_SET, offset)
    buffer.writeUInt16LE(led, offset + 1)
    buffer.writeUInt8(red, offset + 3)
    buffer.writeUInt8(green, offset + 4)
    buffer.writeUInt8(blue, offset + 5)
    buffer.writeUInt8(white, offset + 6)
    return buffer
  }

  static fill (buffer, offset, red, green, blue, white) {
    buffer.writeUInt8(CMD_FILL, offset)
    buffer.writeUInt8(0x00, offset + 1)
    buffer.writeUInt8(0x00, offset + 2)
    buffer.writeUInt8(red, offset + 3)
    buffer.writeUInt8(green, offset + 4)
    buffer.writeUInt8(blue, offset + 5)
    buffer.writeUInt8(white, offset + 6)
    return buffer
  }

  static off (buffer, offset) {
    buffer.writeUInt8(CMD_OFF, offset)
    buffer.fill(0, offset + 1, offset + SIZE_OUT_FRAME)
    return buffer
  }

  static onProcedure (buffer, offset) {
    buffer.writeUInt8(CMD_ON_PROC, offset)
    buffer.fill(0, offset + 1, offset + SIZE_OUT_FRAME)
    return buffer
  }

  static offProcedure (buffer, offset) {
    buffer.writeUInt8(CMD_OFF_PROC, offset)
    buffer.fill(0, offset + 1, offset + SIZE_OUT_FRAME)
    return buffer
  }

  static decodeFrame (frame) {
    const msg = frame.readUInt8(0)
    switch (msg) {
      case RES_CONN_ACK:
        return { ack: 'connect', pixels: frame.readUInt16LE(1) }

      case RES_APPLY_ACK:
        return { ack: 'apply' }

      case RES_INVALID:
        return { ack: 'invalid' } // just for testing purpose

      default:
        throw new Error('Unrecognized error')
    }
  }

  static inboundFrameSize () {
    return SIZE_IN_FRAME
  }

  static outboundFrameSize () {
    return SIZE_OUT_FRAME
  }

  static createOutboundFrame (frames = 1) {
    return Buffer.alloc(Protocol.outboundFrameSize() * frames, 0)
  }
}

Protocol.CMD_SET = CMD_SET
Protocol.CMD_APPLY = CMD_APPLY
Protocol.CMD_FILL = CMD_FILL
Protocol.CMD_OFF = CMD_OFF
Protocol.CMD_ON_PROC = CMD_ON_PROC
Protocol.CMD_OFF_PROC = CMD_OFF_PROC

Protocol.RES_CONN_ACK = RES_CONN_ACK
Protocol.RES_APPLY_ACK = RES_APPLY_ACK
Protocol.RES_INVALID = RES_INVALID

module.exports = Protocol
