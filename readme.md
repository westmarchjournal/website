# *Westmarch* Website
## Structure
Organize articles into volumes and issues. Put links to PDF files on the homepage for each issue. This will probably require a JSON file for each issue (or can I do it with special front matter in the editor's letter?). 

## Components
- `_includes/layouts/` contains layout files.
- `_includes/components/` contains component files. 
    - `citation.njk` is the citation generator.
    - `metadata.njk` is the metadata for the `<head>`

## Visual Design

## Shortcodes. 

### `ytEmbed`

Embeds a video using lite-youtube. I don't believe it is used in any of this project, but it is available of necessary. 

Code in `[./_11ty/ytEmbed.js]`. 

Parameters:
- i (required): video ID--the part of the YouTube URL that comes after the `v=`
- t: any desired `title` attribute
- c: any desired `class` attribute

### `citation`

Creates a citation. Used in `[./_includes/components/citation.njk]`.

Code in [./11ty/citation.js]. 

Parameters: 
- style (req.): citation style. It currently includes `turabian-note`, `turabian-bib`, `mla`, and `apa`.
- data (req.): object containing citation data. See the usage example below.

Usage example: 

```nunjucks
{% set data  = {
    "authors":  [
        {
            "name": name,
            "surname": surname,
            "author": author
        }
    ],
    "date": page.date,
    "title": title,
    "journaltitle": metadata.title | title,
    "volume": volume,
    "issue": issue,
    "url": metadata.citationurl + page.url | url
}
%}
<p>{% citation "turabian-note", data %}</p>
```
### `image` 

Makes a responsive image using `eleventy-image`. 

Code in `[./11ty/image.js]`. 

Parameters: 
- src (req.): local path to source image. It can currently handle `webp`, `jpeg`, and `svg` images (this could be expanded on). NOTE: the plugin will not recognize images that have `.jpg` filenames. They *must* be `.jpeg`. 
- widths: array of widths; defaults to `[150, 300, 600, 800, 1000, 2000]`.
- sizes: string of `sizes` attribute; defaults to `"(min-width: 50rem) 40rem, 100vw"`.
- cls: any desired CSS class, defaults to `"image"`.
- loading: defines loading behavior via the `loading` attribute. Defaults to `"lazy"`.

Usage example: 
```nunjucks
{% image "/assets/images/img.jpeg", "alternate text" %}
```

## Filters

### `readableDate`

Formats a JavaScript date object to a readable format (LLLL dd, yyyy).

### `year`

Formats a JavaScript date object to display just the year. 

### `slugify-removeChars`

Removes characters that are not allowable in URLs (*+~.()'"!:@’“”). 

### `striptags`

Removes HTML tags. 

### `shortTitle` and `subtitle`

Splits a string at the colon (:). `shortTitle` returns the part before the first colon, `subtitle` returns the part after it (until any other colon). This is useful for getting the short titles and subtitles from article titles. 

Code in [`./11ty/splitTitle.js`](./11ty/splitTitle.js).

### `filterByAuthor`

Filters a collection by the `author`. Used in [`./pages/author.njk`](./pages/author.njk)

### `sortAuthorsByArticleNumber`

Sorts items in the `author` collection by `articlenumber`. Used in [`./pages/authors.njk`](./pages/authors.njk).

### `htmlDateString`

Formats an [HTML date string](https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string) from a JavaScript date object. 

### `head`

Gets the first `n` elements of a collection.

Parameters: 
- n: number of elements desired. 

## How-to
### Generate Markdown with [Pandoc](https://pandoc.org/)

`pandoc "filename.docx" -o "filename.md"`

To generate Markdown for all the files in the directory (Powershell): `Get-ChildItem -File | Foreach {pandoc $_.Name -o (-join ($_.Name, ".md"))}`