'use client'
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Upload, FileText, Check, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import axios from 'axios'

export function HandwritingRecognitionComponent() {
  const [image, setImage] = useState<string | null>(null)
  const [recognizedText, setRecognizedText] = useState('')
  const [enhancedText, setEnhancedText] = useState('')
  const [analysisData, setAnalysisData] = useState({})
  const [structuredContent, setStructuredContent] = useState({})
  const [wordCount, setWordCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImage(e.target?.result as string)
        setError(null)
      }
      reader.readAsDataURL(file)
    }
  }

  const recognizeAndAnalyzeText = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const formData = new FormData()
      const inputElement = document.getElementById('image-upload') as HTMLInputElement
      if (inputElement && inputElement.files && inputElement.files[0]) {
        formData.append('file', inputElement.files[0])
      } else {
        throw new Error('No file selected')
      }

      // Отправка файла на сервер для распознавания текста и улучшения.
      const response = await axios.post('http://localhost:5000/api/ocr/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      const { ocr, enhancedText, analysis, structuredContent } = response.data;

      setRecognizedText(ocr)
      setEnhancedText(enhancedText)
      setAnalysisData(analysis)
      setStructuredContent(structuredContent)
      setWordCount(ocr.split(' ').length)
    } catch (err) {
      setError('Произошла ошибка при распознавании текста. Пожалуйста, попробуйте еще раз.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Загрузка и распознавание</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-center w-full">
          <label htmlFor="image-upload" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-10 h-10 mb-3 text-gray-400" />
              <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Нажмите для загрузки</span> или перетащите файл</p>
              <p className="text-xs text-gray-500">PNG, JPG или GIF (макс. 5MB)</p>
            </div>
            <input id="image-upload" type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
          </label>
        </div>
        
        {image && (
          <div className="mt-4">
            <img src={image} alt="Загруженное изображение" className="max-w-full h-auto rounded-lg shadow-lg" />
          </div>
        )}
        
        <Button onClick={recognizeAndAnalyzeText} disabled={!image || isLoading} className="w-full">
          {isLoading ? (
            <>
              <Progress value={33} className="w-full" />
              Распознавание...
            </>
          ) : (
            <>
              <FileText className="mr-2 h-4 w-4" /> Распознать текст
            </>
          )}
        </Button>
        
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Ошибка</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {recognizedText && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Распознанный текст:</h3>
            <Textarea value={recognizedText} readOnly className="w-full h-32" />
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Количество слов: {wordCount}</p>
              <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(recognizedText)}>
                <Check className="mr-2 h-4 w-4" /> Копировать текст
              </Button>
            </div>
          </div>
        )}

        {enhancedText && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Улучшенный текст:</h3>
            <Textarea value={enhancedText} readOnly className="w-full h-32" />
          </div>
        )}

        {structuredContent && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Структурированный контент:</h3>
            <pre className="w-full h-32 p-2 overflow-auto bg-gray-100 rounded-lg">{JSON.stringify(structuredContent, null, 2)}</pre>
          </div>
        )}
      </CardContent>
    </Card>
  )
}