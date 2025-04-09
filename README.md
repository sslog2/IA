# 🤖 IA Flask App with LLaMA3 & Hugging Face

Este projeto é uma aplicação Flask que utiliza o modelo LLaMA3 via Ollama para chat e o modelo da Hugging Face `stabilityai/stable-diffusion-xl-base-1.0` para geração de imagens.

## 📦 Pré-requisitos

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- Conta na [Hugging Face](https://huggingface.co/) com token de API válido

---

## 🔐 Configuração do `.env`

Crie um arquivo `.env` dentro da pasta `backend/` com o seguinte conteúdo:

```env
HF_API_TOKEN=your_huggingface_api_key_here
