function handle_runtime_message(message, _, sendResponse) {
    switch (message.type) {
        case 'get-selected-text': {
            const text = window.getSelection().toString();
            sendResponse({text});
        }
        break;
        case 'replace-selected-text': {
            const selection = window.getSelection();
            const range = selection.getRangeAt(0);
            range.deleteContents();
            range.insertNode(document.createTextNode(message.text));
        }
        break;
    }
}

function content_main() {
    console.log('content_main');
    chrome.runtime.onMessage.addListener(handle_runtime_message);
    
}

content_main();
