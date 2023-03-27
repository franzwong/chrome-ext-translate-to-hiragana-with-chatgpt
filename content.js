// We need to save it to prevent user changing selection when making ChatGPT request
let range;

function handle_runtime_message(message, _, sendResponse) {
    switch (message.type) {
        case 'get-selected-text': {
            selection = window.getSelection();
            range = selection.getRangeAt(0);
            const text = selection.toString();
            sendResponse({text});
        }
        break;
        case 'replace-selected-text': {
            range.deleteContents();
            range.insertNode(document.createTextNode(message.text));
            range = null;
        }
        break;
    }
}

function content_main() {
    console.debug('content_main');
    chrome.runtime.onMessage.addListener(handle_runtime_message);
    
}

content_main();
