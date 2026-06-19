# personalsit.es submission

This folder holds a prepared entry for adding ronbronson.design to
[personalsit.es](https://github.com/xdesro/personalsit.es). It is **not** part
of the deployed site — it's staged here for a manual submission.

## How to submit (do this yourself, by hand)

> **Important:** The personalsit.es maintainers actively close pull requests
> that look AI-generated. Open the PR yourself and write the description in
> your own words so it reads as a genuine, human contribution.

1. Fork `xdesro/personalsit.es`.
2. Copy `ronbronson.design.md` into the repo's `sites/` directory (so it lands
   at `sites/ronbronson.design.md`).
3. Commit and open a pull request from your fork.
4. Wait for a maintainer to review and approve. Once merged, the site shows up
   on personalsit.es.

## The entry

```md
---
title: 'Ron Bronson'
url: 'https://ronbronson.design'
tags: ['design', 'civic-tech', 'writing']
---
```

- `title` and `url` are the only required fields.
- `tags` are freeform — adjust them to taste.
- `rss` is optional and was left off: the blog's feed endpoints
  (`/rss/`, `/feed`, `/rss.xml`) all returned 404 at the time this was
  prepared. If you have a working feed URL, add a line like
  `rss: 'https://blog.ronbronson.com/your-feed-url'`.
