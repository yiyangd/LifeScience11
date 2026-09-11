# LifeScience 11

Course materials and interactive study pages for LifeScience 11.

Public site: https://yiyangd.github.io/LifeScience11/

## Included lessons

| Lesson | Learning objectives | Scored questions | Source verification |
| --- | ---: | ---: | --- |
| Levels of Organization Notes | 10 | 59 | Checked against the supplied 52-page PDF |
| Concept 1 · Cell Theory and Organelles | 27 | 37 | Existing website checked; original 31-page source missing |
| Combined | 37 | 96 | See limitations below |

Two ambiguous original image exercises (Levels PDF pages 38 and 50) remain as unscored discussions in the original interactive practice. They are excluded from unit and combined test scores. All 43 original picture exercises and eight existing concept questions are retained. All ten original cell questions are retained, with 27 additional questions checking individual objectives.

The count represents named learning objectives, grouping structure, function, and examples. Related statements across the units overlap, but the complete objectives have distinct requirements; no full objectives were removed during deduplication. This is not a count of every individual factual statement.

## Learning and assessment

- Course cards open interactive lessons in curriculum order.
- The checklist links every objective to its lesson and matching questions.
- Practice shows feedback immediately. Unit and combined tests delay score and explanations until all questions are submitted.
- Question order is shuffled while question IDs preserve answer alignment.
- Study marks, saved attempts, original practice answers, and mistakes persist in this browser using localStorage. They do not sync between devices or browsers.
- The seven remaining curriculum topics are clearly marked as pending.

## Source coverage and limitations

See [the readable coverage table](docs/coverage.html) and [the complete mapping](docs/coverage.json). The Levels mapping includes all 52 PDF pages, learning destinations, question IDs, and discussion status. An editable original PowerPoint was not available. Original cell PDF/PPT page references were inherited from the prior website and are explicitly unverified. Complete source coverage for the cell lesson cannot be claimed until the source is supplied.

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

The content validator checks all objective/question references, unique question IDs, valid answer keys, local links and assets, and score correctness independent of question order. Browser checks exercised the 96-question combined exam, saved attempts, immediate/delayed feedback, mistake recovery, unit pools, learning progress, lesson deep links, image interactions, and desktop/mobile layouts. Validation details are recorded in [docs/validation.md](docs/validation.md).
