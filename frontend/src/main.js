import './style.css'
import { sendMessage, generateImage } from './api.js'
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css'; // ou outro tema como 'atom-one-dark', 'monokai', etc.
import { marked } from 'marked';

function formatCodeBlocks(container) {
  container.querySelectorAll('pre code').forEach((block) => {
    hljs.highlightElement(block);
  });
}

document.querySelector('#app').innerHTML = `
  <nav class="navbar">
    <button class="tab-button" data-tab="chat">💬 Chatbot</button>
    <button class="tab-button" data-tab="image">🖼️ Gerar Imagem</button>
  </nav>

  <div class="tab-content" id="chat">
    <h2>Chat com IA</h2>
    <div class="chat-box" id="chatBox"></div>
    <div class="chat-input-container">
      <input id="chatInput" placeholder="Digite sua mensagem..." />
      <button id="sendChat">Enviar</button>
    </div>
  </div>

  <div class="tab-content hidden" id="image">
    <h2>Gerador de Imagem</h2>
    <div class="chat-input-container">
      <input id="imagePrompt" placeholder="Descreva a imagem..." />
      <button id="genImage">Gerar</button>
    </div>
    <div id="imageResultBox">
      <img id="imageResult" />
    </div>
  </div>
`

// Tab logic
document.querySelectorAll('.tab-button').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.add('hidden'))
    document.getElementById(btn.dataset.tab).classList.remove('hidden')
  })
})

// Chat logic
document.getElementById('sendChat').addEventListener('click', async () => {
  const input = document.getElementById('chatInput').value
  if (!input) return

  const chatBox = document.getElementById('chatBox')
  chatBox.innerHTML += `<div class="user-message"><strong>Você:</strong> ${input}</div>`

  const res = await sendMessage(input)
  chatBox.innerHTML += `<div class="bot-message"><strong>IA:</strong> ${res.response || res.error}</div>`

  document.getElementById('chatInput').value = ''
  chatBox.scrollTop = chatBox.scrollHeight
})

// Image generation logic
document.getElementById('genImage').addEventListener('click', async () => {
  const prompt = document.getElementById('imagePrompt').value
  const res = await generateImage(prompt)
  const img = document.getElementById('imageResult')

  if (res.image_url?.image) {
    img.src = `data:image/png;base64,${res.image_url.image}`
  } else {
    img.src = ''
    img.alt = res.error || 'Erro ao gerar imagem'
  }
})

function renderChatMessage(message) {
  const chatContainer = document.querySelector('#chat');

  const div = document.createElement('div');
  div.classList.add('chat-message');
  div.innerHTML = marked.parse(message); // Se a resposta vier em Markdown (use 'marked' ou similar)

  chatContainer.appendChild(div);
  formatCodeBlocks(div); // ⬅️ Aplica highlight.js
}

const buttons = document.querySelectorAll('.tab-button');
const contents = document.querySelectorAll('.tab-content');

buttons.forEach(button => {
  button.addEventListener('click', () => {
    const tab = button.dataset.tab;

    contents.forEach(content => {
      content.style.display = content.id === tab ? 'block' : 'none';
    });
  });
});
