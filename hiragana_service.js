export function HiraganaService() {
    this.openAIApiKey = '';
}

HiraganaService.prototype.get_hiragana = async function(text) {
    const payload = {
        'model': 'gpt-3.5-turbo',
        'messages': [{
            'role': 'user',
            'content': `Please change the next line to Hiragana\n${text}`
        }]
    };

    console.debug('Sending request to ChatGPT.');
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.openAIApiKey}`,
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        try {
            const body = await response.json();
            throw new Error(`Failed to send request to ChatGPT. Status code: ${response.status}. Error: ${body.error.message}`);
        } catch (e) {
            throw new Error(`Failed to send request to ChatGPT. Status code: ${response.status}. Error: ${e}`);
        }
    }

    const body = await response.json();
    return body.choices[0].message.content;
}
