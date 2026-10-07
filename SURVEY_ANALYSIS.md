# Diaspora-Spend Survey — Analysis Guide

The `/survey` page is the highest-leverage validation instrument in the company plan.
It tests the load-bearing assumption: **what share of diaspora household spend currently
goes to diaspora businesses** — the pool our whole wedge (directory → featured →
transactions → SaaS) is built on.

## What each question measures

| # | Question | Measures | Field |
|---|----------|----------|-------|
| 1 | Last ~$100 of desi groceries — where? | Grocery share of wallet by channel | `grocery` |
| 2 | Last service need — where? | Service share of wallet by channel | `service` |
| 3 | How do you FIND a desi business? | Discovery-channel fragmentation (the wedge) | `discovery` |
| 4 | What would make you try a NEW desi business? (open text) | Objection / trigger language for copy + product | `trigger` |
| 5 | Order/book online in Nepali/Hindi? | Demand for the transaction layer (Phase 3) | `onlineIntent` |
| 6 | Zip (optional) | Geographic concentration for launch sequencing | `zip` |
| 7 | Language (optional) | Content/product language priority | `language` |
| 8 | Phone (optional, raffle) | Re-contact pool for interviews + raffle | `phone` |

Q1, Q2, Q3, Q5 are required. Everything else is optional to keep friction near zero.

## The key metric: diaspora share of spend

Responses land in `src/data/submissions.json` as `{ type: 'survey', ...fields }`.
Compute from all survey submissions (moderation status is irrelevant for surveys —
they're never published; analyze the raw set).

**Grocery diaspora share**
= (`hamro-listed` + `other-desi` + 0.5 × `mix`) / (all Q1 answers)

**Service diaspora share**
= `diaspora` / (`diaspora` + `mainstream`)
(`diy-friend` and `none` are excluded — they represent no spend, not mainstream spend.)

**Combined diaspora spend share** (the headline number)
= (grocery-diaspora-weighted + service-diaspora) / (countable Q1 + countable Q2)

**Supporting metrics**
- Fragmented discovery = (`whatsapp` + `facebook` + `friend`) / all Q3 answers
- Online intent = (`yes` + `maybe`) / all Q5 answers; and `yes` alone
- Q4 themes: hand-code the open text into 4–6 buckets (price, trust/reviews, language, convenience, quality, other) and report the top 2

```python
import json
from collections import Counter

subs = [s for s in json.load(open('src/data/submissions.json')) if s.get('type') == 'survey']
n = len(subs)
g = Counter(s['grocery'] for s in subs if s.get('grocery'))
v = Counter(s['service'] for s in subs if s.get('service'))

grocery_share = (g['hamro-listed'] + g['other-desi'] + 0.5 * g['mix']) / sum(g.values())
service_share = v['diaspora'] / (v['diaspora'] + v['mainstream']) if (v['diaspora'] + v['mainstream']) else 0
countable = sum(g.values()) + v['diaspora'] + v['mainstream']
combined = ((g['hamro-listed'] + g['other-desi'] + 0.5 * g['mix']) + v['diaspora']) / countable

d = Counter(s['discovery'] for s in subs if s.get('discovery'))
frag = (d['whatsapp'] + d['facebook'] + d['friend']) / sum(d.values())
o = Counter(s['onlineIntent'] for s in subs if s.get('onlineIntent'))
intent = (o['yes'] + o['maybe']) / sum(o.values())

print(f"n={n}  grocery diaspora share={grocery_share:.0%}  service diaspora share={service_share:.0%}")
print(f"COMBINED diaspora spend share={combined:.0%}  fragmented discovery={frag:.0%}  online intent={intent:.0%} (yes={o['yes']/sum(o.values()):.0%})")
```

## Target: 200+ responses

At n=200, a 50% proportion has a ±7% margin of error (95% confidence) — tight enough
to separate the decision bands below. Below n=100 the bands blur; treat anything
under 100 as directional only. Distribution: WhatsApp community groups, BCAP channels,
in-store QR codes at the 6 featured businesses, and the site CTA — track source if
possible (ask "where did you hear about this survey" only if a follow-up round needs it).

## Decision rule

Thresholds are judgment calls, set before seeing data:

**GREEN — validate, keep building the wedge** (all three):
1. Combined diaspora spend share **≥ 40%** — the community already spends with diaspora
   businesses; the demand pool is real.
2. Fragmented discovery **≥ 50%** — WhatsApp/Facebook/friend dominate; the discovery
   problem we solve is real.
3. Online intent (yes + maybe) **≥ 60%** — the transaction layer has a waiting audience.

**RED — kill or pivot the thesis** (any one):
1. Combined diaspora spend share **< 25%** — the community mostly spends mainstream;
   the "shop diaspora" demand pool is too thin for a venture-scale wedge.
2. Online intent "yes" **< 25%** — no real demand for online ordering/booking; the
   Phase-3 transaction layer has no pull. (Directory + ads can survive this; the
   platform turn cannot.)

**YELLOW — between the bands:** do not scale spend. Run 10–15 phone interviews from
the raffle pool, re-cut the data by zip, and re-test with a second distribution push
before any Phase-3 commitment.

## Biases to name when reporting

- **Self-selection:** respondents skew toward the engaged/community-connected; true
  diaspora share is likely *lower* than measured. Treat the number as a ceiling.
- **Priming:** Q1 option 1 and Q3 option 5 name Hamro Bazaar — expect a few points of
  inflation on those options; the metric uses channel groups, not brand options.
- **`mix` ambiguity:** counted at 0.5 diaspora; report the strict version
  (mix excluded) alongside if the headline sits near a decision band.
- **Raffle skew:** the phone-for-raffle incentive over-samples deal-seekers; fine for
  the spend question, discount it for willingness-to-pay reads.
- **Geography:** zip is optional — if <60% answer, do not claim Pittsburgh-wide
  representation; report it as South-Hills-weighted.
