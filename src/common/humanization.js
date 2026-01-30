function tempoHumano() {
    let delay = Math.floor(Math.random() * (15000 - 5000 + 1)) + 5000;
    if (Math.random() < 0.1) delay += 15000; // 10% chance de adicionar +15s
    return delay;
}

const iniciadoresHumanizados = [
    "Opa",
    "Oi",
    "Hey",
    "E aí",
    "Olá",
    "Oi, tudo bem?",
    "...",
    "Bom dia",
    "Boa tarde",
    "Boa noite",
    "Fala",
    "Eaí",
    "Oi 🙂",
    "Oi!",
    "Oi 😄",
    "Olá 🙂",
    "Hmm",
    "Olá!",
    "Oi, oi",
    "Eaí 😎"
];

function iniciadorAleatorio() {
  const i = Math.floor(Math.random() * iniciadoresHumanizados.length);
  return iniciadoresHumanizados[i];
}

export { tempoHumano, iniciadorAleatorio };