# Validation record

## Content checks

- 84 lesson objective entries, covering 61 distinct concepts, each have a dedicated question.
- 155 scored questions have valid options, answer keys, explanations, lesson links, and source references.
- Unit tests include 59 Levels, 59 Cell Biology, and 37 Concept 1 questions.
- Two ambiguous image exercises are preserved as discussions and excluded from scoring.
- Coverage distinguishes verified source PDF content from inherited, unverified cell page references.
- Original cell questions 8–10 were checked against their actual subjects so explanations link to the correct objectives.

## Browser and logic checks

- Nine course groups in the requested order; three live lesson cards and seven non-clickable pending groups. Cell Biology and Concept 1 remain separate in the same group.
- Individual learning anchors, plant/animal diagram selection, and source overview image.
- Studied marks, wrong answers, checked feedback, and active attempts survive refresh.
- Correcting a mistake removes it from the mistake pool. Retrying an empty pool shows an empty state.
- Incomplete exam submission returns to the first unanswered question.
- Original 96-question exam validated through the UI before this expansion. Its saved answers are retained when the question pool expands; new questions are appended, with no feedback before submission.
- All three unit tests contain their full question sets.
- Every Cell Biology objective route and all 43 source images are checked. The source PDF remains byte-for-byte intact.
- All 59 inline quiz questions were answered through the UI across the 47 objective pages. Wrong answers, saved drafts, checked feedback after refresh, resetting and correcting an answer, and shared mistake review were exercised.
- Animal and plant cell atlas selection was checked for all 15 markers. The plant membrane and wall markers were adjusted to the image's inner boundary and wall band in both lessons.
- The new lesson follows the existing dark Cell Atlas navigation, diagram-and-notes layout and course quiz controls. The atlas, objective pages and inline quiz were visually checked at desktop and 390-pixel mobile widths; 768- and 1024-pixel widths were checked for overflow.
- Interactive checks cover hypertonic/hypotonic/isotonic cases, six transport scenarios, and cube sizes 1, 2, 3 and 10.
- The source's misleading chloride diagram and other errors are explicitly clarified; plant-cell plasmolysis is included in the notes and question bank.
- Grading tested for all-correct, all-wrong, unanswered, and reversed question order.
- Desktop and 390-pixel mobile layouts, loaded images, and 200% text setting checked.
- No page JavaScript exceptions or failed site requests observed in the full local flow.

## Known limitation

The original 31-page Concept 1: Cell Theory and Organelles PDF/PPT remains absent. The supplied 43-page Cell Biology file is a different lecture and has been added independently. Its arrival does not verify the old lecture's page references. This limitation is visible in the site and coverage report.
