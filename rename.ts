import exifParser from 'https://cdn.skypack.dev/exif-parser@0.1.12'
import { fromUnixTime } from 'https://cdn.skypack.dev/date-fns@2.28.0?dts'
import DateFnsTz from 'https://cdn.skypack.dev/date-fns-tz@1.3.7?dts'


// --- CONFIG ---
const INPUT_DIR = './in'
const OUTPUT_DIR = './out'

// --- Run the script ---
main()

// --- TYPINGS ---
type ExifTags = {
    DateTimeOriginal?: number
    [tag:string]: number|string|undefined
}

type NameAndExifTags = {
    name: string,
    tags: ExifTags
}

// --- FUNCTIONS ---
function renamePicture(file:NameAndExifTags):void{
    const newName = createNameFromExifTags(file.tags)
    if(!newName){ return }
    Deno.renameSync(`${INPUT_DIR}/${file.name}`, `${OUTPUT_DIR}/${newName}`)
}

function getFileExifTags(fileEntry:Deno.DirEntry):null|ExifTags{
    const file = Deno.readFileSync(`in/${fileEntry.name}`)
    const exif = exifParser.create(file.buffer).parse()
    return exif.tags ?? null
}

function createNameFromExifTags(tags:ExifTags):null|string {
    if(!tags.DateTimeOriginal){ return null }

    const date = fromUnixTime(tags.DateTimeOriginal)
    return `${DateFnsTz.formatInTimeZone(date, 'UTC', 'yyyy_MM_dd_HHmmss')}.JPG`
}

function isJpegFile(file:Deno.DirEntry):boolean{
    const jpgFileRegex = /^.+.(JPG|jpg)$/
    return file.isFile && jpgFileRegex.test(file.name)
}

function main():void{
    const jpegFiles = [...Deno.readDirSync(INPUT_DIR)].filter(isJpegFile)

    jpegFiles
        .map((f):NameAndExifTags|null => {
            const tags = getFileExifTags(f)
            return tags ? { name: f.name, tags: tags } : null
        })
        .forEach(file => file && renamePicture(file))
}