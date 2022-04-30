import exifParser from 'https://cdn.skypack.dev/exif-parser@0.1.12'
// import exifParser from "https://esm.sh/exif-parser@0.1.12"

import {fromUnixTime, format} from "https://esm.sh/date-fns@2.28.0"

type ExifTags = {
    DateTimeOriginal?: number
    [tag:string]: number|string|undefined
}

const fileName = 'IMG_0155.JPG'

//@TODO: loop on files in input directory
//@TODO: filter out non-JPG files

const file = await Deno.readFile(`in/${fileName}`)

const exif = exifParser.create(file.buffer).parse()
console.log(exif)

console.log(createNameFromExifTags(exif.tags))

function createNameFromExifTags(tags:ExifTags):null|string {
    if(!tags.DateTimeOriginal){ return null }

    const date = fromUnixTime(tags.DateTimeOriginal)
    return format(date, 'yyyy-MM-dd_HHmmss')
}