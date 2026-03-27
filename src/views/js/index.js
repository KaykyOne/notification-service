const statusText = document.querySelector('#status-text');
const statusBadge = document.querySelector('#status-badge');
const startedValue = document.querySelector('#started-value');
const authValue = document.querySelector('#auth-value');
const connectedValue = document.querySelector('#connected-value');
const feedback = document.querySelector('#feedback');
const disconnectReason = document.querySelector('#disconnect-reason');
const qrWrapper = document.querySelector('#qr-wrapper');
const qrPlaceholder = document.querySelector('#qr-placeholder');
const qrGrid = document.querySelector('#qr-grid');
const startButton = document.querySelector('#start-button');
const connectButton = document.querySelector('#connect-button');
const disconnectButton = document.querySelector('#disconnect-button');
const tabButtons = document.querySelectorAll('[data-tab-target]');
const tabPanels = document.querySelectorAll('.tab-panel');
const messageForm = document.querySelector('#message-form');
const phoneInput = document.querySelector('#phone-input');
const textInput = document.querySelector('#text-input');
const forAtInput = document.querySelector('#for-at-input');
const messageFeedback = document.querySelector('#message-feedback');
const submitMessageButton = document.querySelector('#submit-message-button');
const refreshMessagesButton = document.querySelector('#refresh-messages-button');
const messagesEmpty = document.querySelector('#messages-empty');
const messagesList = document.querySelector('#messages-list');

const statusMap = {
    idle: { label: 'Aguardando inicializacao', badge: 'Aguardando', badgeClass: 'badge-neutral' },
    starting: { label: 'Iniciando bot', badge: 'Iniciando', badgeClass: 'badge-warn' },
    authenticated: { label: 'Autenticado, aguardando sincronizacao', badge: 'Autenticado', badgeClass: 'badge-warn' },
    qr: { label: 'QR code disponivel para leitura', badge: 'QR ativo', badgeClass: 'badge-warn' },
    ready: { label: 'Bot conectado e pronto', badge: 'Conectado', badgeClass: 'badge-success' },
    disconnected: { label: 'Bot desconectado', badge: 'Desconectado', badgeClass: 'badge-danger' },
    restarting: { label: 'Tentando reconectar', badge: 'Reconectando', badgeClass: 'badge-warn' },
    auth_failure: { label: 'Falha de autenticacao', badge: 'Falha', badgeClass: 'badge-danger' },
    stopped: { label: 'Bot parado manualmente', badge: 'Parado', badgeClass: 'badge-neutral' },
    error: { label: 'Erro ao iniciar o bot', badge: 'Erro', badgeClass: 'badge-danger' }
};

let pendingStatus = false;
let pendingMessages = false;

function escapeHtml(value) {
    return String(value ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
}

function setFeedback(element, message, isError = false) {
    element.textContent = message ?? '';
    element.style.color = isError ? '#8f3131' : '';
}

function setBotButtons(disabled) {
    [startButton, connectButton, disconnectButton].forEach((button) => {
        button.disabled = disabled;
    });
}

function setMessageButtons(disabled) {
    submitMessageButton.disabled = disabled;
    refreshMessagesButton.disabled = disabled;
}

function activateTab(targetId) {
    tabButtons.forEach((button) => {
        button.classList.toggle('is-active', button.dataset.tabTarget === targetId);
    });

    tabPanels.forEach((panel) => {
        panel.classList.toggle('is-active', panel.id === targetId);
    });
}

function drawQr(matrix) {
    qrGrid.innerHTML = '';

    if (!Array.isArray(matrix) || matrix.length === 0) {
        qrWrapper.classList.add('qr-empty');
        qrPlaceholder.classList.remove('hidden');
        return;
    }

    qrWrapper.classList.remove('qr-empty');
    qrPlaceholder.classList.add('hidden');
    qrGrid.style.gridTemplateColumns = `repeat(${matrix.length}, 1fr)`;

    matrix.flat().forEach((filled) => {
        const cell = document.createElement('span');
        cell.className = `qr-cell${filled ? ' filled' : ''}`;
        qrGrid.appendChild(cell);
    });
}

function renderStatus(data) {
    const current = statusMap[data?.status] ?? statusMap.idle;

    statusText.textContent = current.label;
    statusBadge.textContent = current.badge;
    statusBadge.className = `badge ${current.badgeClass}`;

    startedValue.textContent = data?.iniciado ? 'Sim' : 'Nao';
    authValue.textContent = data?.autenticado ? 'Sim' : 'Nao';
    connectedValue.textContent = data?.conectado ? 'Sim' : 'Nao';

    disconnectReason.textContent = data?.ultimaRazaoDesconexao
        ? `Ultimo motivo de desconexao: ${data.ultimaRazaoDesconexao}`
        : '';

    drawQr(data?.qrMatrix);
}

function formatDate(value) {
    if (!value) return 'Sem agendamento';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat('pt-BR', {
        dateStyle: 'short',
        timeStyle: 'short'
    }).format(date);
}

function createBadgeClass(status) {
    if (status === 'SENT') return 'badge-success';
    if (status === 'FAILED') return 'badge-danger';
    if (status === 'SCHEDULED') return 'badge-warn';
    return 'badge-neutral';
}

function renderMessages(messages) {
    messagesList.innerHTML = '';

    if (!Array.isArray(messages) || messages.length === 0) {
        messagesEmpty.classList.remove('hidden');
        return;
    }

    messagesEmpty.classList.add('hidden');

    messages.forEach((message) => {
        const card = document.createElement('article');
        card.className = 'message-card';
        card.innerHTML = `
            <div class="message-card-header">
                <div>
                    <h3>${escapeHtml(message.phone)}</h3>
                    <div class="message-meta">
                        <span>Criada em: ${escapeHtml(formatDate(message.createdAt))}</span>
                        <span>Agendada para: ${escapeHtml(formatDate(message.forAt))}</span>
                    </div>
                </div>
                <span class="badge ${createBadgeClass(message.status)}">${escapeHtml(message.status)}</span>
            </div>
            <p class="message-text">${escapeHtml(message.text)}</p>
            <div class="message-card-actions">
                <button class="button button-danger" type="button" data-delete-id="${message.id}">Excluir</button>
            </div>
        `;
        messagesList.appendChild(card);
    });
}

async function fetchStatus(showError = false) {
    try {
        const response = await fetch('/whatsapp/status');
        const payload = await response.json();
        renderStatus(payload.data);
    } catch (error) {
        if (showError) {
            setFeedback(feedback, 'Nao foi possivel consultar o status do bot.', true);
        }
    }
}

async function fetchMessages(showError = false) {
    pendingMessages = true;
    setMessageButtons(true);

    try {
        const response = await fetch('/whatsapp/messages');
        const payload = await response.json();
        renderMessages(payload.data);
    } catch (error) {
        if (showError) {
            setFeedback(messageFeedback, 'Nao foi possivel carregar as mensagens.', true);
        }
    } finally {
        pendingMessages = false;
        setMessageButtons(false);
    }
}

async function callBotApi(url, options, successMessage) {
    pendingStatus = true;
    setBotButtons(true);
    setFeedback(feedback, 'Processando...');

    try {
        const response = await fetch(url, options);
        const payload = await response.json();

        if (!response.ok) {
            throw new Error(payload.message || 'Operacao falhou.');
        }

        if (payload.data) {
            renderStatus(payload.data);
        } else {
            await fetchStatus();
        }

        setFeedback(feedback, successMessage || payload.message || 'Operacao concluida.');
    } catch (error) {
        setFeedback(feedback, error.message || 'Nao foi possivel completar a operacao.', true);
    } finally {
        pendingStatus = false;
        setBotButtons(false);
    }
}

async function createMessage(event) {
    event.preventDefault();

    setMessageButtons(true);
    setFeedback(messageFeedback, 'Cadastrando mensagem...');

    try {
        const body = {
            phone: phoneInput.value.trim(),
            text: textInput.value.trim()
        };

        if (forAtInput.value) {
            body.forAt = new Date(forAtInput.value).toISOString();
        }

        const response = await fetch('/whatsapp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        const payload = await response.json();

        if (!response.ok) {
            throw new Error(payload.message || 'Nao foi possivel cadastrar a mensagem.');
        }

        messageForm.reset();
        setFeedback(messageFeedback, payload.message || 'Mensagem cadastrada com sucesso.');
        await fetchMessages();
    } catch (error) {
        setFeedback(messageFeedback, error.message || 'Nao foi possivel cadastrar a mensagem.', true);
    } finally {
        setMessageButtons(false);
    }
}

async function deleteMessage(id) {
    setMessageButtons(true);
    setFeedback(messageFeedback, 'Excluindo mensagem...');

    try {
        const response = await fetch(`/whatsapp/messages/${id}`, {
            method: 'DELETE'
        });
        const payload = await response.json();

        if (!response.ok) {
            throw new Error(payload.message || 'Nao foi possivel excluir a mensagem.');
        }

        setFeedback(messageFeedback, payload.message || 'Mensagem excluida com sucesso.');
        await fetchMessages();
    } catch (error) {
        setFeedback(messageFeedback, error.message || 'Nao foi possivel excluir a mensagem.', true);
        setMessageButtons(false);
    }
}

tabButtons.forEach((button) => {
    button.addEventListener('click', () => {
        activateTab(button.dataset.tabTarget);
    });
});

startButton.addEventListener('click', () => {
    callBotApi('/whatsapp/start', { method: 'POST' }, 'Bot iniciado. Se necessario, o QR code vai aparecer ao lado.');
});

connectButton.addEventListener('click', () => {
    callBotApi('/whatsapp/connect', { method: 'POST' }, 'Fluxo de conexao solicitado. Confira o QR code.');
});

disconnectButton.addEventListener('click', () => {
    callBotApi('/whatsapp/disconnect', { method: 'POST' }, 'Bot desconectado com sucesso.');
});

messageForm.addEventListener('submit', createMessage);

refreshMessagesButton.addEventListener('click', () => {
    fetchMessages(true);
});

messagesList.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    const messageId = target.dataset.deleteId;
    if (!messageId) return;

    deleteMessage(messageId);
});

fetchStatus(true);
fetchMessages(true);
setInterval(() => {
    if (!pendingStatus) {
        fetchStatus();
    }
    if (!pendingMessages) {
        fetchMessages();
    }
}, 6000);
