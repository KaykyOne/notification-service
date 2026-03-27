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

let pending = false;

function setFeedback(message, isError = false) {
    feedback.textContent = message ?? '';
    feedback.style.color = isError ? '#8f3131' : '';
}

function setButtons(disabled) {
    [startButton, connectButton, disconnectButton].forEach((button) => {
        button.disabled = disabled;
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

async function fetchStatus(showError = false) {
    try {
        const response = await fetch('/whatsapp/status');
        const payload = await response.json();
        renderStatus(payload.data);
    } catch (error) {
        if (showError) {
            setFeedback('Nao foi possivel consultar o status do bot.', true);
        }
    }
}

async function callApi(url, options, successMessage) {
    pending = true;
    setButtons(true);
    setFeedback('Processando...');

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

        setFeedback(successMessage || payload.message || 'Operacao concluida.');
    } catch (error) {
        setFeedback(error.message || 'Nao foi possivel completar a operacao.', true);
    } finally {
        pending = false;
        setButtons(false);
    }
}

startButton.addEventListener('click', () => {
    callApi('/whatsapp/start', { method: 'POST' }, 'Bot iniciado. Se necessario, o QR code vai aparecer ao lado.');
});

connectButton.addEventListener('click', () => {
    callApi('/whatsapp/connect', { method: 'POST' }, 'Fluxo de conexao solicitado. Confira o QR code.');
});

disconnectButton.addEventListener('click', () => {
    callApi('/whatsapp/disconnect', { method: 'POST' }, 'Bot desconectado com sucesso.');
});

fetchStatus(true);
setInterval(() => {
    if (!pending) {
        fetchStatus();
    }
}, 4000);
