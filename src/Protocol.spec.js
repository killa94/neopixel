/* global test, expect */

const Protocol = require('./Protocol')

test('set', () => {
  const b = Buffer.alloc(Protocol.outboundFrameSize() + 4, 9)

  expect(Protocol.set(b, 2, 42, 101, 102, 103))
    .toEqual(Buffer.from([
      9, 9,
      0x01, 42, 101, 102, 103,
      9, 9
    ]))
})

test('apply', () => {
  const b = Buffer.alloc(Protocol.outboundFrameSize() + 4, 9)

  expect(Protocol.apply(b, 2))
    .toEqual(Buffer.from([
      9, 9,
      0x02, 0, 0, 0, 0,
      9, 9
    ]))
})

test('fill', () => {
  const b = Buffer.alloc(Protocol.outboundFrameSize() + 4, 9)

  expect(Protocol.fill(b, 2, 101, 102, 103))
    .toEqual(Buffer.from([
      9, 9,
      0x03, 0, 101, 102, 103,
      9, 9
    ]))
})

test('off', () => {
  const b = Buffer.alloc(Protocol.outboundFrameSize() + 4, 9)
  expect(Protocol.off(b, 2))
    .toEqual(Buffer.from([
      9, 9,
      0x04, 0, 0, 0, 0,
      9, 9
    ]))
})

test('decodeFrame', () => {
  const buffer = Buffer.alloc(4)
  buffer[0] = 0x01
  buffer.writeUInt16LE(12345, 1)

  expect(Protocol.decodeFrame(buffer))
    .toEqual({ ack: 'connect', pixels: 12345 })

  expect(Protocol.decodeFrame(Buffer.from([0x02, 0, 0, 0])))
    .toEqual({ ack: 'apply' })

  expect(Protocol.decodeFrame(Buffer.from([0x03, 0, 0, 0])))
    .toEqual({ ack: 'fill' })

  expect(Protocol.decodeFrame(Buffer.from([0x04, 0, 0, 0])))
    .toEqual({ ack: 'off' })
})

test('in/outFrameSize', () => {
  expect(Protocol.inboundFrameSize()).toEqual(4)
  expect(Protocol.outboundFrameSize()).toEqual(5)
  expect(Protocol.createOutboundFrame()).toEqual(Buffer.alloc(5, 0))
  expect(Protocol.createOutboundFrame(3)).toEqual(Buffer.alloc(5 * 3, 0))
})
