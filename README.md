# LifeScience 11

Course materials and interactive study pages for LifeScience 11.

Public site: https://yiyangd.github.io/LifeScience11/

## Included lessons

| Lesson | Learning objectives | Scored questions | Source verification |
| --- | ---: | ---: | --- |
| Levels of Organization Notes | 10 | 59 | Checked against the supplied 52-page PDF |
| Cell Biology | 47 | 59 | Checked against the supplied 43-page PDF |
| Concept 1 · Cell Theory and Organelles | 27 | 37 | Existing website checked; original 31-page source missing |
| Combined, distinct concepts | 61 | 155 | See counting rule and limitations below |

Two ambiguous original image exercises (Levels PDF pages 38 and 50) remain as unscored discussions in the original interactive practice. They are excluded from unit and combined test scores. All 43 original picture exercises and eight existing concept questions are retained. All ten original cell questions are retained, with 27 additional questions checking individual objectives.

The lessons contain 84 objective entries. The Cell Biology lecture explicitly links 23 repeated cell/structure concepts to Concept 1, giving 61 distinct named concepts after deduplication. Each lesson retains its complete details, examples and questions. These are grouped learning objectives, not counts of every individual factual statement. Shared-concept IDs are listed in the coverage table.

## Learning and assessment

- Course cards open interactive lessons in curriculum order.
- The checklist links every objective to its lesson and matching questions.
- Practice shows feedback immediately. Unit and combined tests delay score and explanations until all questions are submitted.
- Question order is shuffled while question IDs preserve answer alignment.
- Study marks, saved attempts, original practice answers, and mistakes persist in this browser using localStorage. They do not sync between devices or browsers.
- The seven remaining curriculum topics are clearly marked as pending.
- Cell Biology includes six interactive activities: a cell-theory timeline, structure/function matching, a secreted-protein route with playback, transport classification, osmosis predictions, and cell surface-area/volume calculations. The course homepage and lesson navigation link to the activity collection.
- The three sequencing/matching challenges support drag, click or keyboard controls, explanations, retry and saved activity state. Their practice results are separate from the scored quiz bank. Supplemental historical dates are identified and linked to OpenStax.
- Its cell atlas reuses the companion lesson's animal and plant diagrams with 15 selectable structure markers. The dark navigation, figure-and-notes layout, and quiz cards follow the existing course style.
- All 47 Cell Biology objective pages show their source figures beside readable notes and include an inline quiz. These use the same 59 question IDs as the unit test, with saved drafts, checked answers, explanations and shared mistake review.
- Its 43 source pages retain the original images and extracted text, with readable teaching notes and explicit corrections for source inaccuracies.
- When a combined test grows with new course material, previously saved answers are preserved and new questions are appended.

## Source coverage and limitations

See [the readable coverage table](docs/coverage.html) and [the complete mapping](docs/coverage.json). They include all 52 Levels PDF pages and all 43 Cell Biology pages, learning destinations, question IDs, and clarification notes. Cell Biology is a distinct lecture, not the missing 31-page Concept 1 source. Concept 1 page references therefore remain inherited and unverified. No editable original PowerPoint was available.

Original lesson assets, bilingual notes, corrective science notes, and cited sources are retained. The Levels lesson defaults to English and offers Chinese/bilingual display. The existing cell lesson retains its bilingual instruction; the unified assessments use English, matching the course source language.

## Local development

This is a static website with no build dependencies or backend.

```sh
node scripts/server.cjs
```

Open the URL printed by the server. Its `/LifeScience11/` prefix reproduces the GitHub Pages project path.

After editing source data or supplemental question banks:

```sh
node scripts/build-data.cjs
node scripts/verify.cjs
```

`course-data.js` and `docs/coverage.*` are generated from the retained lesson data and the question banks in `data/`. Retain generated files when publishing.

## Deployment

GitHub Pages publishes the `main` branch, repository root. `.nojekyll` keeps the static files intact. All asset links use relative paths and all application routes use fragments, so refreshing a lesson or test works under the repository path without a server rewrite.

## Validation

The content validator checks all objective/question references, unique question IDs, valid answer keys, local links and assets, and score correctness independent of question order. Browser checks exercise the combined exam, preservation of the original 96-question answers, new questions, saved attempts, immediate/delayed feedback, mistake recovery, unit pools, learning progress, lesson deep links, image interactions, and desktop/mobile layouts. Validation details are recorded in [docs/validation.md](docs/validation.md).
