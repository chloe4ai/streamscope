# StreamScope

**A recommender you cannot evaluate is a ranked list with a percent sign on it.**

StreamScope unifies viewing history across Netflix, HBO Max, Hulu, Disney+ and Prime Video into one profile, reports where the hours actually went, and ranks a cross-platform catalog against it. The interesting part is not the ranking — it is that the ranking is simple enough to state in four lines, which is the precondition for grading it at all.

▶ **[Live demo](https://chloe4ai.github.io/streamscope/)** — no install; all data is mocked.

---

## The product argument

**1. The unification is the product; the recommendation is downstream of it.**
Five services each know a fifth of what you watch and none will tell the others. Everything StreamScope computes — category share of watch time, top actors and directors, platform split, peak hours, binge count — needs a joined history, and none of it exists inside any one app. The recommender is the cheapest demonstration that the joined view is worth having, not the reason to build it.

**2. The score is legible rather than good, and that is the deliberate order to do it in.**
`get_similarity_score()` is four terms — I would rather ship four terms I can argue about than an embedding model I cannot debug:

| Term | Contribution | Cap |
|---|---|---|
| Category affinity | `category_share_pct × 0.5` — share of your watch-hours in that category | 50 |
| Actor affinity | `min(actor_hours × 5, 30)` per matching cast member, summed | 30 each |
| Platform constant | flat `+5` on every candidate | 5 |
| Final | `min(total, 100)`, sorted descending, top `limit` (default 10) | 100 |

Two consequences worth naming. The platform term is labelled "novelty" in the code but is a **constant on every candidate**: it shifts all scores and changes no ordering — dead weight, not a diversity lever. And a single strong actor match can outweigh your dominant genre. Defensible rather than accidental, and exactly what an eval would settle.

**3. Every score ships with the sentence that produced it.**
The scorer returns `(score, reason)` together, and the reason is the first threshold the item crossed — `"You love Sci-Fi content"` above 20% category share, `"<Actor> is one of your favorites"` above 10 points of actor weight, else `"Popular on <platform>"`. An explanation generated separately from the score will eventually lie; here it cannot, because it is a byproduct of the arithmetic.

**4. Reports are built from watch-time, not from title counts.**
Categories, platforms, actors and directors are weighted by `watch_duration_minutes`, so an eight-hour season does not count the same as a trailer. A binge is a single entry of **≥180 minutes**, deduplicated to one per calendar day.

---

## How I would evaluate it

None of this exists yet — the honest state of the repo. In order:

- **Precision@10 and NDCG@10 against a temporal holdout.** Split each history at a timestamp, fit preferences on what came before, score the catalog, count how many titles actually watched afterwards land in the top 10. Temporal, not random — a random split leaks the future and flatters every recommender ever built.
- **"Good" means beating two baselines** — most-watched-category popularity, and random. A model that does not beat popularity is an expensive way to be popular, and the 94% on the demo screen means nothing until it does.
- **A calibration check.** The number reads as a probability and is not one. If "92% match" does not predict a higher watch-through rate than "84%", the percent sign is decoration and should be a rank.
- **Coverage.** With 20 catalog items and a flat platform bonus, the same few titles surface for nearly everyone. Distinct titles ever reaching a top 10 across simulated users says whether the scorer personalizes or memorizes.

**On the CTV adjacency, carefully.** Resolving one viewer across five walled gardens and reporting share of time and daypart is the same shape as cross-publisher CTV measurement, and `/api/user/{id}/reports` already emits platform share-of-time and an hour-of-day distribution. That is where it stops: no impressions, no ad pods, no household graph, no incrementality, nothing calibrated to a panel. A viewing-side analogue, not a measurement product.

## What's in it

| Surface | What it does |
|---|---|
| **Dashboard** | Watch time across platforms, category donut, weekly trend, top actors |
| **Reports** | Weekly / monthly / all-time — categories, top 10 actors, top 5 directors, platform split, peak hours, binge count |
| **Discover** | Ranked cross-platform recommendations with the reason and a deep link to the platform |

API: `GET /api/health`, `/api/user/{id}`, `/api/user/{id}/history`, `/api/user/{id}/reports?period=weekly|monthly|all`, `/api/user/{id}/recommendations`, plus `POST`/`PUT`/`DELETE` for users, platforms and history entries.

## Stack

Vanilla HTML/CSS/JS with hand-rolled SVG charts; FastAPI + SQLite backend; Docker Compose. The front end deploys to GitHub Pages on push to `main`.

```bash
docker-compose up                              # everything
# or: cd backend && pip install -r requirements.txt && python seed_data.py && uvicorn main:app --reload
```

Frontend on `:3000`, API on `:8000`; opening `frontend/index.html` directly runs the demo with no backend.

## What this is not

- **Not connected to anything.** Every platform is mocked; Netflix, WBD, Disney and Amazon all gate viewing history behind partner programs.
- **The live demo does not run the scorer.** `frontend/js/data.js` carries hardcoded `match_score` values (94, 91, 92 …) so the page works serverless; the formula above is what the *backend* computes. They should be one code path and are not.
- **The catalog is 20 hardcoded titles** in `recommendation.py` — enough to demonstrate ranking, far too few to evaluate it.
- **`user_platforms` is accepted and never used.** `generate_recommendations()` takes the argument and does not filter on it, so you can be recommended a service you do not subscribe to.
- **Cold start is random.** No history means `random.sample()` with a `random.uniform(70, 95)` score — a placeholder indistinguishable from a real recommendation, which is the worst property a placeholder can have.

## What I'd build next

- **The holdout harness above** on every commit against the popularity baseline, so a change to the scoring weights becomes a number instead of an opinion.
- **A real cold-start path** that asks for three titles instead of inventing a score, measured by completion versus abandonment.
- **Diversity as an actual term**, replacing the dead `+5`: penalize the platform already dominating your hours, measured as distinct-platform coverage in the top 10 rather than asserted in a comment.

## License

MIT — see [LICENSE](LICENSE).
