# *Westmarch* Website

Built using [Eleventy](https://www.11ty.dev/) on Node.js. General information can be found on the Eleventy website. [Micah Torcellini also wrote about this project on his website](https://micah.torcellini.org/academic-journal/).

## Project Directory Structure

```
_11ty (various functions)
_data (global data)
_includes
  └───components
  └─── layouts
articles
  └───volume number
      └───issue number
assets
  └───css
  └───fonts
  └───images
  └───SCSS
  └───pages
```

## Content Structure
Academic journals are usually structured by volume and issue, so the directory structure parallels that. 

Pages are in the pages directory. See [Site pages](#site-pages)

Articles are in the articles directory. They are organized by volume and issue. Each issue directory has a directory data file, which must have the filename of the directory name, e.g. `/1/1` requires the directory data `1.json`. See the [Eleventy directory data file documentation](https://www.11ty.dev/docs/data-template-dir/) for more details. 

### Issue Directory Data Files

These cascade to all the pages in the directory. 

I chose to put the full permalink into each article's [front matter](https://www.11ty.dev/docs/data-frontmatter/). While it would be easy to generate these permalinks automatically, I wanted each article's permalink to be hard-coded to it. Thus, even if the content is re-organized, the content would be permanently accessible at the same URL as long as the new system uses the front matter data.

```json
{
    "volume": volume number (integer),
    "issue": issue number (integer),
    "date": "date (string in ISO format, e.g. 2024-08-13)",
    "issueTitle": "issue title (string)",
    "color": "hexadecimal color code (string including octothorpe)",
    "articleCategories": ["article categories (strings in an array), match tags in article front matter, e.g. criticism"],
    "editors": [ 
        {"role": "Position", "name": "Name as it should be displayed in issue page"}
    ],
    "quote": "Issue quote (may have HTML tags)",
    "quoteSource": "Attribution for the quote",
    "letterurl": "from-the-editor", (should not be changed for consistency unless there is a good reason)
    "image": "*absolute* url to OG image background (must be already on the web for the OG image generator to work) (string)",
    "imageTextColor": "hexadecimal color code (string including octothorpe)",
    "coverImage": "relative URL to image (string)",
    "coverImageAlt": "alternate text for cover image (string)",
    "coverImageTitle": "title for cover image (string)",
    "coverImageAuthor": "author for cover image (string)"
}
```
### Article Front Matter

```yaml
---
title: "Title, may include HTML tags. Make sure to escape YAML control characters"
name: name
surname: surname
author: Only use this field if the author goes by a pseudonym that should not be broken into name and surname for citation (i.e. Harmonious Finch should not be cited as Finch, Harmonious). Do not use the name and surname fields if you use this field. base.njk will merge the name and surname fields into the author field, so you can omit it in the content files. 
authordescription: "Biography for the author (optional)"
tags: ["the category you want it to show up in, e.g. criticism"]
permalink: "/vol/issue/slug/" (the permalink is written out in full in order to make future site editing or migration easier)
---
Content goes here. 
```

## Markdown Style Guide

Eleventy uses [Markdown-it](https://github.com/markdown-it/markdown-it) to render Markdown. 

Top-level headings should be `<h2>` (`##`). `<h1>` is for the article title and is in the front matter. 

Works cited should be `<ul>` elements. The `<h2>` above them must be titled "Works Cited", "References," or "Bibliography" (not case-sensitive) for them to be formatted as a works cited (the CSS selector is in `_typography.scss` if a name needs to be added--they work by CSS ID and sibling element selectors). 

Links in works cited should be clickable and represented as Markdown links, but the way people format their bibliographies means that this usually has to be done manually because Pandoc can't. 

Footnotes are made by [Markdown-it-footnote](https://github.com/markdown-it/markdown-it-footnote). 

## Fancy Code to Make Content into Website

### Components
- `_includes/layouts/` contains layout files.
- `_includes/components/` contains component files. 
    - `citation.njk` is the citation generator.
    - `metadata.njk` is the metadata for the `<head>`

#### Layouts
In `_includes/layouts/`.

##### `article.njk`
Template for articles only. 

##### `base.njk`
Root template. calculates `author` and `citationAuthor` fields. Includes `components/metadata.njk`, `components/header.njk`, and `components/footer.njk`. 

> [!CAUTION]
> This template does *not* insert a `<h1>` with the title into the template. If you start making a lot of content pages that are not articles, it would be a good idea to make a template for that. 

### Layout Partials
In `_includes/components/`.

#### `citation.njk`
- Links to RIS
- packages [`citation` shortcode](#citation) in a `<details`> element. 

#### `footer.njk`
The footer. Has CSS classes that show and hide things for different media. 

#### `header.njk`
The header/navigation bar. 

#### `metadata.njk`
All the metadata that goes in `<head>`.
- charset
- `<title>` (with `striptags` filter so that you can use HTML in article titles)
- description (defaults to the `description` in `_data/metadata.json` but can be overridden for any page or article with `description`)
- Link to RSS feed
- viewport meta (for responsive web design)
- link to CSS. 
- msvalidate (Bing Webmaster tools)
- theme color (defaults to `color` in `metadata.json` but can be overridden by either the issue `color` or the page `color`)
- style element that sets the `--theme-color` CSS variable to make the page border the right color. 
- OG image data tags, including the shortcode to make the OG image shortcode make one. 
- canonical link
- keywords (tags and `metadata.json` keywords)
- author (defaults to `metadata.json`, overridden by page and article authors)
- Citation metadata (see [Google Scholar indexing](https://scholar.google.com/intl/en/scholar/inclusion.html#indexing))
- Icons (TBH I just copied these)
- Link to manifest
- Generator meta so that we can be on the Eleventy leaderboards. 


#### `postlist.njk`
Makes a list of posts and authors. Included in `pages/authors.njk`. 

TODO: The different iterations of postlists should probably be consolidated eventually. 

### Site Pages
Pages in `pages` that include site data. There are also normal pages in Markdown files. 

#### `authors.njk`
Lists authors. 

#### `index.njk`
Site homepage. 
- displays issues
- displays homepage banner: 
    To set a banner, tag a page "banner" and put a `bannertitle` and a `bannertext` key in the front matter. `bannertitle` will be enclosed in an `<h2>` element. Both the `bannertitle` and `bannertext` will be place in a banner at the top of the homepage and will link to the page. Though it is possible to make more than one banner, the CSS was only designed for one and it probably a good idea to limit to one. 

### Generated Pages
Pages that are automatically generated from templates in `pages`. See ["Pages from Data in the Eleventy documentation"](https://www.11ty.dev/docs/pages-from-data/).

#### `author.njk`
Generates a page for each author. See [the article on Micah Torcellini's website for technical details](https://micah.torcellini.org/2023/09/23/author-page-manipulate-collections/)--it was a fairly nasty technical problem. 

Note that a bio can be added in `_data/authors.json`. I usually email people after they have a few articles published for an extended bio. 

#### `issues.njk`
Generates a page for each issue from the directory file and the individual articles. Uses the `_11ty/fetchIssues.js` function to get the list of issues. 

TODO: there are a few notes of how this could be done more gracefully. This works for now, but I'm concerned it might become slower as more issues are published. 

#### `ris.njk`
Generates an RIS file for every article in the `article` collection. 

#### `tags.njk`
Makes a page with a list of posts for each tag. 

TODO: decide if this is necessary, since the only tags are for types of articles and pages. 

### Shortcodes. 

#### `ytEmbed`

Embeds a video using lite-youtube. I don't believe it is used in any of this project, but it is available of necessary. 

Code in `[./_11ty/ytEmbed.js]`. 

Parameters:
- i (required): video ID--the part of the YouTube URL that comes after the `v=`
- t: any desired `title` attribute
- c: any desired `class` attribute

#### `citation`

Creates a citation. Used in `./_includes/components/citation.njk`.

Code in `./11ty/citation.js`. 

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
#### `image` 

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

### Filters

#### `readableDate`

Formats a JavaScript date object to a readable format (LLLL dd, yyyy).

#### `year`

Formats a JavaScript date object to display just the year. 

#### `slugify-removeChars`

Removes characters that are not allowable in URLs (*+~.()'"!:@’“”). 

#### `striptags`

Removes HTML tags. 

#### `shortTitle` and `subtitle`

Splits a string at the colon (:). `shortTitle` returns the part before the first colon, `subtitle` returns the part after it (until any other colon). This is useful for getting the short titles and subtitles from article titles. 

Code in [`./11ty/splitTitle.js`](./11ty/splitTitle.js).

#### `filterByAuthor`

Filters a collection by the `author`. Used in [`./pages/author.njk`](./pages/author.njk)

#### `sortAuthorsByArticleNumber`

Sorts items in the `author` collection by `articlenumber`. Used in [`./pages/authors.njk`](./pages/authors.njk).

#### `htmlDateString`

Formats an [HTML date string](https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string) from a JavaScript date object. 

#### `head`

Gets the first `n` elements of a collection.

Parameters: 
- n: number of elements desired. 

## Visual Design/CSS
Written in [SCSS](https://sass-lang.com/). 

## How-to
### Generate Markdown with [Pandoc](https://pandoc.org/)

It is much easier to get properly-formatted Word documents and convert them than to copy-paste. Pandoc does this nicely. It makes me happy and will make you happy also. 

`pandoc "filename.docx" -o "filename.md"`

To generate Markdown for all the files in the directory (Powershell): `Get-ChildItem -File | Foreach {pandoc $_.Name -o (-join ($_.Name, ".md"))}`