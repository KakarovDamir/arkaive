# Updated process_image function in api/ocr.py
import base64
from google.cloud import vision
from django.conf import settings
from django.http import JsonResponse

from api.gpt import enhance_text
from api.structured_content import create_structured_content
from api.text_analysis import analyze_text

# Initialize the Google Vision client
client = vision.ImageAnnotatorClient.from_service_account_json(settings.GOOGLE_CREDENTIALS_PATH)

def process_image(image_data):
    try:
        image = vision.Image(content=base64.b64encode(image_data).decode('utf-8'))

        response = client.document_text_detection(image=image)
        detections = response.text_annotations
        original_text = detections[0].description if detections else "No text detected"

        enhanced_text = enhance_text(original_text)

        analyzed_data = analyze_text(enhanced_text)
        structured_content = create_structured_content(analyzed_data)

        return {
            'status': 'success',
            'ocr': original_text,
            'enhancedText': enhanced_text,
            'analysis': analyzed_data,
            'structuredContent': structured_content,
        }
    except Exception as e:
        return {'status': 'error', 'message': str(e)}