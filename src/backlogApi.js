'use strict';

// TODO: 切り替え
// import { spacesStrage } from "./storage";

const getMyIssuesUrl = function (domain, apiKey, userId) {
    return `https://${domain}/api/v2/issues?apiKey=${apiKey}&assigneeId[]=${userId}&sort=updated`;
};

const getMyIssues = function (cb) {
    chrome.storage.sync.get({ spaces: [] }, items => {
        const spaces = items.spaces;
        if (spaces.length === 0) {
            alert('オプション画面で設定してください');
            return;
        }
        Promise
            .all(spaces.map(item => fetch(getMyIssuesUrl(item.domain, item.apiKey, item.userId))))
            .then(responses => Promise.all(responses.map(r => r.json())))
            .then(responses => cb(spaces, responses));
    });
};

module.exports = {
    getMyIssues: getMyIssues,
};
