import AppKit

let text = CommandLine.arguments[1]
let outPath = CommandLine.arguments[2]
let size: CGFloat = 1024

let image = NSImage(size: NSSize(width: size, height: size))
image.lockFocus()
NSColor(calibratedRed: 0.12, green: 0.13, blue: 0.16, alpha: 1.0).setFill()
NSRect(x: 0, y: 0, width: size, height: size).fill()

let attrs: [NSAttributedString.Key: Any] = [
    .font: NSFont.systemFont(ofSize: size * 0.6),
    .foregroundColor: NSColor.white
]
let str = NSAttributedString(string: text, attributes: attrs)
let strSize = str.size()
let rect = NSRect(x: (size - strSize.width)/2, y: (size - strSize.height)/2, width: strSize.width, height: strSize.height)
str.draw(in: rect)

image.unlockFocus()
let tiff = image.tiffRepresentation!
let rep = NSBitmapImageRep(data: tiff)!
let png = rep.representation(using: .png, properties: [:])!
try! png.write(to: URL(fileURLWithPath: outPath))
