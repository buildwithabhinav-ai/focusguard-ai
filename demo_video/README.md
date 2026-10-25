# FocusGuard AI demo video (v2)

`../FocusGuard_AI_Demo.mp4` - 1920x1080, 30 fps, about 86 s. (`../FocusGuard_AI_Demo_v1.mp4` is the first version.)

Built from real screenshots of the running app (`capture.py`, `measure.py`), an animated HTML timeline
(`video.html`, `timeline.json`) rendered frame by frame (`render.py`) and a synthesised soundtrack (`music.py`).
Rebuild everything with `build_video.sh` (needs Playwright + Chrome, numpy/scipy and an ffmpeg binary: `FFMPEG=/path/to/ffmpeg`).

## AI background images (Higgsfield text-to-image) - slots are ready, images still missing
Higgsfield could not generate them: the account is on the free plan with 0 credits (gpt_image_2_5 needs "basic plan or higher").
Put 16:9 images (1920x1080 or larger) named as below into `assets/ai/` and run `build_video.sh`.
Each fades in behind its scene with slow parallax; behind the app windows it is blurred automatically. No code changes needed.

| File | Scene | Prompt (16:9) |
|---|---|---|
| intro.jpg | Opening | Abstract cinematic wide shot, glowing indigo and violet concentric light rings converging into one sharp bright point, deep navy background, volumetric light, fine particles, premium SaaS look, no text, no logos |
| problem.jpg | "Attention leaks" | Floating translucent app windows, browser tabs and notification bubbles dissolving into streaks of orange and pink light on a dark indigo background, shallow depth of field, no text, no logos |
| employee.jpg | Employee dashboard | Soft glowing glass dashboard panels floating in a dark indigo space, subtle bokeh, depth, minimal futuristic, no text |
| analytics.jpg | Analytics | Luminous abstract data waves and bar columns in indigo, violet and teal on a dark background, depth of field, elegant, no text |
| ai.jpg | AI insights | Abstract neural network of glowing nodes and light threads in violet and cyan on deep navy, cinematic, elegant, no text |
| extension.jpg | Chrome extension | Dark abstract browser tabs as floating glass cards connected by light trails, indigo and magenta glow, minimal, no text, no logos |
| superadmin.jpg | Super Admin | Abstract city of glowing glass towers seen from above at night, indigo and teal light, calm, premium, no text |
| subadmin.jpg | Sub Admin | A single glowing glass building amid soft light, indigo violet gradient, bokeh, minimal, no text |
| roles.jpg | Roles | Three soft glowing glass steps rising left to right, indigo violet teal gradient, bokeh, minimal futuristic, no text |
| outro.jpg | Closing | Calm horizon of soft indigo and magenta light over dark water, gentle lens flare, particles, premium, no text |

Cost with gpt_image_2_5: about 0.25 credit per image (about 2.5 credits for all ten). A 5 s AI video clip costs about 35 credits.

## Brand banners (v4)
`assets/banners/b1..b5.jpg` come from `FocusGuard-AI-banners.pdf` (five banners). b1, b3, b4 and b5 fly through the new
"Meet FocusGuard AI" showcase scene (13 s - 23 s); b2 ("Guard your focus. Ship your best work.") is the end card.
The video is now about 99 seconds (the app scenes are unchanged, shifted 10 s later).
