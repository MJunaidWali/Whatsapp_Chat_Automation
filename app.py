
from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()  # Load environment variables from .env

app = Flask(__name__)
CORS(app)  # Allows your extension to talk to this script

# --- CONFIGURATION ---
# Replace with your actual key or set it in your environment variables
# client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

@app.route('/', methods=['POST'])
def process_chat():
    try:
        data = request.json
        messages = data.get('messages', [])
        
        # Format history for context
        chat_context = "\n".join([f"{m['senderType']}: {m['text']}" for m in messages])
        
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system", 
                    "content": "You are a WhatsApp assistant. Based on the chat context, provide 3 distinct, short, and natural reply options. Format them as a numbered list (1., 2., 3.) with no other text."
                },
                {
                    "role": "user", 
                    "content": f"Chat History:\n{chat_context}"
                }
            ]
        )
        
        ai_text = response.choices[0].message.content
        return jsonify({"status": "success", "response": ai_text})

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    # Matching your pop.js fetch port
    app.run(debug=True, port=8000)