export const isAiTagSuggestionEnabled = import.meta.env.VITE_ENABLE_AI_TAG_SUGGESTION === 'true'

// 3D/2.5D レイヤー。既定 OFF。OFF のとき 3D は完全に消え、写真記録(L0)のみで成立する。
export const isNail3DEnabled = import.meta.env.VITE_ENABLE_NAIL3D === 'true'
