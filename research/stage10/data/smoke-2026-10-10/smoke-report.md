# Stage 10A smoke run: smoke-2026-10-10

kit v2 @ 08fcefc 2026-10-07

**Stage 10A smoke run: the pipeline only.** The Stage 10 verdict is not evaluated and no metric is printed — nothing here is accuracy, repeatability or an F0 / F3dNoTip comparison.

- Calibration frames: 2; H1 profile built
- Captures named by the protocol: 8; annotated pairs: 2; poses accepted: 2
- N0: attempted 1, available 1, pose accepted 1, F0 and F3dNoTip both reached 1
- N1: attempted 1, available 1, pose accepted 1, F0 and F3dNoTip both reached 1

| pair | pose | profile mismatch px | frames reached | annotation paths | cuticle probe | full socket | notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| S1 N0 shot 1 | accepted | 113.4 | F0 F3dNoTip F3d F4 | base cuticlePass2 rigPose manualJoints rigManualJoints manualJointsPass2 rigManualJointsPass2 | yes | yes | — |
| S2 N1 shot 1 | accepted | 107.0 | F0 F3dNoTip F3d F4 | base cuticlePass2 rigPose manualJoints rigManualJoints manualJointsPass2 rigManualJointsPass2 | yes | no | — |

No protocol note.

**Problems:**
- MIRROR-S1-N0-V1-1: not a Stage 10 name (S<n>-<N0|N1>-<V1|V2>-<shot> or CAL-<n>), ignored
