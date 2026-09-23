#!/usr/bin/env node
'use strict';

// UptimePartsHub — Order Workflow SOP generator.
//
// This file is the single source of truth for the SOP. Edit the SOP_DATA
// structure below, re-run the script, and the .docx is rebuilt from scratch.
// Never hand-edit the generated .docx: the next run overwrites it.
//
//   node tools/sop/sop_workflow.js                 # write to the default path
//   node tools/sop/sop_workflow.js --out other.docx
//   node tools/sop/sop_workflow.js --check         # verify without writing
//
// Adding a stage is a matter of dropping an object into SOP_DATA.stages at the
// position you want it; numbering is whatever string you put in `number`, so
// half-steps like "2.5" are fine.

const fs = require('fs');
const path = require('path');
const { zip } = require('./lib/zip');
const { renderDocument, COLOR } = require('./lib/render');

const DEFAULT_OUT = path.join(
  process.env.USERPROFILE || process.env.HOME || '',
  'Documents',
  'UptimePartsHub',
  'SOP',
  'UptimePartsHub-Order-Workflow-SOP.docx'
);

// Stage accent colours cycle through the brand palette; pick whichever reads
// best next to its neighbours. Sub-stages share the colour of their parent.
const { navyDeep, navy, green, greenDeep, orange, slate } = COLOR;

const SOP_DATA = {
  meta: {
    brand: 'UPTIMEPARTSHUB',
    title: 'Order Workflow — Standard Operating Procedure',
    confidentiality: 'Internal Use Only  |  Not for Distribution',
    version: 'Version 1.0  |  September 2026',
    phase: 'Stage 2 — Manual Fulfilment',
    reviewTrigger: 'Review when first supplier agreement signed',
  },

  intro:
    'This SOP covers the end-to-end workflow for processing a partner order through ' +
    'UptimePartsHub in the current manual fulfilment stage. Follow each checklist in ' +
    'sequence. Tick each item as completed. Do not proceed to the next stage until all ' +
    'items in the current stage are checked.',

  stages: [
    {
      number: '01',
      title: 'ENQUIRY RECEIVED',
      subtitle: 'Buyer contacts via form, email, or referral',
      color: navyDeep,
      blocks: [
        {
          type: 'checklist',
          items: [
            {
              text: 'Check Formspree for new submission',
              note: 'Log in to formspree.io and review the latest submission details',
            },
            {
              text: 'Record enquiry in the Enquiry Tracker spreadsheet',
              note: 'Date, name, email, country, interest type, message summary',
            },
            {
              text: "Identify the buyer's primary interest",
              note: 'Drop-ship only, white label only, or both',
            },
            {
              text: 'Assess the enquiry quality',
              note: 'Is this a genuine buyer with a real business need, or likely spam or a competitor?',
            },
            {
              text: "Check the buyer's email domain",
              note: 'Look up the domain if unfamiliar. Flag any newly registered, parked, or suspicious domains.',
            },
            {
              kind: 'stop',
              text: 'Do not reveal UptimePartsHub supplier names or manufacturer relationships in any response',
            },
          ],
        },
        {
          type: 'callout',
          label: 'RESPONSE TIME',
          color: green,
          text: 'Aim to reply within 24 hours of receiving the enquiry. Same day is ideal for warm leads.',
        },
      ],
    },

    {
      number: '02',
      title: 'INITIAL REPLY SENT',
      subtitle: 'Qualify the buyer and gather requirements',
      color: navy,
      blocks: [
        {
          type: 'checklist',
          items: [
            { text: 'Reply to the buyer using the standard enquiry response template' },
            {
              text: 'Attach the UptimePartsHub Capability Overview Catalog PDF',
              note: 'Never attach the Stock Formula Summary — that is internal only',
            },
            {
              text: 'Ask the three qualifying questions',
              note: '1. What product categories? 2. What market? 3. Stock formula or custom?',
            },
            { text: 'Update Enquiry Tracker status to Active Conversation' },
            {
              text: 'Set a follow-up date in the tracker',
              note: 'If no reply in 5 business days, send a gentle follow-up',
            },
            {
              kind: 'stop',
              text: 'Do not quote specific pricing until supplier confirmation is received',
            },
            {
              kind: 'stop',
              text: 'Do not promise 0 MOQ — minimum is approximately 500 to 1,000 units on stock formulas',
            },
          ],
        },
      ],
    },

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
            { text: "Await the buyer's “I agree” reply before sending the Zoom link" },
            { text: 'Record NDA Confirmed (Yes or No) in the Enquiry Tracker' },
            {
              kind: 'stop',
              text: 'Do not send the Zoom link or any documents until the “I agree” reply is received',
            },
            { text: 'File the “I agree” email reply for records' },
          ],
        },
      ],
    },

    {
      number: '03',
      title: 'BUYER QUALIFIED',
      subtitle: 'Requirements confirmed, ready to source',
      color: green,
      blocks: [
        {
          type: 'checklist',
          items: [
            {
              text: "Confirm the following from the buyer's reply",
              note: 'Product category, target market, stock vs custom preference, timeline, price point if known',
            },
            {
              text: 'Match requirement to best available stock formula',
              note: 'Reference the UptimePartsHub Stock Formula Summary document',
            },
            {
              text: 'Identify the right supplier for the requirement',
              note: 'Currently: Makers Nutrition for gummies, capsules, powders, softgels, liquids',
            },
            {
              text: 'Contact the supplier to confirm availability, pricing, and lead time for the specific formula',
            },
            {
              kind: 'stop',
              text: 'Do not confirm anything to the buyer until supplier responds with real numbers',
            },
            { text: 'Update Enquiry Tracker status to Qualified' },
            { text: 'Note the supplier match in the tracker' },
          ],
        },
        {
          type: 'callout',
          label: 'SUPPLIER CONFIDENTIALITY',
          color: green,
          text:
            "Never share the supplier's name, website, or contact details with the buyer at " +
            'any stage. All supplier communication goes through Gil only.',
        },
      ],
    },

    {
      number: '04',
      title: 'PROPOSAL SENT TO BUYER',
      subtitle: 'Present options and indicative pricing',
      color: orange,
      blocks: [
        {
          type: 'checklist',
          lead: 'Before sending the proposal:',
          items: [
            { text: 'Obtain confirmed pricing from supplier including per unit cost at stated MOQ' },
            { text: 'Obtain confirmed lead time from supplier' },
            {
              text: 'Calculate UptimePartsHub margin',
              note: 'Add 15 to 40 percent margin on top of supplier wholesale price depending on product and volume',
            },
            {
              text: 'Prepare the proposal email with product options, indicative pricing, MOQ, and lead time',
            },
            {
              text: 'Include compliance credentials in the proposal',
              note: 'FDA registered, NSF audited, cGMP certified — do not name the manufacturer',
            },
          ],
        },
        {
          type: 'checklist',
          lead: 'Proposal email must include:',
          items: [
            { text: 'Product name and format (gummy, capsule, powder etc.)' },
            { text: 'Key ingredients and formula description' },
            { text: 'MOQ (minimum order quantity)' },
            { text: 'Indicative per unit price at MOQ' },
            { text: 'Lead time from order confirmation to first shipment' },
            { text: 'Label design options and process' },
            { text: 'Drop-ship fulfilment availability and any additional fees' },
            { text: 'Deposit requirement — 50 percent non-refundable to confirm order' },
            {
              kind: 'stop',
              text: 'Do not include supplier name, facility address, or any identifying manufacturer information',
            },
          ],
        },
        {
          type: 'checklist',
          items: [
            { text: 'Update Enquiry Tracker status to Proposal Sent' },
            { text: 'Set follow-up date for 3 business days if no reply' },
          ],
        },
      ],
    },

    {
      number: '05',
      title: 'ORDER CONFIRMED',
      subtitle: 'Buyer accepts proposal and pays deposit',
      color: greenDeep,
      blocks: [
        {
          type: 'checklist',
          items: [
            {
              text: 'Receive written order confirmation from buyer via email',
              note: 'This constitutes acceptance of UptimePartsHub Partner Order Terms and Conditions',
            },
            {
              text: 'Issue deposit invoice to buyer',
              note: '50 percent of total order value, non-refundable',
            },
            {
              kind: 'stop',
              text: 'Do not place order with supplier until deposit payment is received and cleared',
            },
            { text: 'Receive deposit payment confirmation' },
            {
              text: 'Send buyer the Partner Order Terms and Conditions document for signature if not already signed',
            },
            { text: 'Update Enquiry Tracker status to Won' },
            {
              text: 'Record order details in a new Order Log entry',
              note: 'Buyer name, product, quantity, formula, label details, delivery address, deposit amount, balance due',
            },
          ],
        },
        {
          type: 'callout',
          label: 'DEPOSIT RULE',
          color: green,
          text:
            "No exceptions — never place an order with the supplier before the buyer's deposit " +
            'clears. This is the primary financial protection for UptimePartsHub.',
        },
      ],
    },

    {
      number: '06',
      title: 'ORDER PLACED WITH SUPPLIER',
      subtitle: 'Coordinate production and fulfilment',
      color: navy,
      blocks: [
        {
          type: 'checklist',
          items: [
            {
              text: 'Contact supplier to place the order',
              note: 'Provide: formula, quantity, flavour, label artwork, drop-ship delivery address',
            },
            {
              text: "Send buyer's label artwork to supplier",
              note: 'Ensure artwork is in the correct format — AI, EPS, PSD, or high resolution PDF',
            },
            { text: 'Confirm production start date with supplier' },
            { text: 'Confirm expected completion and dispatch date with supplier' },
            {
              text: 'Relay timeline update to buyer without referencing supplier by name',
              note: "Say 'our manufacturing partner' not the supplier name",
            },
            { text: 'Request Certificate of Analysis from supplier once production is complete' },
            {
              kind: 'stop',
              text: "Do not share the supplier's dispatch confirmation email with the buyer",
              note: 'Forward tracking information only, not the original supplier email',
            },
          ],
        },
      ],
    },

    {
      number: '07',
      title: 'PRODUCT SHIPPED',
      subtitle: 'Fulfilment confirmed and balance collected',
      color: green,
      blocks: [
        {
          type: 'checklist',
          items: [
            { text: 'Receive dispatch confirmation from supplier' },
            { text: 'Extract tracking number from supplier communication' },
            {
              text: 'Send tracking number to buyer under UptimePartsHub name',
              note: 'Do not forward the original supplier email',
            },
            {
              text: 'Issue balance invoice to buyer',
              note: 'Remaining 50 percent of order value',
            },
            { text: 'Receive balance payment' },
            {
              text: 'Send Certificate of Analysis to buyer',
              note: 'Ensure CoA does not contain manufacturer name or facility address — request redacted version from supplier if needed',
            },
            { text: 'Send Compliance Statement letter if requested by buyer' },
            { text: 'Confirm buyer has received the shipment' },
            { text: 'Update Order Log with completion date and final payment received' },
          ],
        },
      ],
    },

    {
      number: '08',
      title: 'POST-ORDER FOLLOW UP',
      subtitle: 'Retain the buyer and build the relationship',
      color: slate,
      blocks: [
        {
          type: 'checklist',
          items: [
            { text: 'Follow up with buyer 7 days after delivery to confirm satisfaction' },
            { text: 'Ask for feedback on product quality, packaging, and delivery experience' },
            { text: 'Invite buyer to discuss next order or additional product categories' },
            {
              text: 'If buyer reports a quality issue, raise immediately with supplier',
              note: 'Buyer has 14 days from receipt to raise quality disputes per UptimePartsHub T&Cs',
            },
            {
              text: 'Update Enquiry Tracker with reorder potential and any notes from the follow-up conversation',
            },
            {
              text: 'Add buyer to a reorder follow-up list for 30 to 60 days',
              note: 'Based on their stated sales volume and stock levels',
            },
          ],
        },
      ],
    },
  ],

  quickReference: {
    title: 'QUICK REFERENCE — KEY RULES',
    rules: [
      'Never reveal the manufacturer name, website, or contact to any buyer at any stage',
      "Never place a supplier order before the buyer's deposit payment clears",
      'Never quote specific pricing before confirming with the supplier',
      'Never promise 0 MOQ — minimum is 500 to 1,000 units on stock formulas',
      'Never forward original supplier emails to buyers — extract only tracking numbers and CoA',
      'Always get written order confirmation from the buyer before proceeding',
      'Always send the Capability Catalog — never the Stock Formula Summary',
      'Always update the Enquiry Tracker after every buyer interaction',
      "Always request a redacted CoA if the manufacturer's name appears on the document",
    ],
  },

  closing:
    'This SOP reflects Stage 2 manual fulfilment operations. Review and update when the ' +
    'first formal supplier agreement is signed or when order volume exceeds 10 orders per month.',
};

// ─── build ───────────────────────────────────────────────────────────────────

const TEMPLATE_DIR = path.join(__dirname, 'template');

/** Assemble the .docx: static parts from template/, document.xml from data. */
function build(sop) {
  const order = JSON.parse(fs.readFileSync(path.join(TEMPLATE_DIR, '_partorder.json'), 'utf8'));
  const documentXml = renderDocument(sop);

  const entries = order.map(name => {
    if (name.endsWith('/')) return { name };
    if (name === 'word/document.xml') return { name, data: Buffer.from(documentXml, 'utf8') };
    const file = path.join(TEMPLATE_DIR, ...name.split('/'));
    if (!fs.existsSync(file)) throw new Error(`missing template part: ${name}`);
    return { name, data: fs.readFileSync(file) };
  });

  return { buffer: zip(entries), documentXml };
}

function parseArgs(argv) {
  const args = { out: DEFAULT_OUT, check: false };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--out') args.out = argv[++i];
    else if (argv[i] === '--check') args.check = true;
    else throw new Error(`unknown argument: ${argv[i]}`);
  }
  return args;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const { buffer, documentXml } = build(SOP_DATA);

  const stageCount = SOP_DATA.stages.length;
  const itemCount = SOP_DATA.stages.reduce(
    (n, stage) =>
      n + stage.blocks.reduce((m, b) => m + (b.type === 'checklist' ? b.items.length : 0), 0),
    0
  );

  if (args.check) {
    console.log(`ok — ${stageCount} stages, ${itemCount} checklist items, ` +
      `${documentXml.length} bytes of document.xml (nothing written)`);
    return;
  }

  // A stale lock file means the document is open in Word/LibreOffice, which
  // would silently overwrite whatever we write here the moment it is saved.
  const lock = path.join(path.dirname(args.out), `.~lock.${path.basename(args.out)}#`);
  if (fs.existsSync(lock)) {
    console.warn(
      `WARNING: ${path.basename(args.out)} appears to be open in Word/LibreOffice.\n` +
      '         Close it WITHOUT saving, or your editor will overwrite this rebuild.'
    );
  }

  fs.mkdirSync(path.dirname(args.out), { recursive: true });
  if (fs.existsSync(args.out)) fs.copyFileSync(args.out, `${args.out}.bak`);
  fs.writeFileSync(args.out, buffer);

  console.log(`wrote ${args.out}`);
  console.log(`  ${stageCount} stages, ${itemCount} checklist items, ${buffer.length} bytes`);
}

if (require.main === module) main();

module.exports = { SOP_DATA, build };
