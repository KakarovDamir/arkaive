import spacy
import re
import logging

logger = logging.getLogger(__name__)

nlp = spacy.load("en_core_web_sm")

def extract_dates(text):
    date_regex = r'\b(?:\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\b\d{4}\b)\b'
    return re.findall(date_regex, text)

def analyze_text(text):
    try:
        doc = nlp(text)
        names = [ent.text for ent in doc.ents if ent.label_ == "PERSON"]
        dates = extract_dates(text)
        places = [ent.text for ent in doc.ents if ent.label_ in ["GPE", "LOC"]]

        logger.info("Text analysis completed.")
        return {
            "attributes": {
                "names": names,
                "dates": dates,
                "places": places,
            }
        }
    except Exception as e:
        logger.error(f"Error in analyze_text: {str(e)}")
        raise Exception("Failed to analyze text.")
