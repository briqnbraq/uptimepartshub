'use strict';

// WordprocessingML renderers for the SOP. Every measurement, colour and run
// property here was transcribed from the existing SOP document so that a
// regenerated file is visually identical to the hand-built original.
//
// Units: w:sz is half-points (sz 20 = 10pt); widths and margins are twips.

const ARIAL = '<w:rFonts w:ascii="Arial" w:cs="Arial" w:eastAsia="Arial" w:hAnsi="Arial"/>';

const COLOR = {
  navyDeep: '0F3460',
  navy: '1A3A5C',
  green: '4A7C20',
  greenDeep: '1A5C2A',
  orange: 'C05A00',
  slate: '4A5568',
  red: '8B0000',
  lime: 'C8F542',
  white: 'FFFFFF',
  body: '333333',
  tintGreen: 'F2F7F2',
  tintAmber: 'FFF9E6',
  tintRed: 'FFF0F0',
  rule: 'CCCCCC',
};

// Checklist row kinds, matching the legend printed at the top of the document.
// `rowFill` shades a checklist row; `legendFill` shades the legend swatch and
// differs for `check`, whose rows are plain white but whose legend chip is
// tinted. The SOP does not currently use a `note` row, but the legend
// advertises one, so the renderer supports it.
const MARKERS = {
  check: {
    glyph: '☐',
    glyphColor: COLOR.greenDeep,
    rowFill: COLOR.white,
    legendFill: COLOR.tintGreen,
    legendBold: false,
    label: 'Action item to complete',
  },
  note: {
    glyph: '!',
    glyphColor: COLOR.orange,
    rowFill: COLOR.tintAmber,
    legendFill: COLOR.tintAmber,
    legendBold: true,
    label: 'Important note or caution',
  },
  stop: {
    glyph: '✗',
    glyphColor: COLOR.red,
    rowFill: COLOR.tintRed,
    legendFill: COLOR.tintRed,
    legendBold: true,
    label: 'Stop — do not proceed',
  },
};

function esc(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/** @param {{bold?: boolean, italic?: boolean, color: string, size: number}} opts */
function run(text, opts) {
  let rPr = ARIAL;
  if (opts.bold === true) rPr += '<w:b/><w:bCs/>';
  else if (opts.bold === false) rPr += '<w:b w:val="false"/><w:bCs w:val="false"/>';
  if (opts.italic) rPr += '<w:i/><w:iCs/>';
  rPr += `<w:color w:val="${opts.color}"/>`;
  rPr += `<w:sz w:val="${opts.size}"/><w:szCs w:val="${opts.size}"/>`;
  return `<w:r><w:rPr>${rPr}</w:rPr><w:t xml:space="preserve">${esc(text)}</w:t></w:r>`;
}

/** @param {{style?, numId?, spacing?: [after, before], align?, topBorder?}} opts */
function para(inner, opts = {}) {
  let pPr = '';
  if (opts.style) pPr += `<w:pStyle w:val="${opts.style}"/>`;
  if (opts.numId) pPr += `<w:numPr><w:ilvl w:val="0"/><w:numId w:val="${opts.numId}"/></w:numPr>`;
  if (opts.topBorder) {
    pPr += `<w:pBdr><w:top w:val="single" w:color="${opts.topBorder}" w:sz="3"/></w:pBdr>`;
  }
  if (opts.spacing) pPr += `<w:spacing w:after="${opts.spacing[0]}" w:before="${opts.spacing[1]}"/>`;
  if (opts.align) pPr += `<w:jc w:val="${opts.align}"/>`;
  return `<w:p>${pPr ? `<w:pPr>${pPr}</w:pPr>` : ''}${inner}</w:p>`;
}

const SIDES = ['top', 'left', 'bottom', 'right'];

const BORDER_NONE =
  `<w:tcBorders>${SIDES.map(s => `<w:${s} w:val="none" w:color="FFFFFF" w:sz="0"/>`).join('')}</w:tcBorders>`;
const BORDER_RULE =
  `<w:tcBorders>${SIDES.map(s => `<w:${s} w:val="single" w:color="${COLOR.rule}" w:sz="1"/>`).join('')}</w:tcBorders>`;
const TBL_BORDERS =
  `<w:tblBorders>${[...SIDES, 'insideH', 'insideV']
    .map(s => `<w:${s} w:val="single" w:color="auto" w:sz="4"/>`)
    .join('')}</w:tblBorders>`;

/** @param {[top, left, bottom, right]} m */
function margin(m) {
  return (
    `<w:tcMar><w:top w:type="dxa" w:w="${m[0]}"/><w:left w:type="dxa" w:w="${m[1]}"/>` +
    `<w:bottom w:type="dxa" w:w="${m[2]}"/><w:right w:type="dxa" w:w="${m[3]}"/></w:tcMar>`
  );
}

/** @param {{width?, borders, fill, margin}} opts */
function cell(opts, paragraphs) {
  let tcPr = '';
  if (opts.width) tcPr += `<w:tcW w:type="dxa" w:w="${opts.width}"/>`;
  tcPr += opts.borders;
  tcPr += `<w:shd w:fill="${opts.fill}" w:val="clear"/>`;
  tcPr += margin(opts.margin);
  return `<w:tc><w:tcPr>${tcPr}</w:tcPr>${paragraphs}</w:tc>`;
}

function table(gridCols, rows) {
  const grid = gridCols.map(w => `<w:gridCol w:w="${w}"/>`).join('');
  return (
    `<w:tbl><w:tblPr><w:tblW w:type="dxa" w:w="9360"/>${TBL_BORDERS}</w:tblPr>` +
    `<w:tblGrid>${grid}</w:tblGrid>${rows.join('')}</w:tbl>`
  );
}

// ─── blocks ──────────────────────────────────────────────────────────────────

/** Empty paragraph used as vertical whitespace between blocks. */
function gap(before) {
  return para('', { spacing: [0, before] });
}

function titleBanner(meta) {
  const left = cell(
    { borders: BORDER_NONE, fill: COLOR.navyDeep, margin: [140, 200, 140, 80] },
    para(run(meta.brand, { bold: true, color: COLOR.lime, size: 30 })) +
      para(run(meta.title, { color: COLOR.white, size: 20 })) +
      para(run(meta.confidentiality, { italic: true, color: COLOR.white, size: 16 }))
  );
  const right = cell(
    { borders: BORDER_NONE, fill: COLOR.navyDeep, margin: [140, 80, 140, 200] },
    para(run(meta.version, { color: COLOR.white, size: 17 }), { align: 'right' }) +
      para(run(meta.phase, { color: COLOR.lime, size: 17 }), { align: 'right' }) +
      para(run(meta.reviewTrigger, { italic: true, color: COLOR.white, size: 15 }), { align: 'right' })
  );
  return table([5600, 3760], [`<w:tr>${left}${right}</w:tr>`]);
}

/** The ☐ / ! / ✗ key. Widths are fixed by the three-pair layout. */
function legend() {
  const widths = [3000, 3000, 2760];
  const cells = ['check', 'note', 'stop']
    .map((kind, i) => {
      const marker = MARKERS[kind];
      const glyph = cell(
        { width: 200, borders: BORDER_NONE, fill: marker.glyphColor, margin: [60, 80, 60, 40] },
        para(run(marker.glyph, { bold: marker.legendBold || undefined, color: COLOR.white, size: 18 }), {
          align: 'center',
        })
      );
      const label = cell(
        { width: widths[i], borders: BORDER_NONE, fill: marker.legendFill, margin: [60, 80, 60, 80] },
        para(run(marker.label, { color: COLOR.body, size: 17 }))
      );
      return glyph + label;
    })
    .join('');
  return table([200, 3000, 200, 3000, 200, 2760], [`<w:tr>${cells}</w:tr>`]);
}

function stageHeader(stage) {
  const number = cell(
    { width: 800, borders: BORDER_NONE, fill: stage.color, margin: [100, 120, 100, 80] },
    para(run(stage.number, { bold: true, color: COLOR.lime, size: 28 }), { align: 'center' })
  );
  const heading = cell(
    { width: 8560, borders: BORDER_NONE, fill: stage.color, margin: [80, 140, 80, 140] },
    para(run(stage.title, { bold: true, color: COLOR.white, size: 22 })) +
      para(run(stage.subtitle, { italic: true, color: COLOR.white, size: 17 }))
  );
  return table([800, 8560], [`<w:tr>${number}${heading}</w:tr>`]);
}

function checklist(items) {
  const rows = items.map(item => {
    const kind = item.kind || 'check';
    const marker = MARKERS[kind];
    if (!marker) throw new Error(`unknown checklist item kind: ${kind}`);

    const glyph = cell(
      { width: 600, borders: BORDER_RULE, fill: marker.rowFill, margin: [60, 100, 60, 60] },
      para(run(marker.glyph, { bold: true, color: marker.glyphColor, size: 20 }), { align: 'center' })
    );

    // An item that carries a sub-note sets its heading in regular weight so the
    // two lines read as one unit; a standalone item is bold.
    let body = para(run(item.text, { bold: !item.note, color: COLOR.body, size: 20 }));
    if (item.note) {
      body += para(run(item.note, { italic: true, color: COLOR.slate, size: 18 }), { spacing: [0, 20] });
    }
    const text = cell(
      { width: 8760, borders: BORDER_RULE, fill: marker.rowFill, margin: [60, 140, 60, 100] },
      body
    );
    return `<w:tr>${glyph}${text}</w:tr>`;
  });
  return table([600, 8760], rows);
}

function callout(block) {
  const label = cell(
    { width: 1000, borders: BORDER_NONE, fill: block.color || COLOR.green, margin: [80, 100, 80, 80] },
    para(run(block.label, { bold: true, color: COLOR.white, size: 17 }), { align: 'center' })
  );
  const body = cell(
    { width: 8360, borders: BORDER_NONE, fill: COLOR.tintGreen, margin: [80, 140, 80, 120] },
    para(run(block.text, { italic: true, color: COLOR.slate, size: 19 }))
  );
  return table([1000, 8360], [`<w:tr>${label}${body}</w:tr>`]);
}

function quickReference(section) {
  const heading = para(run(section.title, { bold: true, color: COLOR.navyDeep, size: 20 }), {
    spacing: [40, 0],
  });
  const bullets = section.rules
    .map(rule =>
      para(run(rule, { color: COLOR.body, size: 19 }), {
        style: 'ListParagraph',
        numId: 2,
        spacing: [30, 30],
      })
    )
    .join('');
  const box = cell(
    { borders: BORDER_RULE, fill: COLOR.tintGreen, margin: [100, 160, 100, 160] },
    heading + bullets
  );
  return table([9360], [`<w:tr>${box}</w:tr>`]);
}

function bodyParagraph(text) {
  return para(run(text, { color: COLOR.body, size: 20 }), { spacing: [60, 60] });
}

function leadIn(text) {
  return para(run(text, { bold: true, color: COLOR.navyDeep, size: 20 }), { spacing: [40, 80] });
}

function closingNote(text) {
  return para(run(text, { italic: true, color: COLOR.slate, size: 20 }), { spacing: [60, 60] });
}

const SECT_PR =
  '<w:sectPr><w:footerReference w:type="default" r:id="rId7"/>' +
  '<w:pgSz w:w="12240" w:h="15840" w:orient="portrait"/>' +
  '<w:pgMar w:top="1080" w:right="1080" w:bottom="1200" w:left="1080" ' +
  'w:header="708" w:footer="708" w:gutter="0"/>' +
  '<w:pgNumType/><w:docGrid w:linePitch="360"/></w:sectPr>';

const DOC_OPEN =
  '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
  '<w:document mc:Ignorable="w14 w15 wp14" ' +
  'xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas" ' +
  'xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" ' +
  'xmlns:o="urn:schemas-microsoft-com:office:office" ' +
  'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" ' +
  'xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math" ' +
  'xmlns:v="urn:schemas-microsoft-com:vml" ' +
  'xmlns:wp14="http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing" ' +
  'xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" ' +
  'xmlns:w10="urn:schemas-microsoft-com:office:word" ' +
  'xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" ' +
  'xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml" ' +
  'xmlns:w15="http://schemas.microsoft.com/office/word/2012/wordml" ' +
  'xmlns:wpg="http://schemas.microsoft.com/office/word/2010/wordprocessingGroup" ' +
  'xmlns:wpi="http://schemas.microsoft.com/office/word/2010/wordprocessingInk" ' +
  'xmlns:wne="http://schemas.microsoft.com/office/word/2006/wordml" ' +
  'xmlns:wps="http://schemas.microsoft.com/office/word/2010/wordprocessingShape" ' +
  'xmlns:cx="http://schemas.microsoft.com/office/drawing/2014/chartex" ' +
  'xmlns:cx1="http://schemas.microsoft.com/office/drawing/2015/9/8/chartex" ' +
  'xmlns:cx2="http://schemas.microsoft.com/office/drawing/2015/10/21/chartex" ' +
  'xmlns:cx3="http://schemas.microsoft.com/office/drawing/2016/5/9/chartex" ' +
  'xmlns:cx4="http://schemas.microsoft.com/office/drawing/2016/5/10/chartex" ' +
  'xmlns:cx5="http://schemas.microsoft.com/office/drawing/2016/5/11/chartex" ' +
  'xmlns:cx6="http://schemas.microsoft.com/office/drawing/2016/5/12/chartex" ' +
  'xmlns:cx7="http://schemas.microsoft.com/office/drawing/2016/5/13/chartex" ' +
  'xmlns:cx8="http://schemas.microsoft.com/office/drawing/2016/5/14/chartex" ' +
  'xmlns:aink="http://schemas.microsoft.com/office/drawing/2016/ink" ' +
  'xmlns:am3d="http://schemas.microsoft.com/office/drawing/2017/model3d" ' +
  'xmlns:w16cex="http://schemas.microsoft.com/office/word/2018/wordml/cex" ' +
  'xmlns:w16cid="http://schemas.microsoft.com/office/word/2016/wordml/cid" ' +
  'xmlns:w16="http://schemas.microsoft.com/office/word/2018/wordml" ' +
  'xmlns:w16sdtdh="http://schemas.microsoft.com/office/word/2020/wordml/sdtdatahash" ' +
  'xmlns:w16se="http://schemas.microsoft.com/office/word/2015/wordml/symex">';

// Vertical rhythm, in twips. A stage break breathes more than the gaps between
// blocks inside a single stage.
const GAP_AFTER_TITLE = 100;
const GAP_SECTION = 80; // before a stage header, the quick reference, the tail rule
const GAP_INNER = 40; // between blocks belonging to the same stage

/**
 * Render the whole document body from the SOP data structure.
 * @param {object} sop see sop_workflow.js
 * @returns {string} the complete word/document.xml
 */
function renderDocument(sop) {
  const parts = [];

  parts.push(titleBanner(sop.meta));
  parts.push(gap(GAP_AFTER_TITLE));
  parts.push(bodyParagraph(sop.intro));
  parts.push(gap(GAP_INNER));
  parts.push(legend());

  for (const stage of sop.stages) {
    parts.push(gap(GAP_SECTION));
    parts.push(stageHeader(stage));
    for (const block of stage.blocks) {
      parts.push(gap(GAP_INNER));
      if (block.type === 'checklist') {
        if (block.lead) parts.push(leadIn(block.lead));
        parts.push(checklist(block.items));
      } else if (block.type === 'callout') {
        parts.push(callout(block));
      } else {
        throw new Error(`unknown block type: ${block.type}`);
      }
    }
  }

  parts.push(gap(GAP_SECTION));
  parts.push(quickReference(sop.quickReference));
  parts.push(gap(GAP_SECTION));
  parts.push(para('', { topBorder: COLOR.navyDeep, spacing: [40, 80] }));
  parts.push(closingNote(sop.closing));

  return `${DOC_OPEN}<w:body>${parts.join('')}${SECT_PR}</w:body></w:document>`;
}

module.exports = { renderDocument, COLOR, MARKERS, esc };
