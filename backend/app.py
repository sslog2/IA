from flask import Flask, request, jsonify, render_template
import requests
import subprocess
import os
import base64
from dotenv import load_dotenv
from flask_cors import CORS

load_dotenv()

app = Flask(__name__)
CORS(app)

HF_API_TOKEN = os.getenv('HF_API_TOKEN')
HF_IMAGE_MODEL = 'stabilityai/stable-diffusion-xl-base-1.0'
OLLAMA_MODEL = 'llama3'
OLLAMA_HOST = 'http://ollama:11434'

@app.route('/generate-image', methods=['POST'])
def generate_image():
    prompt = request.json.get('prompt')
    if not prompt:
        return jsonify({'error': 'Prompt não fornecido'}), 400

    headers = {
        'Authorization': f'Bearer {HF_API_TOKEN}',
        'Content-Type': 'application/json',
    }
    data = {'inputs': prompt}

    response = requests.post(
        f'https://api-inference.huggingface.co/models/{HF_IMAGE_MODEL}',
        headers=headers,
        json=data
    )

    if response.headers.get('content-type') == 'image/png':
        image_bytes = response.content
        image_base64 = base64.b64encode(image_bytes).decode('utf-8')
        return jsonify({'image_url': {'image': image_base64}})

    if response.status_code == 200:
        try:
            # Algumas APIs da HF retornam a imagem em binário
            if response.headers.get('content-type', '').startswith('image/'):
                image_base64 = base64.b64encode(response.content).decode('utf-8')
                return jsonify({'image_url': {'image': image_base64}})
            return jsonify({'image_url': response.json()})
        except Exception as e:
            return jsonify({'error': f'Erro ao processar imagem: {str(e)}'}), 500
    else:
        try:
            return jsonify({'error': response.json()}), response.status_code
        except Exception:
            return jsonify({'error': response.text}), response.status_code


@app.route('/chat', methods=['POST'])
def chat():
    user_message = request.json.get('message')
    if not user_message:
        return jsonify({'error': 'Mensagem não fornecida'}), 400

    try:
        response = requests.post(
            f'{OLLAMA_HOST}/api/chat',
            json={
                'model': OLLAMA_MODEL,
                'messages': [
                    {'role': 'user', 'content': user_message}
                ],
                'stream': False  # 👈 isso resolve o problema!
            }
        )
        response_data = response.json()
        message = response_data['message']['content']
        return jsonify({'response': message})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
