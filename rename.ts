import exifParser from 'https://cdn.skypack.dev/exif-parser';

const fileName = 'IMG_0063.JPG'
const file = await Deno.readFile(`in/${fileName}`)

const exif = exifParser.create(file.buffer).parse()
console.log(exif)