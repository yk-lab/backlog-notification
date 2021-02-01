'use strict';

const getMyIssues = function (cb) {
    chrome.storage.sync.get(['domain', 'apiKey', 'userId'], items => {
        if (!items.domain || !items.apiKey || !items.userId) {
            alert('オプション画面で設定してください');
            return;
        }
        const url = `https://${items.domain}/api/v2/issues?apiKey=${items.apiKey}&assigneeId[]=${items.userId}&sort=updated`;
        fetch(url, {method: "GET", mode: "no-cors"}).then(response => response.json()).then(response => cb(response));
    });
};

module.exports = {
    getMyIssues: getMyIssues,
};
