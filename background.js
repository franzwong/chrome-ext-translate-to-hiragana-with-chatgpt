import { HiraganaService } from './hiragana_service.js';

const _hiraganaService = new HiraganaService();

const menu_item_translate_to_hiragana = 'translate-to-hiragana';

const _options = {
    openAIApiKey: '',
};

let _translating = false;

function handle_runtime_installed() {
    console.debug('Add context menu items');
    chrome.contextMenus.create({
        id: menu_item_translate_to_hiragana,
        title: 'Translate to Hiragana',
        contexts: ['selection']
    });
}

async function handle_menu_item_translate_to_hiragana_clicked(_, tab) {
    if (_translating) {
        console.warn('Translation is in progress');
        return;
    }
    
    try {
        _translating = true;
        chrome.contextMenus.update(menu_item_translate_to_hiragana, {
            enabled: false
        });

        if (!_options.openAIApiKey) {
            // TODO: Show it in UI
            console.error('OpenAI API key is not configured');
            return;
        }

        const { text } = await chrome.tabs.sendMessage(tab.id, {
            type: 'get-selected-text',
        });
        await chrome.tabs.sendMessage(tab.id, {
            type: 'change-cursor',
            cursor: 'progress',
        });

        const translated_text = await _hiraganaService.translate(_options.openAIApiKey, text);

        await chrome.tabs.sendMessage(tab.id, {
            type: 'replace-selected-text',
            text: translated_text,
        });
        await chrome.tabs.sendMessage(tab.id, {
            type: 'change-cursor',
            cursor: 'auto',
        });
    } catch (e) {
        console.error(e);
    } finally {
        _translating = false;
        chrome.contextMenus.update(menu_item_translate_to_hiragana, {
            enabled: true
        });
    }
}

function handle_menu_item_clicked(info, tab) {
    console.debug('Menu item is clicked');
    if (info.menuItemId === menu_item_translate_to_hiragana) {
        handle_menu_item_translate_to_hiragana_clicked(info, tab);
    }
}

function handle_storage_changed(changes, _) {
    for (let [key, { newValue }] of Object.entries(changes)) {
        if (key === 'openAIApiKey') {
            _options.openAIApiKey = newValue;
            console.debug('OpenAI API key is updated.');
        }
    }
}

function background_main() {
    console.debug('background_main');

    // Must be executed outside async
    chrome.runtime.onInstalled.addListener(handle_runtime_installed);

    (async () => {
        console.debug('Loading options.');
        const options = await chrome.storage.sync.get({'openAIApiKey': ''});
        _options.openAIApiKey = options.openAIApiKey;

        chrome.contextMenus.onClicked.addListener(handle_menu_item_clicked);
        chrome.storage.onChanged.addListener(handle_storage_changed);
    })();
}

background_main();
