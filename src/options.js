'use strict';

// https://developer.chrome.com/docs/extensions/mv2/options/
function save_options() {
    const domain = document.getElementById('DOMAIN').value;
    const apiKey = document.getElementById('API_KEY').value;
    const url = `https://${domain}/api/v2/users/myself?apiKey=${apiKey}`;
    fetch(
        url,
        {
            method: "GET",
            mode: "no-cors",
        }).then(
            response => response.json()
        ).then(
            response => {
                chrome.storage.sync.set({
                    apiKey: apiKey,
                    domain: domain,
                    userId: response.id,
                }, function () {
                    alert('保存しました');
                });
            }
        );
}

function restore_options() {
    chrome.storage.sync.get({
        apiKey: '',
        domain: '',
    }, function (items) {
        document.getElementById('DOMAIN').value = items.domain;
        document.getElementById('API_KEY').value = items.apiKey;
    });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('SAVE').addEventListener('click', save_options);