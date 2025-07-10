const apiKeyInput = document.getElementById('apiKey');
const gameSelect = document.getElementById('gameSelect')
const questionInput = document.getElementById('questionInput')
const askButton = document.getElementById('askButton')
const form = document.getElementById('form')
const aiResponse = document.getElementById ('aiResponse')

const markdownToHTML = (text) => {
    const converter = new showdown.Converter()
    return converter.makeHtml(text)
}

// AIzaSyCKQS8Z0Db_PN6rSZmdw1qCT-0mKJxSNmo

const perguntarIA = async (question, game, apiKey) => {
    const model = "gemini-2.5-flash"
    const geminiURL = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`

    let pergunta = ""
        
    if (game == 'Valorant') {
        pergunta = `
        ## Especialidade
        Você é um especialista em estratégias, picks de agentes e táticas para o jogo Valorant.
        ## Tarefa
        Responda perguntas sobre o meta atual, composições de time, agentes mais fortes e economia.
        ## Regras
        - Seja objetivo e direto.
        - Dê dicas de agentes, táticas por mapa e armas ideais.
        - Nunca invente informações ou mencione atualizações que não existem.
        - Responda em no máximo 500 caracteres, usando Markdown.
        - Data atual: ${new Date().toLocaleDateString()}
        ---
        Pergunta do usuário: ${question}
        `
    } else if (game === "csgo") {
        pergunta = `
            ## Especialidade
        Você é um especialista em CS:GO (Counter-Strike: Global Offensive), com foco em estratégias, armas e economia do jogo.

        ## Tarefa
        Responda perguntas sobre posições, táticas em mapas (como Mirage, Inferno, Dust2), armas ideais por situação e organização econômica.

        ## Regras
        - Responda em no máximo 500 caracteres, com dicas práticas e objetivas.
        - Use Markdown para formatar listas e destaques.
        - Não invente informações ou mencione updates não confirmados.
        - Data atual: ${new Date().toLocaleDateString()}

        ---
        Pergunta do usuário: ${question}
    `} else {
        pergunta = `
        ## Especialidade
        Você é um especialista assistente de meta para o jogo ${game}

        ## Tarefa
        Você deve responder as perguntas do usuário com base no seu conhecimento do jogo, estratégias, build e dicas

        ## Regras
        - Se você não sabe a resposta responda com 'Não sei' e não tente inventar uma resposta.
        - Se a pergunta não está relacionada ao jogo, responda com 'Essa pergunta não está relacionada ao jogo. 
        - Considere a data atual ${new Date().toLocaleDateString()}
        - Faça pesquisas atualizadas sobre o patch atual, baseado na data atual, para dar uma resposta coerente.
        -  - Nunca responda itens que você não tenha certeza de que existe no patch atual.

        ## Resposta
        - Economize na resposta, seja direto e responda no máximo 500 caracteres
        - Responda em markdown
        - Não precisa fazer nenhuma saudação ou despedida, apenas responda o que o usuário está querendo.

        ## Exemplo de resposta
        pergunta do usuário: Melhor build rengar jungle
        resposta: A build mais atual é: \n\n **Itens:**\n\n coloque os itens aqui.\n\n**Runas:**\n\nexemplo de runas\n\n

        ---
        Aqui está a pergunta do usuário: ${question}
    `
    
    const contents = [{
        role: "user",
        parts: [{
            text: pergunta
        }]
    }]

    const tools = [{
        google_search: {}
    }]

    // chamada API
    const response = await fetch(geminiURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            contents,
            tools
        })
    })

    const data = await response.json()
    return data.candidates[0].content.parts[0].text
}

const enviarFormulario = async (event)=> {
    event.preventDefault()
    const apiKey = apiKeyInput.value
    const game = gameSelect.value
    const question = questionInput.value

    if(apiKey == '' || game == '' || question == ''){
        alert('Por favor, preencha todos os campos')
        return
    }

    askButton.disabled = true;
    askButton.textContent = 'Perguntando...'
    askButton.classList.add('loading')

    try {
      const text = await perguntarIA(question, game, apiKey)
      aiResponse.querySelector('.response-content').innerHTML = markdownToHTML(text)
      aiResponse.classList.remove('hidden')
    } catch(error) {
        console.log('Erro:' , error)
    } finally {
        askButton.disabled = false
        askButton.textContent = 'Perguntar'
        askButton.classList.remove('loading')
    }

}
}
form.addEventListener('submit', enviarFormulario)