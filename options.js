const saveOptions = () => {
    const openAIApiKey = document.getElementById('openai_api_key').value;

    chrome.storage.sync.set(
        { openAIApiKey, },
        () => {
            const status = document.getElementById('status');
            status.textContent = 'Options saved.';
            setTimeout(() => {
                status.textContent = '';
            }, 750);
        }
    );
};

const restoreOptions = () => {
    chrome.storage.sync.get(
        {'openAIApiKey': ''},
        (options) => {
            document.getElementById('openai_api_key').value = options.openAIApiKey;
        }
    );
};

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);
