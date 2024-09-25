/* eslint-disable */
'use client';

import { useState, ChangeEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, FileText, Check, AlertCircle, XCircle, Download } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import axios from 'axios';
import { useTranslations } from 'next-intl';
import NextImage from 'next/image';

export function HandwritingRecognitionComponent() {
  const t = useTranslations('Recognition');
  const [image, setImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [recognizedText, setRecognizedText] = useState('');
  const [enhancedText, setEnhancedText] = useState('');
  const [ocrData, setOcrData] = useState<any>(null);
  const [structuredContent, setStructuredContent] = useState<{ details: { names: string[], dates: string[], places: string[] }} | null>(null);
  const [wordCount, setWordCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'recognized' | 'enhanced' | 'structured'>('recognized');
  const [error, setError] = useState<string | null>(null);
  const [isResponseReceived, setIsResponseReceived] = useState(false);

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
        setError(null);
      };
      reader.readAsDataURL(selectedFile);
    }
  };


  const recognizeAndAnalyzeText = async () => {
    setIsLoading(true);
    setError(null);
    setIsResponseReceived(false);
    try {
      if (!file) {
        throw new Error('No file selected');
      }

      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post('https://back.navcer.cl/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const data = response.data;
      const { ocr, enhancedText, structuredContent } = response.data;

      setRecognizedText(ocr);
      setOcrData(data);
      setEnhancedText(enhancedText);
      setStructuredContent(structuredContent);
      setWordCount(ocr.split(' ').length);
      setIsResponseReceived(true);
      
      await downloadWordFile(); // Download word file from /to_docx endpoint

      // Additional request to /api/restore
      await restoreAndDownloadFile();
      
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(`Произошла ошибка при распознавании текста: ${err.response.data.message || err.response.data}`);
      } else {
        setError('Произошла ошибка при распознавании текста. Пожалуйста, попробуйте еще раз.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resetImage = () => {
    setImage(null);
    setFile(null);
    setRecognizedText('');
    setEnhancedText('');
    setStructuredContent(null);
    setWordCount(0);
    setError(null);
    setIsResponseReceived(false);
  };

  const downloadWordFile = async () => {
    if (!ocrData) {
      console.error('Данные OCR не были загружены');
      return;
    }

    try {
      const response = await axios.post('https://back.navcer.cl/api/to_docx', ocrData, {
        headers: { 'Content-Type': 'application/json' },
      });

      const fileUrl = response.data.file_url;

      // Создаем элемент ссылки для скачивания файла
      const link = document.createElement('a');
      link.href = fileUrl;
      link.setAttribute('download', 'structured_content.docx');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      setError(`Произошла ошибка при скачивании файла: ${error}`);
    }
  };

  const restoreAndDownloadFile = async () => {
    if (!ocrData) {
      console.error('Данные OCR не были загружены');
      return;
    }
    try {
      const response = await axios.post('https://back.navcer.cl/api/restore', ocrData, {
        headers: { 'Content-Type': 'application/json' },
      });

      const fileUrl = response.data.file_url;

      // Создаем элемент ссылки для скачивания файла
      const link = document.createElement('a');
      link.href = fileUrl;
      link.setAttribute('download', 'restored_content.docx');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      setError(`Произошла ошибка при восстановлении файла: ${error}`);
    }
  };

  const buttonClass = (isActive: boolean) =>
    `w-full py-1 text-center cursor-pointer ${isActive ? 'bg-white text-black' : 'bg-black text-white '} text-lg font-medium border-black rounded-t-2xl`;

  const extractStructuredContent = (data: { details: { names: string[], dates: string[], places: string[] } }) => {
    const names = data.details.names.join(', ') || 'Нет имен';
    const dates = data.details.dates.join(', ') || 'Нет дат';
    const places = data.details.places.join(', ') || 'Нет мест';

    return `Имена: ${names}\nДаты: ${dates}\nМеста: ${places}`;
  };

  return (
    <Card className="w-full bg-black text-white border-none">
      <CardContent className={`flex flex-col ${isResponseReceived ? 'lg:flex-row space-x-0 lg:space-x-6' : 'items-center'}`}>
        <div className="w-full lg:w-1/2">
          {!image && (
            <div className="flex items-center justify-center w-full">
              <label htmlFor="image-upload" className="flex flex-col items-center justify-center w-full h-64 border-dashed border-2 border-white cursor-pointer rounded-lg">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-10 h-10 mb-3 text-white" />
                  <p className="mb-2 text-sm text-white">
                    <span className="font-semibold">{t('upload')}</span> {t('upload2')}
                  </p>
                  <p className="text-xs text-gray-400">{t('upload3')}</p>
                </div>
                <input id="image-upload" type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
              </label>
            </div>
          )}

          {image && (
            <>
              <div className="mt-4 flex justify-center lg:justify-start">
                <div className="relative w-full max-h-80">
                  {typeof image === 'string' && image.startsWith('data:') ? (
                    <img src={image} alt="Загруженное изображение" className="w-full max-h-80 object-contain rounded-lg shadow-lg" />
                  ) : (
                    <NextImage src={image} alt="Загруженное изображение" layout="fill" objectFit="contain" className="w-full max-h-80 object-contain rounded-lg shadow-lg" />
                  )}
                </div>
              </div>

              <div className="flex justify-between mt-4">
                <Button onClick={recognizeAndAnalyzeText} disabled={isLoading} className="w-1/2 bg-blue-600 text-white mr-2">
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.937l3-2.646z"></path>
                      </svg>
                      {t('loading')}
                    </>
                  ) : (
                    <>
                      <FileText className="mr-2 h-4 w-4" /> {t('button1')}
                    </>
                  )}
                </Button>
                <Button onClick={resetImage} className="w-1/2 bg-black border-4 border-gray-800 text-white">
                  <XCircle className="mr-2 h-4 w-6" /> {t('button2')}
                </Button>
              </div>
            </>
          )}

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{t('error')}</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>

        {isResponseReceived && !isLoading && (
          <div className="w-full lg:w-1/2 mt-6 lg:mt-0">
            <div className="flex justify-center lg:justify-end">
              <div className={buttonClass(activeTab === 'recognized')} onClick={() => setActiveTab('recognized')}>
                {t('cat1')}
              </div>
              <div className={buttonClass(activeTab === 'enhanced')} onClick={() => setActiveTab('enhanced')}>
                {t('cat2')}
              </div>
              <div className={buttonClass(activeTab === 'structured')} onClick={() => setActiveTab('structured')}>
                {t('cat3')}
              </div>
            </div>

            <div className="bg-white p-2 rounded-b-2xl">
              {activeTab === 'recognized' && recognizedText && (
                <div className="space-y-2">
                  <Textarea value={recognizedText} readOnly className="w-full h-72 bg-white text-black border-none" />
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-sm text-gray-800">{t('count')} {wordCount}</p>
                    <Button variant="outline" size="sm" className="bg-blue-600 text-white" onClick={() => navigator.clipboard.writeText(recognizedText)}>
                      <Check className="mr-2 h-4 w-4" /> {t('copy')}
                    </Button>
                  </div>
                </div>
              )}

              {activeTab === 'enhanced' && enhancedText && (
                <div className="space-y-4">
                  <Textarea value={enhancedText} readOnly className="w-full h-80 bg-white text-black border-none" />
                </div>
              )}

              {activeTab === 'structured' && structuredContent && (
                <div className="space-y-4">
                  <Textarea value={extractStructuredContent(structuredContent)} readOnly className="w-full h-80 bg-white text-black border-none" />
                </div>
              )}
            </div>

            {structuredContent && (
              <Button onClick={downloadWordFile} className="w-full bg-green-600 text-white mt-4">
                <Download className="mr-2 h-4 w-4" /> {t('download')}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
