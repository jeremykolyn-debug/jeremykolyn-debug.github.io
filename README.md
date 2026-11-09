# Youth Resource Centre

A topic-neutral design prototype for a youth-focused "So What" web resource, built with Jekyll and hosted on GitHub Pages.

Live site: https://jeremykolyn-debug.github.io/

## Where to add your content

All written content lives in `_data/`. **Leave a field as `""` and the site shows a clearly marked placeholder**; fill it in and the real text appears. You don't need to touch any HTML.

| To change… | Edit | Notes |
|---|---|---|
| Site name and tagline | `_config.yml` → `title`, `subtitle` | Used in the header, footer and browser tab |
| Footer and credits (author, course, licence) | `_data/site.yml` → `project` | Navigation menus are here too |
| Home hero intro and "Why This Matters" | `_data/home.yml` | Theme cards come from the Explore chapters |
| Explore the Topic: intro and the 3 chapters | `_data/explore.yml` | Commentary, example, reflection question, image and related resources for each chapter |
| The 5 resource reviews | `_data/resources.yml` | One block per resource. Add a 6th by copying a block |
| Resource Library introduction | `_data/library.yml` | |
| Think Critically activities | `_data/activities.yml` | An activity becomes interactive once it has a `question` and `options` |
| Evaluating Sources discussion, criteria and methodology | `_data/evaluating.yml` | |
| About the Project sections | `_data/about.yml` | |
| Critical Reflection | `_data/reflection.yml` | |

### Writing longer text

Fields accept Markdown. For more than one paragraph, use `|` and indent the text:

```yaml
commentary: |
  First paragraph, with **bold** and a [link](https://example.org).

  Second paragraph.
```

### Resource links

Leave `url: ""` until you have confirmed the real address. While it is empty, the button reads "Link to be added" and is disabled. Once you add the URL, it becomes a working "Access resource" button that opens in a new tab.

### Review status

Each resource shows **Review pending** until every review field is filled in, then switches to **Review complete**.

### Resource type filter

Type filter buttons appear on the Resource Library page automatically once at least two different `type` values exist.

## How it's built

- `_layouts/yrc-base.html`, `_layouts/yrc-page.html`: the page shells
- `_includes/yrc/`: reusable components (header, footer, resource card and review, activity, placeholders, icons)
- `_sass/yrc/`: styles (`_tokens.scss` holds colours, type sizes and spacing)
- `assets/js/yrc.js`: mobile menu, reading progress, back-to-top, checklist, activities, filter
- `_pages/`: the page templates

The original Minimal Mistakes theme files are still in the repository and are unused by these pages, except `/sandbox/`.

## Preview and deploy

Every push to `master` rebuilds the site on GitHub Pages in about a minute. You can watch progress in the repository's **Actions** tab.

To preview locally, install Ruby, then run `bundle install` and `bundle exec jekyll serve`, and open http://localhost:4000.
