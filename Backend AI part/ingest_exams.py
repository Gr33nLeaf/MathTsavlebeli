import os
import json
import google.generativeai as genai
from PIL import Image
from dotenv import load_dotenv

# Setup
load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY")

genai.configure(api_key=api_key)
model = genai.GenerativeModel('gemini-2.5-flash-lite')

# The Prompt asking for JSON
prompt = """
Analyze this image of a math exam question. 
Extract the data into a JSON format with the following keys:

- "number": integer (The question number found near the score)
- "points": integer (The number inside the parenthesis at the start, e.g., (1) is 1 point)
- "topic": string (Infer the mathematical topic in georgian language, "ალგებრა", "გეომეტრია", "ალბათობა")
- "type": string (Determine if it is "multiple_choice" or "open_ended" based on whether options a/b/g/d exist)
- "latex": string (Include the text of the question in Georgian unchanged; write any math formulas in LaTeX format, use $$ for blocks; )
- "options": list of strings (If multiple choice, e.g., ["a) 5", "b) 7"]. If open_ended, return [])
- "has_image": boolean (True if there is a geometry figure, graph, or diagram)
- "image_url": string (Always return an empty string "" for now)

Return ONLY raw JSON. Do not use Markdown formatting (no ```json).
"""

def process_image(image_path):
    print(f"Processing {image_path}...")
    img = Image.open(image_path)
    response = model.generate_content([prompt, img])
    try:
        # Clean up code blocks if Gemini adds them
        clean_json = response.text.replace("```json", "").replace("```", "")
        return json.loads(clean_json)
    except:
        print(f"Error parsing JSON for {image_path}")
        return None

# Loop through screenshots
all_questions = []
folder_path = "./exam_screenshots"

for filename in sorted(os.listdir(folder_path)):
    if filename.endswith(".png") or filename.endswith(".jpg"):
        data = process_image(os.path.join(folder_path, filename))
        if data:
            all_questions.append(data)

# Save to file
with open("database.json", "w", encoding='utf-8') as f:
    json.dump(all_questions, f, ensure_ascii=False, indent=2)

print("Done! Database created.")