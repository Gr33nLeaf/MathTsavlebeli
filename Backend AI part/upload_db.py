import json
import os
from dotenv import load_dotenv
from supabase import create_client

# Setup
load_dotenv()
url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")

supabase = create_client(url, key)

# Read the JSON file
try:
    with open("database.json", "r", encoding="utf-8") as f:
        questions_data = json.load(f)
        print(f"Loaded {len(questions_data)} questions from file.")
except FileNotFoundError:
    print("Error: database.json not found. Did you run the ingestion script?")
    exit()

# Clean and Upload
# Sometimes Gemini returns weird keys. Let's make sure the keys match Supabase columns perfectly.
clean_data = []

for q in questions_data:
    clean_row = {
        "number": q.get("number"),
        "points": q.get("points"),
        "topic": q.get("topic", "General"),
        "type": q.get("type", "open_ended"),
        "latex": q.get("latex", ""),
        "options": q.get("options", []),
        "has_image": q.get("has_image", False),
        "image_url": ""
    }
    clean_data.append(clean_row)

# Insert into Supabase
print("Uploading to Supabase...")
response = supabase.table("questions").insert(clean_data).execute()

print("Success! Data uploaded.")