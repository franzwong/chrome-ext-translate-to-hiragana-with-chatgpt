function save_options() {
    const openAIApiKey = document.getElementById('openai_api_key').value;
    console.debug('save options.');
    chrome.storage.sync.set(
        { openAIApiKey, },
        () => {
            const status = document.getElementById('status');
            status.style.setProperty('display', 'block');
            setTimeout(() => {
                status.style.setProperty('display', 'none');
            }, 750);
        }
    );
}

function restore_options() {
    chrome.storage.sync.get(
        {'openAIApiKey': ''},
        (options) => {
            document.getElementById('openai_api_key').value = options.openAIApiKey;
        }
    );
}

function handle_form_submit(event) {
    event.preventDefault();
};

function option_main() {
    console.debug('option_main');

    document.addEventListener('DOMContentLoaded', restore_options);
    document.forms['main-form'].addEventListener('submit', handle_form_submit);
    document.getElementById('save').addEventListener('click', save_options);
}

option_main();
