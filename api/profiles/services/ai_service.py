import logging
from openai import OpenAI 
from decouple import config

logger = logging.getLogger(__name__)

client = OpenAI(
    # base_url="https://integrate.api.nvidia.com/v1",
    base_url="https://api.aimlapi.com/v1",
    api_key=config("AIML_API_KEY") 
)
# print(config("AIML_API_KEY"))
def generate_ai_question(used_questions):
    """
    Generates a new speed dating question using AI, ensuring it doesn't repeat used questions.
    """
    try:
        # Format the used questions into a string
        used_questions_text = "\n".join([f"- {q}" for q in used_questions])

        messages = [
            {"role": "system", "content": "You are an AI designed to generate fun and engaging speed dating questions."},
            {
                "role": "user",
                "content": (
                    f"Generate a unique and interesting question for a speed dating conversation. "
                    f"DO NOT repeat any of these previously asked questions:\n\n{used_questions_text}"
                )
            }
        ]

        completion = client.chat.completions.create(
            model="deepseek/deepseek-r1",
            messages=messages,
            temperature=0.7,
            max_tokens=100
        )

        return completion.choices[0].message.content.strip()

    except Exception as e:
        logger.error(f"AI failed to generate a question: {e}")
        return None
