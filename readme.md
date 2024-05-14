# *Westmarch* Website
## Structure
Organize articles into volumes and issues. Put links to PDF files on the homepage for each issue. This will probably require a JSON file for each issue (or can I do it with special front matter in the editor's letter?). 

Citation information should be included in each article. 

Figure out how to do biographies. 

Make a submissions page. 
## Components
- `_includes/layouts/` contains layout files.
- `_includes/components/` contains component files. 
    - `citation.njk` is the citation generator.
    - `metadata.njk` is the metadata for the `<head>`

## Visual Design


## Other things
Donate button. 

## Shortcodes. 

This project includes several shortcodes. 

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
- src (req.): local path to source image.
- alt (req.; using `""` is fine): alternate text.
- widths: array of widths; defaults to `[150, 300, 600, 800, 1000, 2000]`.
- sizes: string of `sizes` attribute; defaults to `"(min-width: 50rem) 40rem, 100vw"`.
- cls: any desired CSS class, defaults to `"image"`.
- loading: defines loading behavior via the `loading` attribute. Defaults to `"lazy"`.


## Filters

This includes several filters

## How-to
### Generate Markdown with [Pandoc](https://pandoc.org/)

`pandoc "filename.docx" -o "filename.md"`

To generate Markdown for all the files in the directory (Powershell): `Get-ChildItem -File | Foreach {pandoc $_.Name -o (-join ($_.Name, ".md"))}`