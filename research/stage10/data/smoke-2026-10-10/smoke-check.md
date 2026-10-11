# Stage 10A — capture pipeline smoke check

Data: `research/stage10/data/smoke-2026-10-10` · kit 08fcefc 2026-10-07

**Plumbing only.** No accuracy, repeatability or F0/F3dNoTip conclusion is drawn from these photos, and none of them is used in Stage 10B.

| | check | status |
| --- | --- | --- |
| S1 | vision-dump.swift ran on the real photos | **PASS** |
| S2 | EXIF / orientation / mirroring | **PASS** |
| S3 | upright image and landmark coordinates agree | **LOOK** |
| S4 | annotation CSV and image coordinates agree | **PASS** |
| S5 | DIP / PIP / TIP landmark ids are the expected joints | **FAIL** |
| S6 | Layer A JSON passes the parser | **PASS** |
| S7 | the frozen analyzer reads the real data to the end, in N0 and in N1 | **PASS** |
| S8 | photos do not enter git | **PASS** |
| S9 | physical transfer: back at V1 after V2, nothing moved | **FAIL** |
| S10 | blind DIP / PIP path: crops, marks, back onto the upright image | **LOOK** |
| S11 | capture record: geometry, session log, capture times and order, lens | **PASS** |

## S1 — vision-dump.swift ran on the real photos: PASS

- CAL-01: 21/21 joints
- CAL-02: 21/21 joints
- MIRROR-S1-N0-V1-1: 21/21 joints
- S1-N0-V1-1: 21/21 joints
- S1-N0-V1-2: 21/21 joints
- S1-N0-V1-3: 21/21 joints
- S1-N0-V2-1: 21/21 joints
- S1-N0-V2-2: 21/21 joints
- S2-N1-V1-1: 21/21 joints
- S2-N1-V1-3: 21/21 joints
- S2-N1-V2-1: 21/21 joints

## S2 — EXIF / orientation / mirroring: PASS

- CAL-01: orientation 6, 3024x4032, handedness right/back, Vision chirality right
- CAL-02: orientation 6, 3024x4032, handedness right/back, Vision chirality right
- MIRROR-S1-N0-V1-1: negative control detected as mirrored (Vision chirality: right)
- S1-N0-V1-1: orientation 6, 3024x4032, handedness right/back, Vision chirality right
- S1-N0-V1-2: orientation 6, 3024x4032, handedness right/back, Vision chirality right
- S1-N0-V1-3: orientation 1, 4032x3024, handedness right/back, Vision chirality right
- S1-N0-V2-1: orientation 1, 4032x3024, handedness right/back, Vision chirality right
- S1-N0-V2-2: orientation 1, 4032x3024, handedness right/back, Vision chirality right
- S2-N1-V1-1: orientation 3, 4032x3024, handedness right/back, Vision chirality right
- S2-N1-V1-3: orientation 3, 4032x3024, handedness right/back, Vision chirality right
- S2-N1-V2-1: orientation 1, 4032x3024, handedness right/back, Vision chirality right

## S3 — upright image and landmark coordinates agree: LOOK

- every landmark is inside its image; open the *.overlay.svg files: the dots must sit on the joints, the index chain labels in order

## S4 — annotation CSV and image coordinates agree: PASS

- S1-N0-V1-1: cuticle at 0.68 of DIP -> TIP
- S1-N0-V2-1: cuticle at 0.56 of DIP -> TIP
- S2-N1-V1-1: cuticle at 0.68 of DIP -> TIP
- S2-N1-V2-1: cuticle at 0.66 of DIP -> TIP
- V1: the cuticle sits 0.51 (N0) and 0.47 (N1) PIP–DIP lengths past the DIP crease — the same skin fold should sit at about the same place; a tip's edge would sit further out (look at the N1 overlay)
- V2: the cuticle sits 0.54 (N0) and 0.52 (N1) PIP–DIP lengths past the DIP crease — the same skin fold should sit at about the same place; a tip's edge would sit further out (look at the N1 overlay)

## S5 — DIP / PIP / TIP landmark ids are the expected joints: FAIL

- S1-N0-V2-1: the MCPs are not ordered index -> pinky away from the thumb
- S1-N0-V2-2: the MCPs are not ordered index -> pinky away from the thumb
- S2-N1-V2-1: the MCPs are not ordered index -> pinky away from the thumb

## S6 — Layer A JSON passes the parser: PASS

- 11 observations parse; 2 also parse with the hand-marked bed merged in

## S7 — the frozen analyzer reads the real data to the end, in N0 and in N1: PASS

- calibration frames 2, H1 profile built; annotated pairs 2, poses accepted 2
- S1 N0: every stage ran (paths: base, cuticlePass2, rigPose, manualJoints, rigManualJoints, manualJointsPass2, rigManualJointsPass2)
- S2 N1: every stage ran (paths: base, cuticlePass2, rigPose, manualJoints, rigManualJoints, manualJointsPass2, rigManualJointsPass2)
- analyzer problem: MIRROR-S1-N0-V1-1: not a Stage 10 name (S<n>-<N0|N1>-<V1|V2>-<shot> or CAL-<n>), ignored

## S8 — photos do not enter git: PASS

- no image is tracked under research/, and none in the repository is addable

## S9 — physical transfer: back at V1 after V2, nothing moved: FAIL

- S1-N0-V1-3 vs V1-1: index finger 17.4% of PIP–DIP off after the palm fit; palm 445.9%, -91.29°, scale 0.44% (unmoved repeat V1-2: finger 7.3%, palm 7.7%) — the finger moved against the palm during the transfer
- S2-N1-V1-3 vs V1-1: index finger 7.2% of PIP–DIP off after the palm fit; palm 30.8%, -2.19°, scale -2.89% — the finger moved against the palm during the transfer
- S1-N0-V1-3: the camera endpoint did not return to the same position / orientation, or the whole hand moved (not separable without fixed marks)
- S2-N1-V1-3: the camera endpoint did not return to the same position / orientation, or the whole hand moved (not separable without fixed marks)

## S10 — blind DIP / PIP path: crops, marks, back onto the upright image: LOOK

- 8 crops in the key; S4 checks the mapped-back marks against Vision's joints
- open the crops of both passes: the DIP and PIP creases must be inside them, the nail and any tip must not

## S11 — capture record: geometry, session log, capture times and order, lens: PASS

- every photo: iPhone 17 back dual wide camera 5.96mm f/1.6, 52 mm (35 mm eq.)
- V1: main wide 5.96mm f/1.6, 2x sensor crop (52mm equiv in EXIF; iPhone 17 has no telephoto module), zoom 2, 40 cm, endpoint: phone propped on a box on the desk, aimed straight down; portrait for CAL and S1 V1-1/V1-2, landscape for S1 V1-3 and all of S2
- V2: main wide 5.96mm f/1.6, 2x sensor crop (52mm equiv in EXIF), zoom 2, 40 cm, endpoint: phone leaned against a box, oblique toward the thumb + fingertip side; tilt from vertical estimated from palm landmarks at 37-47 degrees across shots, landscape

