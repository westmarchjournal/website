# Project Specifications
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
Talk to Elyse. 

## Project Deadlines
The next issue prints by February 24. 

## Required Materials
Word documents; PDF of the issue. 

## Domain
We'll figure this out. 

## Stuff
I'll get access to the Westmarch Google account with a folder with everything from the last issue. 

## Other things
Donate button. 

## How-to
### Generate Markdown with [Pandoc](https://pandoc.org/)

`pandoc "filename.docx" -o "filename.md"`

To generate Markdown for all the files in the directory (Powershell): `Get-ChildItem -File | Foreach {pandoc $_.Name -o (-join ($_.Name, ".md"))}`