#include <metal_stdlib>
#include <SwiftUI/SwiftUI_Metal.h>
using namespace metal;

/// Living-water backdrop distortion.
/// - ambient: two crossed low-frequency sine fields give a slow caustic sway
/// - stir: a ring ripple expanding from the user's drag point, exponentially
///   damped in space and faded by `stirAmp` (the caller decays it over time)
[[ stitchable ]] float2 waterSway(
    float2 position,
    float time,
    float2 size,
    float strength,
    float2 stirCenter,
    float stirAmp
) {
    float2 uv = position / max(size, float2(1.0));

    float wave1 = sin(uv.y * 12.0 + time * 0.9) * cos(uv.x * 9.0 - time * 0.55);
    float wave2 = sin((uv.x + uv.y) * 7.0 - time * 0.4);
    float2 ambient = float2(wave1, wave2 * 0.7) * strength;

    float2 offset = ambient;
    if (stirAmp > 0.001) {
        float d = distance(position, stirCenter);
        float ring = sin(d * 0.045 - time * 7.0) * exp(-d * 0.0045) * stirAmp;
        float2 dir = d > 0.5 ? (position - stirCenter) / d : float2(0.0);
        offset += dir * ring;
    }
    return position + offset;
}
