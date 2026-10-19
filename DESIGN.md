---
name: Warden Automations
description: Form WA-01, an automation application printed on security paper.
colors:
  security-paper: "#E6EAE3"
  paper-lift: "#EEF1EB"
  print-ink: "#151A27"
  ink-press: "#262D40"
  ink-soft: "#3D4557"
  ink-faint: "#596174"
  rule: "rgba(21, 26, 39, 0.26)"
  guilloche-green: "#6F8F80"
  rainbow-green: "#3E6E5E"
  stamp-violet: "#5B3BA6"
  stamp-violet-faded: "#9A86CF"
  registry-red: "#B3261E"
  scrollbar-sage: "#8A9284"
typography:
  display:
    fontFamily: "Archivo Variable, Archivo, system-ui, sans-serif"
    fontSize: "clamp(2.55rem, 6vw, 5rem)"
    fontWeight: 700
    lineHeight: 0.98
    letterSpacing: "-0.035em"
    fontVariation: "'wdth' 112"
  headline:
    fontFamily: "Archivo Variable, Archivo, system-ui, sans-serif"
    fontSize: "2.5rem"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.02em"
    fontVariation: "'wdth' 125"
  title:
    fontFamily: "Archivo Variable, Archivo, system-ui, sans-serif"
    fontSize: "26px"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.01em"
    fontVariation: "'wdth' 112"
  question:
    fontFamily: "Archivo Variable, Archivo, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 600
    lineHeight: 1.375
  body:
    fontFamily: "Archivo Variable, Archivo, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.6
  lead:
    fontFamily: "Archivo Variable, Archivo, system-ui, sans-serif"
    fontSize: "20px"
    fontWeight: 400
    lineHeight: 1.625
  answer:
    fontFamily: "Archivo Variable, Archivo, system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 500
    lineHeight: 2
  label:
    fontFamily: "Archivo Variable, Archivo, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "0.08em"
    fontVariation: "'wdth' 82"
  code:
    fontFamily: "Archivo Variable, Archivo, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 600
    fontFeature: "'tnum', 'lnum'"
  button:
    fontFamily: "Archivo Variable, Archivo, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 700
    letterSpacing: "0.06em"
    fontVariation: "'wdth' 125"
rounded:
  none: "0px"
  seal: "9999px"
spacing:
  gutter-mobile: "20px"
  gutter: "32px"
  grid-gap: "32px"
  row: "28px"
  section: "96px"
  section-lg: "128px"
  sheet: "1240px"
components:
  button-primary:
    backgroundColor: "{colors.print-ink}"
    textColor: "{colors.security-paper}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: "0 32px"
    height: "56px"
  button-primary-hover:
    backgroundColor: "{colors.ink-press}"
  button-primary-disabled:
    backgroundColor: "{colors.ink-soft}"
  button-header:
    backgroundColor: "{colors.print-ink}"
    textColor: "{colors.security-paper}"
    rounded: "{rounded.none}"
    padding: "0 16px"
    height: "40px"
  tick-box:
    backgroundColor: "{colors.paper-lift}"
    textColor: "{colors.stamp-violet}"
    rounded: "{rounded.none}"
    size: "22px"
  line-input:
    textColor: "{colors.stamp-violet}"
    typography: "{typography.answer}"
    rounded: "{rounded.none}"
    padding: "8px 0"
  step-numeral:
    textColor: "{colors.print-ink}"
    rounded: "{rounded.seal}"
    size: "48px"
  error-text:
    textColor: "{colors.registry-red}"
---

# Design System: Warden Automations

## Overview

**Creative North Star: "The Official Form on Security Paper"**

Every surface is one printed document: Warden's Form WA-01 on pale green-gray security paper, carrying a fine guilloche underprint, hairline rules, thick-thin double rules, square tick boxes and one round company seal (kaşe). Warden prints in blue-black ink; the visitor writes in violet stamp ink. The page reads as something to fill in and sign, not something to scroll past. The world rejects the category default of a near-black neon "AI network" hero over product cards.

Density is that of a well-set government form: a 12-column sheet, numbered rows separated by hairlines, labels pinned to what they describe, tabular numerals for every code. Colour is spent only on what matters now: violet only on the visitor's own marks, registry red only on evrak numbers and errors. Depth comes from print layering (underprint, ink, stamp), never from shadow or blur. The one dimensional object is the 3D guilloche rosette, a line drawing in the same inks that the visitor's answers re-form.

**Key Characteristics:**
- Security paper ground with a seamless 240x120 guilloche underprint at 6% ink opacity.
- One family, Archivo Variable; the width axis carries voice (125% / 112% / 100% / 82%).
- Zero radius everywhere except the round seal and the circled step numerals.
- Hairlines (1px), heavy section rules (2px) and the thick-thin double rule as the only structure.
- Violet is the visitor's ink; red is the registry's ink; everything else is print ink.

## Colors

Three inks on one paper: blue-black print, violet stamp, registry red, over a green-gray security ground with green guilloche.

### Primary
- **Print Ink** (print-ink): Everything Warden prints: headings, body, rules, tick-box frames, the seal in the header and footer, the primary button fill. Pressed state on buttons is **Ink Press** (ink-press).

### Secondary
- **Stamp Violet** (stamp-violet): Reserved for the visitor's own marks: tick strokes, typed answers, the evrak özeti values, the signature echo, the newest rosette strand, the sealed rosette, the ALINDI seal, focus outlines, caret and the progress fill. **Stamp Violet Faded** (stamp-violet-faded) is older visitor marks in the rosette only (newest mark is darkest); it is never text.

### Tertiary
- **Registry Red** (registry-red): Evrak (registry) numbers wherever they appear, and every error: field error text, invalid underline, the send-failure notice ruled above and below.

### Neutral
- **Security Paper** (security-paper): The page, header, sticky mobile progress strip, scene fog in the rosette and the theme colour.
- **Paper Lift** (paper-lift): Tick-box interior (50% at rest, full on hover).
- **Ink Soft** (ink-soft): Lead paragraphs, hints, secondary prose.
- **Ink Faint** (ink-faint): Labels, question numerals, row codes, optional markers, placeholders.
- **Rule** (rule): Hairlines between rows and cells; the 31/32px ruled lines inside textareas use print ink at 20%.
- **Guilloche Green** (guilloche-green): Green strands of the guilloche band and the rosette's inner flower. **Rainbow Green** (rainbow-green) is the far end of the rosette's ink-to-green rainbow print.
- **Scrollbar Sage** (scrollbar-sage): Scrollbar thumb, so the chrome belongs to the paper.

### Named Rules
**The Visitor's Ink Rule.** Violet appears only on marks the visitor made or caused. Warden never prints in violet; no Warden heading, button or decoration may use it.

**The Registry Ink Rule.** Red means the registry: evrak numbers and errors only. Users read red as error, so errors stay red even though the form is otherwise monochrome.

**The Newest Mark Rule.** The most recent visitor mark is the darkest; earlier marks fade to Stamp Violet Faded.

## Typography

**Display Font:** Archivo Variable (self-hosted via @fontsource-variable/archivo, width axis 62-125), with Archivo, system-ui fallback
**Body Font:** Archivo Variable
**Label/Mono Font:** Archivo Variable at 82% width; tabular lining numerals for codes

**Character:** One grotesque family made to speak in several official registers by its width axis alone: expanded for the issuing authority, semi-expanded for titles, normal for prose, condensed for form labels.

### Hierarchy
- **Display** (700, 2.55rem to 5rem across breakpoints, 0.98, -0.035em, width 112%): The H1 only.
- **Headline** (700, 2rem to 2.5rem; form title to 3.5rem, 1.02-1.05, -0.02em, width 125%): Section titles.
- **Title** (700, 22-34px, tight, -0.01em, width 112%): Form section heads (BÖLÜM A-D) and the receipt heading.
- **Question** (600, 17-19px, 1.375): Question labels, step statements, FAQ questions.
- **Body** (400, 17px, 1.6): Prose, max 36-64ch. **Lead** (400, 18-20px, relaxed, max 52-58ch) under headlines.
- **Answer** (500, 18px, 32px line, Stamp Violet): What the visitor types.
- **Label** (600, 12px, 0.08em, uppercase, width 82%): Cell keys, column heads, footer list heads.
- **Code** (600-700, 13-15px, tabular lining numerals): Question numbers, evrak numbers, example codes, counts, dates.
- **Button / Wordmark** (700-800, 13-15px, uppercase, 0.04-0.06em, width 125%): Buttons, the wordmark, the seal word.

### Named Rules
**The Width Is Voice Rule.** Hierarchy is carried by the wdth axis, not by a second family: 125% headings and wordmark, 112% H1 and section titles, 82% labels. Never add a display or mono face.

**The Tabular Code Rule.** Every number that identifies or counts (01-15, WA-2026/xxxxx, Ö-01, 8/15, dates) is set with tabular lining numerals.

## Layout

A single sheet, max 1240px, with 20px gutters on mobile and 32px from sm. Desktop uses a 12-column grid with 32px gaps: 7/5 for the first viewport (H1 and sector ticks / rosette), 4/8 for explanatory sections, 8/4 for the form with a sticky aside (rosette plus evrak özeti) at top 96px. Sections breathe at 96px vertical (128px from sm); the examples register is tighter. Inside the form, each question is a row: a 36-48px numeral column, then label, hint and control, 28px vertical padding, hairline beneath. Option sets lay out as 2-5 column grids of 44px-tall tick rows. Below lg the aside is replaced by a sticky bottom strip (mini rosette, answered count, evrak number, 3px progress bar), and scroll padding reserves 96px for it. Data tables collapse to a code column plus stacked cells on mobile.

## Elevation & Depth

Flat. There are no box shadows anywhere. Depth is print layering: the guilloche underprint sits under the ink, the ink sits under the visitor's stamp. The only perspective is the rosette: a three.js line drawing tilted about -0.78 rad, fogged into the paper colour, drawn strand by strand on entry and slowly turning.

### Named Rules
**The Printed Plane Rule.** Nothing floats. No shadows, gradients, glass or blur on interface elements; separation comes from rules and ink weight.

## Shapes

Square by default (0px radius): buttons, inputs, tick boxes, cells, the mobile strip. The only round forms are the kaşe seal (double ring with ring text, rubber-stamp speckle filter above 64px) and the circled step numerals (44-48px, 1.5px ink stroke). Lines are the material: 1px hairlines, 1.5px tick-box and numeral strokes, 2px heavy rules opening every section, and the 3px+1px double rule opening the form. Ticks are two hand-drawn pen strokes, not a check glyph. The guilloche band (6 interwoven sine strands, non-scaling 0.8px stroke) heads the page and the footer.

## Components

### Buttons
Heavy, stamped and square.
- **Shape:** square (0px).
- **Primary:** Print Ink fill, paper text, 56px tall, 32px side padding, expanded uppercase at 0.06em.
- **Hover / Focus:** fill shifts to Ink Press; active nudges 1px down; focus is a 2px Stamp Violet outline at 3px offset. Disabled while sending: Ink Soft fill, wait cursor.
- **Header variant:** same treatment at 40px tall, 13px. Mobile menu variant 48px, full width.
- **Text action:** 16px semibold ink, underlined, turns violet on hover.

### Tick Boxes
- **Style:** 22px square, 1.5px ink frame, Paper Lift at 50% (full on hover), label 16px ink beside it; whole row is a 44px target.
- **State:** checked draws a violet X in two pen strokes (0.16s each, second delayed 0.11s), overhanging the frame by 4px. Radio and checkbox look identical, as on a paper form.

### Inputs / Fields
- **Style:** underline only: transparent ground, 1px ink at 70% beneath, no radius, answer text in Stamp Violet. Textareas are ruled every 32px like ledger paper.
- **Focus:** underline thickens to 2px Stamp Violet; violet caret.
- **Error:** underline turns Registry Red and a 15px red message follows with role="alert".

### Navigation
Sticky paper header, 64px, 1px ink rule beneath: seal and expanded wordmark left, form code and red evrak number centre (xl), three 15px links (underline on hover) and the header button right. Mobile collapses to a menu toggle and a ruled list.

### Ruled Data Cells
Key-value cells (süre / soru / ücret; evrak no / tarih / soru) in a hairline grid: Label key in Ink Faint, Code value in 17px semibold.

### Kaşe Seal (signature)
Round company seal drawn in currentColor: ring text "WARDEN AUTOMATIONS · İSTANBUL · FORM WA-01", inner rosette or a central word. Print Ink in header and footer; Stamp Violet when it is the visitor's ALINDI receipt, dropped in at -9deg with a 0.42s stamp motion.

### Guilloche Rosette (signature)
A 3D torus-knot rosette of 16 outer strands (one per question) and 10 inner hypotrochoids. Answers re-form its geometry; each answered question turns a strand violet; submission seals it fully violet. Respects reduced motion by settling instantly.

### Evrak Özeti
Sticky summary ledger: numbered rows, short key in Ink Soft, the visitor's value in Stamp Violet or dotted leaders when empty, answered count top right.

## Do's and Don'ts

### Do:
- **Do** keep the page on Security Paper with the 240x120 guilloche underprint at 6% ink opacity.
- **Do** use Stamp Violet only for the visitor's own marks: ticks, typed answers, rosette strands, the signature echo, the ALINDI seal.
- **Do** use Registry Red for evrak numbers and for every error message and invalid field.
- **Do** set every code and count in tabular lining numerals.
- **Do** open sections with a 2px ink rule and the form with the thick-thin double rule.
- **Do** carry hierarchy with Archivo's width axis: 125% headings and wordmark, 112% H1 and section titles, 82% labels.

### Don't:
- **Don't** round corners; only the seal and the step numerals are round.
- **Don't** use cards, boxed panels or shadows; rows, rules and cells carry structure.
- **Don't** place eyebrows or kickers above headings.
- **Don't** use gradient fills or glass effects; the only colour transition is the rosette's rainbow print along its strands, and textarea ledger lines are rules, not fills.
- **Don't** add a second type family.
- **Don't** print Warden's own content in violet or decorate with red.
