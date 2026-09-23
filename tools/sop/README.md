# SOP generator

Rebuilds `UptimePartsHub-Order-Workflow-SOP.docx` from a data structure.

**The `.docx` is a build artifact. Do not hand-edit it — edit the data and re-run.**

```bash
node tools/sop/sop_workflow.js            # rebuild the SOP in Documents\UptimePartsHub\SOP
node tools/sop/sop_workflow.js --check    # validate the data, write nothing
node tools/sop/sop_workflow.js --out draft.docx
```

The previous file is copied to `<name>.docx.bak` before each write. If the
document is open in Word or LibreOffice the script warns you: your editor will
overwrite the rebuild the moment it saves, so close it without saving first.

No dependencies, no `npm install`. Node 18+.

## Layout

| Path                  | Purpose                                                     |
| --------------------- | ----------------------------------------------------------- |
| `sop_workflow.js`     | The SOP content (`SOP_DATA`) and the CLI. **Edit this.**     |
| `lib/render.js`       | Turns `SOP_DATA` into `word/document.xml`.                   |
| `lib/zip.js`          | Minimal deterministic ZIP writer (a `.docx` is a ZIP).       |
| `template/`           | The static `.docx` parts — styles, numbering, footer, rels.  |

`template/` was lifted verbatim from the original document, so fonts, the page
footer and the bullet list numbering stay exactly as they were. Only
`word/document.xml` is generated.

## Editing the SOP

### Add a stage

Drop an object into `SOP_DATA.stages` wherever it belongs. `number` is a free
string, so half-steps are fine:

```js
{
  number: '2.5',
  title: 'NDA CONFIRMED',
  subtitle: 'Confidentiality agreement before call is booked',
  color: navy,
  blocks: [
    {
      type: 'checklist',
      items: [
        { text: 'Send the pre-call NDA email to the buyer' },
        { kind: 'stop', text: 'Do not send the Zoom link until the reply is received' },
      ],
    },
  ],
}
```

### Blocks

A stage holds any number of blocks, rendered in order.

- `{ type: 'checklist', lead?, items }` — `lead` prints a bold blue line above
  the table (Stage 04 uses two of them to split one stage into phases).
- `{ type: 'callout', label, text, color? }` — the tinted full-width strip used
  for RESPONSE TIME, SUPPLIER CONFIDENTIALITY and DEPOSIT RULE.

### Checklist items

```js
{ text: 'Do the thing', note: 'Optional smaller italic line underneath' }
{ kind: 'stop', text: 'Do not do the other thing' }
```

`kind` is `check` (default, ☐), `stop` (✗, pink row) or `note` (!, amber row) —
the three markers in the document's own legend.

One rule is applied automatically and is worth knowing, because it looks like a
bug otherwise: **an item with a `note` renders its heading in regular weight; an
item without one renders bold.** That matches the original document, where a
heading plus sub-note reads as a single unit.

## Verifying a change

`--check` only confirms the data renders. To confirm the document still looks
right, convert it and read the result:

```bash
soffice --headless --convert-to pdf --outdir /tmp path/to/the.docx
```

## Provenance

The generator was reverse-engineered from the hand-built original and
reproduces its `word/document.xml` byte-for-byte, with one deliberate
exception: the spacer beneath the Stage 2.5 header was 80 twips where every
other stage uses 40, and the generator emits the consistent 40.
