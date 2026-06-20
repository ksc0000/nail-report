import { app } from './firebase'

export async function fileToGenerativePart(file: File): Promise<{ inlineData: { data: string, mimeType: string } }> {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      const result = reader.result as string
      resolve(result.split(',')[1])
    }
    reader.readAsDataURL(file)
  })
  
  return {
    inlineData: {
      data: await base64EncodedDataPromise,
      mimeType: file.type,
    },
  }
}

export async function urlToGenerativePart(url: string): Promise<{ inlineData: { data: string, mimeType: string } }> {
  const response = await fetch(url)
  const blob = await response.blob()
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      const result = reader.result as string
      resolve(result.split(',')[1])
    }
    reader.readAsDataURL(blob)
  })
  
  return {
    inlineData: {
      data: await base64EncodedDataPromise,
      mimeType: blob.type || 'image/jpeg',
    },
  }
}

export async function generateNailTagsFromImage(imagePart: { inlineData: { data: string, mimeType: string } }): Promise<string> {
  const prompt = "この画像を解析して、ネイルのスタイル、色、デザインに関する特徴を最大5つ、カンマ区切りで出力してください。出力はタグの文字列のみとし、前置きや説明は不要です。例: ピンク, フレンチ, ラメ, 夏, シンプル"
  const { getAI, getGenerativeModel, GoogleAIBackend } = await import('firebase/ai')
  const ai = getAI(app, { backend: new GoogleAIBackend() })
  const generativeModel = getGenerativeModel(ai, {
    model: 'gemini-2.5-flash-lite',
    generationConfig: {
      temperature: 0.7,
    },
  })
  
  const result = await generativeModel.generateContent([prompt, imagePart])
  const response = await result.response
  return response.text()
}
