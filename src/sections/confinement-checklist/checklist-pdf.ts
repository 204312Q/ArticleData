import type { PDFFont, PDFPage } from 'pdf-lib';

import path from 'path';
import { readFile } from 'fs/promises';
import { rgb, PDFDocument, StandardFonts } from 'pdf-lib';

import {
  CHECKLIST_SECTIONS,
  CHECKLIST_ITEM_COUNT,
  USEFUL_DETAIL_FIELDS,
} from './checklist-data';

// ----------------------------------------------------------------------

// Printable A4 template. Built from the same CHECKLIST_SECTIONS as the web
// page, so editing the checklist text updates both.

const PAGE_W = 595.28;
const PAGE_H = 841.89;
const MARGIN = 36;
const GAP = 14;

const PRIMARY = rgb(0.91, 0.4, 0.5);
const PANEL = rgb(0.99, 0.91, 0.925);
const TEXT = rgb(0.13, 0.15, 0.17);
const MUTED = rgb(0.39, 0.43, 0.47);
const LINE = rgb(0.85, 0.87, 0.89);

const PHONE = '6914 9900';
const EMAIL = 'confinement@chillipadi.com.sg';

// Standard PDF fonts only cover WinAnsi; keep curly quotes readable and
// replace anything else unsupported so encoding never throws.
const UNSUPPORTED = new RegExp('[^\u0020-\u007E\u00A1-\u00FF\u2018\u2019\u201C\u201D]', 'g');
const clean = (text: string) => text.replace(UNSUPPORTED, '');

function wrap(text: string, font: PDFFont, size: number, maxWidth: number) {
  const lines: string[] = [];
  let line = '';
  clean(text)
    .split(' ')
    .forEach((word) => {
      const next = line ? `${line} ${word}` : word;
      if (font.widthOfTextAtSize(next, size) <= maxWidth) {
        line = next;
      } else {
        lines.push(line);
        line = word;
      }
    });
  if (line) lines.push(line);
  return lines;
}

type ChecklistPdfOptions = {
  /** Ticks, flattened in section order. Omit for a blank checklist. */
  done?: boolean[];
};

export async function buildChecklistPdf({
  done = [],
}: ChecklistPdfOptions = {}): Promise<Uint8Array> {
  // Flat index of each section's first item, to look up its tick.
  const sectionOffsets: number[] = [];
  CHECKLIST_SECTIONS.reduce((offset, section) => {
    sectionOffsets.push(offset);
    return offset + section.items.length;
  }, 0);
  const doneCount = done.filter(Boolean).length;

  const pdf = await PDFDocument.create();
  pdf.setTitle('Confinement Checklist: Getting Ready for Baby');
  pdf.setAuthor('Chilli Padi Confinement');

  const page: PDFPage = pdf.addPage([PAGE_W, PAGE_H]);
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

  // ---- Header band ----
  const headerH = 118;
  page.drawRectangle({ x: 0, y: PAGE_H - headerH, width: PAGE_W, height: headerH, color: PANEL });

  try {
    const logoBytes = await readFile(path.join(process.cwd(), 'public', 'logo', 'logo-full.png'));
    const logo = await pdf.embedPng(logoBytes);
    const scaled = logo.scale(38 / logo.height);
    page.drawImage(logo, {
      x: MARGIN,
      y: PAGE_H - MARGIN - scaled.height,
      width: scaled.width,
      height: scaled.height,
    });
  } catch {
    page.drawText('Chilli Padi Confinement', {
      x: MARGIN,
      y: PAGE_H - MARGIN - 14,
      size: 14,
      font: bold,
      color: PRIMARY,
    });
  }

  page.drawText('FREE PLANNING RESOURCE', {
    x: MARGIN,
    y: PAGE_H - 84,
    size: 8,
    font: bold,
    color: PRIMARY,
  });
  page.drawText('Getting ready for baby', {
    x: MARGIN,
    y: PAGE_H - 106,
    size: 22,
    font: bold,
    color: TEXT,
  });
  if (doneCount > 0) {
    const progress = `${doneCount} of ${CHECKLIST_ITEM_COUNT} done`;
    page.drawText(progress, {
      x: PAGE_W - MARGIN - bold.widthOfTextAtSize(progress, 10),
      y: PAGE_H - 60,
      size: 10,
      font: bold,
      color: PRIMARY,
    });
  }
  const sub = 'Your birth and confinement preparation checklist';
  page.drawText(sub, {
    x: PAGE_W - MARGIN - regular.widthOfTextAtSize(sub, 9),
    y: PAGE_H - 106,
    size: 9,
    font: regular,
    color: MUTED,
  });

  // ---- Checklist cards (two columns) ----
  const colW = (PAGE_W - MARGIN * 2 - GAP) / 2;
  const itemSize = 8.5;
  const itemLineH = 11.5;
  const textW = colW - 12 - 16 - 8;
  let cursorY = PAGE_H - headerH - 24;

  for (let row = 0; row < CHECKLIST_SECTIONS.length; row += 2) {
    const pair = CHECKLIST_SECTIONS.slice(row, row + 2);

    const laidOut = pair.map((section) => ({
      section,
      items: section.items.map((item) => wrap(item, regular, itemSize, textW)),
    }));
    const bodyH = (items: string[][]) =>
      items.reduce((sum, lines) => sum + lines.length * itemLineH + 7, 0) + 6;
    const rowH = 26 + Math.max(...laidOut.map((card) => bodyH(card.items)));

    laidOut.forEach((card, col) => {
      const x = MARGIN + col * (colW + GAP);
      const top = cursorY;
      const number = row + col + 1;

      page.drawRectangle({
        x,
        y: top - rowH,
        width: colW,
        height: rowH,
        borderColor: LINE,
        borderWidth: 0.75,
      });
      page.drawRectangle({ x, y: top - 26, width: colW, height: 26, color: PANEL });
      page.drawCircle({ x: x + 16, y: top - 13, size: 8, color: PRIMARY });
      const numStr = String(number);
      page.drawText(numStr, {
        x: x + 16 - bold.widthOfTextAtSize(numStr, 8) / 2,
        y: top - 16,
        size: 8,
        font: bold,
        color: rgb(1, 1, 1),
      });
      page.drawText(clean(card.section.title), {
        x: x + 30,
        y: top - 16,
        size: 9.5,
        font: bold,
        color: TEXT,
        maxWidth: colW - 36,
      });

      let y = top - 26 - 14;
      card.items.forEach((lines, itemIndex) => {
        const isDone = done[sectionOffsets[row + col] + itemIndex] === true;
        page.drawRectangle({
          x: x + 10,
          y: y - 7,
          width: 8,
          height: 8,
          borderColor: isDone ? PRIMARY : MUTED,
          borderWidth: 0.8,
        });
        if (isDone) {
          page.drawLine({
            start: { x: x + 11.5, y: y - 3.5 },
            end: { x: x + 13.5, y: y - 5.5 },
            thickness: 1.4,
            color: PRIMARY,
          });
          page.drawLine({
            start: { x: x + 13.5, y: y - 5.5 },
            end: { x: x + 18.5, y: y + 1.5 },
            thickness: 1.4,
            color: PRIMARY,
          });
        }
        lines.forEach((line, i) => {
          page.drawText(line, {
            x: x + 26,
            y: y - 6 - i * itemLineH,
            size: itemSize,
            font: regular,
            color: TEXT,
          });
        });
        y -= lines.length * itemLineH + 7;
      });
    });

    cursorY -= rowH + GAP;
  }

  // ---- Useful details: blank lines to fill in by hand ----
  const detailsH = 26 + USEFUL_DETAIL_FIELDS.length * 30 + 6;
  const detailsW = PAGE_W - MARGIN * 2;
  page.drawRectangle({
    x: MARGIN,
    y: cursorY - detailsH,
    width: detailsW,
    height: detailsH,
    borderColor: LINE,
    borderWidth: 0.75,
  });
  page.drawRectangle({ x: MARGIN, y: cursorY - 26, width: detailsW, height: 26, color: PANEL });
  page.drawText('Useful details', {
    x: MARGIN + 12,
    y: cursorY - 17,
    size: 10,
    font: bold,
    color: TEXT,
  });
  USEFUL_DETAIL_FIELDS.forEach((label, i) => {
    const y = cursorY - 26 - 22 - i * 30;
    page.drawText(clean(label), { x: MARGIN + 12, y, size: 8.5, font: regular, color: MUTED });
    const labelW = regular.widthOfTextAtSize(clean(label), 8.5);
    const lineStart = MARGIN + 12 + labelW + 8;
    const lineEnd = MARGIN + detailsW - 12;
    page.drawLine({
      start: { x: lineStart, y: y - 2 },
      end: { x: lineEnd, y: y - 2 },
      thickness: 0.6,
      color: LINE,
    });
  });
  cursorY -= detailsH + GAP;

  // ---- Reassurance note ----
  const note = 'One step at a time. You don’t need to have everything perfect. Start with the essentials and ask for help.';
  wrap(note, regular, 9, detailsW).forEach((line, i) => {
    page.drawText(line, { x: MARGIN, y: cursorY - 8 - i * 12, size: 9, font: regular, color: MUTED });
  });

  // ---- Footer ----
  page.drawLine({
    start: { x: MARGIN, y: 62 },
    end: { x: PAGE_W - MARGIN, y: 62 },
    thickness: 0.6,
    color: LINE,
  });
  page.drawText(`Tel ${PHONE}   |   ${EMAIL}`, {
    x: MARGIN,
    y: 46,
    size: 8.5,
    font: bold,
    color: PRIMARY,
  });
  page.drawText('A practical planning guide. Follow your hospital and care team’s advice.', {
    x: MARGIN,
    y: 33,
    size: 7.5,
    font: regular,
    color: MUTED,
  });

  return pdf.save();
}
