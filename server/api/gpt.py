from openai import OpenAI
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

OPENAI_API_KEY = settings.OPENAI_API_KEY
client = OpenAI(api_key=OPENAI_API_KEY)

def enhance_text(text):
    system_prompt = """
        Ты - эксперт в обработке текста.
        Ты можешь улучшать текст, исправляя ошибки и дополняя его по контексту.
        Ты должен быть точным и аккуратным. Отправляй только текст, без комментариев.
    """
    
    try: 
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Улучши текст: {text}"}
            ],
            temperature=0.5
        )
        enhanced_text = response.choices[0].message.content
        return enhanced_text
    except Exception as e:
         logger.error(f"Error in enhance_text: {str(e)}")
         raise Exception("Failed to enhance text with OpenAI.")