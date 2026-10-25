"""Synthesises the soundtrack (music + whooshes + click ticks) with numpy. No external assets."""
import json, wave
from pathlib import Path
import numpy as np
from scipy import signal

HERE = Path(__file__).parent
tl = json.load(open(HERE / "timeline.json"))
# scenes are authored in virtual time and sped up to "rdur"; convert everything to real time
_seg, _rs = [], 0.0
for _s in tl["scenes"]:
    _seg.append((_s["start"], _s["dur"], _rs, _s["rdur"])); _rs += _s["rdur"]
def real(v):
    for vs, vd, rs, rd in _seg:
        if v < vs + vd: return rs + (v - vs) * rd / vd
    return _rs
tl["clicks"] = [real(x) for x in tl["clicks"]]
tl["hits"] = [real(x) for x in tl["hits"]]
tl["whooshes"] = [real(x) for x in tl.get("whooshes", [])]
for _s, (vs, vd, rs, rd) in zip(tl["scenes"], _seg):
    _s["start"], _s["dur"] = rs, rd
_S = {x["name"]: x for x in tl["scenes"]}
T_PROB, T_ARCH, T_EXT = _S["problem"]["start"], _S["arch"]["start"], _S["ext"]["start"]
SR = 44100
TOTAL = tl["total"]
N = int(TOTAL * SR)
t = np.arange(N) / SR
rng = np.random.default_rng(11)
BPM = 100.0
BEAT = 60 / BPM
BAR = 4 * BEAT

def mix(dst, src, at):
    i = int(at * SR)
    j = min(N, i + len(src))
    if i < N and j > i:
        dst[i:j] += src[: j - i]

def midi(n): return 440.0 * 2 ** ((n - 69) / 12)

def env(n, a, d, sus=0.0, r=0.0):
    x = np.ones(n)
    na, nd = int(a * SR), int(d * SR)
    x[:na] = np.linspace(0, 1, max(na, 1))
    if nd:
        x[na:na + nd] = np.linspace(1, sus, nd)[: max(0, n - na)]
        x[na + nd:] = sus
    return x

def lowpass(x, fc, order=2):
    b, a = signal.butter(order, fc / (SR / 2), "low")
    return signal.lfilter(b, a, x)

def highpass(x, fc, order=2):
    b, a = signal.butter(order, fc / (SR / 2), "high")
    return signal.lfilter(b, a, x)

# chord progression Am - F - C - G (root, third, fifth, extension) as midi
CH = [[57, 60, 64, 67], [53, 57, 60, 64], [48, 55, 60, 64], [55, 59, 62, 66]]
ROOT = [45, 41, 48, 43]

L = np.zeros(N); R = np.zeros(N)
pad = np.zeros(N); bass = np.zeros(N); pluck = np.zeros(N); drums = np.zeros(N); fxl = np.zeros(N)

nbars = int(np.ceil(TOTAL / BAR))
for b in range(nbars):
    t0 = b * BAR
    ch = CH[b % 4]
    n = int(min(BAR + 1.2, TOTAL - t0) * SR)
    if n <= 0: break
    tt = np.arange(n) / SR
    v = np.zeros(n)
    for m in ch:
        f = midi(m)
        for det in (-0.07, 0.0, 0.07):
            ph = (f * 2 ** (det / 12) * tt) % 1
            v += (2 * ph - 1) * 0.5 + np.sin(2 * np.pi * f * tt) * 0.5
    v = lowpass(v, 1500 + 900 * np.sin(b * .7))
    e = np.minimum(tt / 0.9, 1) * np.where(tt > BAR, np.maximum(0, 1 - (tt - BAR) / 1.2), 1)
    mix(pad, v * e * 0.045, t0)

# bass (from 7s) - eighth notes on the root
for b in range(nbars):
    t0 = b * BAR
    if t0 < T_PROB: continue
    for k in range(8):
        at = t0 + k * BEAT / 2
        if at >= TOTAL - 3: break
        f = midi(ROOT[b % 4] - (12 if k % 4 == 3 else 0))
        d = int(0.32 * SR); tt = np.arange(d) / SR
        v = np.sin(2 * np.pi * f * tt) + 0.25 * np.sin(4 * np.pi * f * tt)
        mix(bass, v * np.exp(-tt * 7) * 0.17, at)

# arpeggio pluck (from 13s) - eighth notes
for b in range(nbars):
    t0 = b * BAR
    if t0 < T_ARCH or t0 > TOTAL - 4: continue
    ch = CH[b % 4]
    pattern = [0, 1, 2, 3, 2, 1, 2, 3]
    for k in range(8):
        at = t0 + k * BEAT / 2
        f = midi(ch[pattern[k]] + 12)
        d = int(0.5 * SR); tt = np.arange(d) / SR
        v = np.sin(2 * np.pi * f * tt) * np.exp(-tt * 6) + 0.4 * np.sin(4 * np.pi * f * tt) * np.exp(-tt * 11)
        amp = 0.075 * (1.0 if k % 2 == 0 else 0.7) * (0.6 if t0 < T_EXT else 1.0)
        mix(pluck, v * amp, at)

# intro bells (0-13s)
for b in range(nbars):
    t0 = b * BAR
    if t0 >= T_ARCH: break
    for k, idx in enumerate([3, 2, 1, 0]):
        f = midi(CH[b % 4][idx] + 24)
        d = int(1.6 * SR); tt = np.arange(d) / SR
        v = (np.sin(2 * np.pi * f * tt) + 0.3 * np.sin(2 * np.pi * f * 2.76 * tt)) * np.exp(-tt * 2.6)
        mix(fxl, v * 0.045, t0 + k * BEAT)

# drums
SC = {x['name']: x for x in tl['scenes']}
KICK_FROM, HAT_FROM, CLAP_FROM = SC['arch']['start'], SC['ext']['start'], SC['planner']['start']
OUTRO = SC['outro']['start']
DRUMS_END = OUTRO + 3.2   # the beat drops out for the final logo
kick_times = []
beat_idx = np.arange(int(TOTAL / BEAT))
for i in beat_idx:
    at = i * BEAT
    if KICK_FROM <= at < DRUMS_END and not (SC['roles']['start'] <= at < SC['roles']['start'] + 0.2):
        kick_times.append(at)
        d = int(0.38 * SR); tt = np.arange(d) / SR
        f = 48 + 90 * np.exp(-tt * 28)
        v = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 9)
        mix(drums, v * 0.5, at)
    if HAT_FROM <= at < DRUMS_END:
        for off, a in ((BEAT / 2, 0.5), (BEAT * 0.75, 0.22)):
            d = int(0.07 * SR); tt = np.arange(d) / SR
            h = highpass(rng.standard_normal(d), 7000) * np.exp(-tt * 70)
            mix(drums, h * 0.06 * a / 0.5, at + off)
    if CLAP_FROM <= at < DRUMS_END and i % 4 in (1, 3):
        d = int(0.2 * SR); tt = np.arange(d) / SR
        c = highpass(lowpass(rng.standard_normal(d), 5200), 900) * np.exp(-tt * 22)
        mix(drums, c * 0.14, at)

# sidechain the pad / pluck / bass to the kick
duck = np.ones(N)
for at in kick_times:
    i = int(at * SR); d = int(0.35 * SR); j = min(N, i + d)
    duck[i:j] = np.minimum(duck[i:j], 1 - 0.55 * np.exp(-np.arange(j - i) / SR * 9))
pad *= duck; bass *= duck; pluck *= (0.5 + 0.5 * duck)

# build / whoosh / ticks
sfx = np.zeros(N)
def whoosh(at, dur=0.9, up=True):
    d = int(dur * SR); tt = np.arange(d) / SR
    x = rng.standard_normal(d)
    fc = np.linspace(300, 7000, d) if up else np.linspace(7000, 300, d)
    out = np.zeros(d); blocks = 40
    for bk in range(blocks):
        s, e = d * bk // blocks, d * (bk + 1) // blocks
        out[s:e] = lowpass(x[s:e], float(fc[s]), 2)
    env_ = np.sin(np.pi * np.clip(tt / dur, 0, 1)) ** 1.5
    mix(sfx, out * env_ * 0.16, at)

for sc in tl["scenes"][1:]:
    whoosh(sc["start"] - 0.35)
whoosh(T_PROB - 1.4, 1.4)          # intro riser into the problem scene
for w in tl.get('whooshes', []):
    whoosh(w, 0.8)        # extra moves
for ck in tl["clicks"]:
    d = int(0.09 * SR); tt = np.arange(d) / SR
    mix(sfx, np.sin(2 * np.pi * 1900 * tt) * np.exp(-tt * 55) * 0.12, ck)
# impact hits (logo reveal, kinetic words, outro)
for h in tl.get("hits", []):
    d = int(1.6 * SR); tt = np.arange(d) / SR
    boom = np.sin(2 * np.pi * (38 + 90 * np.exp(-tt * 14)).cumsum() / SR) * np.exp(-tt * 3.0) * 0.55
    crash = highpass(rng.standard_normal(d), 3500) * np.exp(-tt * 6) * 0.07
    mix(sfx, boom + crash, h)
# final chord swell + hit on the logo reveal (outro)
for m in (45, 52, 57, 60, 64, 69):
    d = int(7.0 * SR); tt = np.arange(d) / SR
    v = np.sin(2 * np.pi * midi(m) * tt) * np.minimum(tt / 1.2, 1) * np.exp(-np.maximum(0, tt - 2.5) * 0.5)
    mix(fxl, v * 0.04, OUTRO)

dry = pad + bass + pluck + drums + fxl + sfx
# stereo width + reverb on pad/pluck/fx
ir_len = int(2.4 * SR)
ir = rng.standard_normal(ir_len) * np.exp(-np.arange(ir_len) / SR * 2.2)
ir = lowpass(ir, 5000)
wet_src = pad * 0.6 + pluck + fxl
wetL = signal.fftconvolve(wet_src, ir, mode="full")[:N] * 0.018
ir2 = np.roll(ir, 211) * np.where(rng.random(ir_len) > 0.5, 1, -1)
wetR = signal.fftconvolve(wet_src, lowpass(ir2, 5000), mode="full")[:N] * 0.018
delay = int(0.0135 * SR)
L = dry + wetL
R = np.roll(dry, delay) * 0.97 + wetR
R[:delay] = dry[:delay]
fade = np.minimum(t / 0.6, 1) * np.minimum((TOTAL - t) / 3.0, 1)
L *= fade; R *= fade
stereo = np.stack([L, R], 1)
stereo = np.tanh(stereo * 1.5) / np.tanh(1.5)
stereo *= 0.58 / np.max(np.abs(stereo))
pcm = (stereo * 32767).astype(np.int16)
out = HERE / "audio" / "soundtrack.wav"
out.parent.mkdir(exist_ok=True)
with wave.open(str(out), "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print("wrote", out, round(len(pcm) / SR, 1), "s")
