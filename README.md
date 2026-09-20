# CueFour

Four-bar live pick-up / count-in desk for bedroom producers and AI-music finishers.

Suno and loop DAWs dump cold into the first downbeat of a section. The band (or the export) does not land together. Session players write four live bars of cue — kit click, bass root, nylon figure, piano door, count-in, brass call — so the section starts as a unit. CueFour seats live chairs on that cut, plays section-only vs cue + section, and exports a punch list.

Live samples only — FluidR3 acoustic grand, upright bass, nylon guitar, trumpet (lead stand-in), violin, and an acoustic kit from the PreEight sample CDN. No oscillators. Audio never leaves the tab.

## Distinct from yesterday and the rest of the line

| Tool | Job |
| --- | --- |
| OpenFour | Four-bar *song intro* walk-in |
| LiftTwo | Two bars of climb *into* the first hook |
| TagFour | Four-bar *last-line tag* that ends the record |
| PreEight | Eight bars *before* the hook |
| AfterHook | Eight bars *after* the hook as a floor / vamp |
| EndEight | Last eight bars of the record |
| LastHook | Last chorus is the money chorus |
| ModEight | Last-chorus key change |
| SteelFour | Four bars of open steel-string bed (yesterday) |
| CallFour | Four bars that *answer* the last sung line |
| **CueFour** | Four bars of *pick-up / count-in* so any section lands together |

Yesterday’s ship was SteelFour (steel-string bed under unfinished verses). CueFour is the missing door into a section: not an intro of the whole song, not a lift into the hook, not a tag that ends the record.

## Loop

1. Pick a groove (Amber Walk, Porch Climb, Fold Radio).
2. Hear **A · Section loop** — eight bars of the target section. It loops. No cue.
3. Stamp a cue recipe.
4. Hear **B · Cue + section** — four of cue, eight of section. Playback stops.
5. **4 · Cue only** isolates the pick-up for the export WAV.
6. Copy the punch list. Drop the idea on bars 1–4 of the unfinished section entrance.

Space plays B. Esc stops.

## Demo

`demo.mp4` — night scoring desk, four-bar cue grid, live chairs, section lands on 5.

## Pricing

**One-time $29 lifetime.** This is a finite desk, not a cloud meter.

Do not subscribe it. There is no stem server, no monthly sample library, no seat. Recurring billing belongs to AuraMix / MixForge / the Forge Pass ($9 tool or $24 bundle). CueFour should stay a buy-once utility, same family as LiftTwo ($29), TagFour ($29), OpenFour ($29), SteelFour ($29), BridgeEight ($29), and HookGrid ($39).

Sell it on **Lemon Squeezy** (merchant of record, VAT handled) as the primary checkout. Mirror on **Gumroad** for the producer crowd that already buys there. List on Product Hunt, r/WeAreTheMusicMakers, and a single X thread with the desk demo — not the App Store, not Plugin Boutique.

Optional later: include CueFour in Forge Pass at no extra charge. Never required for the core tool.

## Best place to sell

1. **Lemon Squeezy** — primary. Handles tax, EU VAT, payouts. Clean checkout for a $29 utility.
2. **Gumroad** — secondary mirror. Bedroom producers already trust one-time music-tool purchases there.
3. **Product Hunt + one focused X thread + r/WeAreTheMusicMakers** — discovery, not the storefront. Link straight to Lemon Squeezy.
4. Avoid App Store / Plugin Boutique for this class of tool; the value is the focused desk + punch list, not a plugin wrapper.

## Stack

Static HTML / CSS / JS desk (same pattern as TagFour and LiftTwo). Live FluidR3 samples via PreEight CDN. Deploy on Vercel team `release-forge`.

## License

MIT. Built for workinwithai-create.
