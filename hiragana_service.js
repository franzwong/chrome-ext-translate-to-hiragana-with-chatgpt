export function HiraganaService() {
    this.openAIApiKey = '';
}

HiraganaService.prototype.get_hiragana = async function(text) {
    const payload = {
        'model': 'gpt-3.5-turbo',
        'messages': [{
            'role': 'user',
            'content': 'I want you to be a translator. The text I send to you have Japanese text, digits and English characters. You only need to translate the Japanese text to Hiragana. Please keep digits and English characters as it is. Please only send me the translation.',
        }, {
            'role': 'assistant',
            'content': 'Sure, I can help you with that. Please provide me with the text you would like me to translate.',
        }, {
            'role': 'user',
            'content': `Please translate '${text}'.`,
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
