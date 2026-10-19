---
version: 1
slug: "src-app-tsx"
primary_target: "src/App.tsx"
related_targets: ["src/pages/WardenHome.tsx"]
---

# Surface brief: Warden Automations landing page

Scope: the single-page site (src/App.tsx and everything it renders). Visitor mode: Persuade.

Audience: Turkish SME owners and managers who suspect part of their business could run itself but cannot name which part. Job: decide whether Warden can build something useful for *their* company. Action: fill in the automation needs form (the working form, on the page; not a link elsewhere). Proof: the user's real n8n automation types shown as labelled examples; no invented metrics, clients or logos. Constraints: products section removed by the user; the site must not look AI-generated; a 3D animation is required; the form POSTs to an n8n webhook (VITE_N8N_WEBHOOK_URL).

Memorable moment: the visitor's own answers re-form a 3D guilloche security rosette, and submitting stamps the document with a violet company seal carrying their registry number.

Unresolved: how the analysis result reaches the visitor (assumed e-mail); KVKK aydınlatma metni text; webhook URL.

## Direction contract

THESIS: The whole page is one official document, Warden's automation application Form WA-01 printed on security paper; filling it in is the page's purpose. It refuses the category default of a near-black neon "AI network" hero over three product cards.

OWN-WORLD: Pale green-gray security paper with a fine guilloche underprint; blue-black print ink for everything Warden prints; violet stamp ink reserved for the visitor's own marks (answers, ticks, the seal); registry red only on evrak numbers. One family, Archivo: expanded caps for headings and the seal ring, normal width for text, tabular figures for codes. 1px hairlines, thick-thin double rules, square boxes, zero radius, one round kaşe seal.

STORY: The visitor recognises a form about their business, answers fifteen plain questions in about four minutes, watches their own rosette take shape, stamps it, receives a registry number and books the 15-minute call.

FIRST VIEWPORT: Document header strip (seal + wordmark left, form code and evrak number, three links, a black "Formu doldur" button). Left seven columns: H1 at ~5.5rem expanded, a two-line lead, then the live sector question as tick boxes that open the form. Right five columns: the 3D guilloche rosette at ~520px with one pinned annotation and leader line. Bottom ruled row: süre, soru sayısı, ücret.

FORM: Official document / kaşe and guilloche world, position 5 of 7 on the ordered list; seed:8874e7f79c303af8. Signature interaction: answers re-form the rosette; submission drops the seal. Raises — from the glazier partition: colour only on what matters now, so violet appears only on visitor marks. From the gravity garden: every input has a visible consequence. From the ink basin: the newest mark is the darkest. From the event display: labels pinned to what they describe, tabular numerals. From the event catalog: codes link examples to the form. From the design annual: one family, strict grid, hairlines.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
