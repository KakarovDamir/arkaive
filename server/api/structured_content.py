import logging

logger = logging.getLogger(__name__)

def create_structured_content(analyzed_data):
    try:
        attributes = analyzed_data["attributes"]
        logger.info("Creating structured content.")
        
        return {
            "summary": f"Найдено {len(attributes['names'])} имен, {len(attributes['dates'])} дат, и {len(attributes['places'])} мест.",
            "details": {
                "names": attributes["names"],
                "dates": attributes["dates"],
                "places": attributes["places"],
            }
        }
    except Exception as e:
        logger.error(f"Error in create_structured_content: {str(e)}")
        raise Exception("Failed to create structured content.")
