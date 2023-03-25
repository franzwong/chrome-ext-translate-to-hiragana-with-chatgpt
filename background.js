const menu_item_translate_to_hiragana = 'translate-to-hiragana';
// TODO: Make it configurable
const open_api_key = '';

function handle_runtime_installed() {
    chrome.contextMenus.create({
        id: menu_item_translate_to_hiragana,
        title: 'Translate to Hiragana',
        contexts: ['selection']
    });
}

async function get_hiragana(text) {
    const payload = {
        'model': 'gpt-3.5-turbo',
        'messages': [{
            'role': 'user',
            'content': `Please change the next line to Hiragana\n${text}`
        }]
    };

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${open_api_key}`,
        },
        body: JSON.stringify(payload)
    });

    const body = await response.json();
    // TODO: Error handling
    return body.choices[0].message.content;
}

function handle_menu_item_clicked(info, tab) {
    console.log('Menu clicked');
    if (info.menuItemId === menu_item_translate_to_hiragana) {
        (async () => {
            const {text} = await chrome.tabs.sendMessage(tab.id, {
                type: 'get-selected-text',
            });

            // TODO: Error handling
            const hiragana = await get_hiragana(text);

            chrome.tabs.sendMessage(tab.id, {
                type: 'replace-selected-text',
                text: hiragana,
            });
        })();
    }
}

function background_main() {
    console.log('background_main');
    chrome.runtime.onInstalled.addListener(handle_runtime_installed);
    chrome.contextMenus.onClicked.addListener(handle_menu_item_clicked);
}

background_main();
