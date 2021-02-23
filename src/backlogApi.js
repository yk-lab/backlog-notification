'use strict';

import { spacesStore } from "./store";

const getMyIssuesUrl = function (domain, apiKey, userId) {
    return `https://${domain}/api/v2/issues?apiKey=${apiKey}&assigneeId[]=${userId}&sort=updated`;
};

export function getMyIssues(cb) {
    spacesStore.get(function (spaces) {
        if (spaces.length === 0) {
            window.alert('オプション画面で設定してください');
            return;
        }
        Promise
            .all(spaces.map(item => fetch(getMyIssuesUrl(item.domain, item.apiKey, item.userId))))
            .then(responses => Promise.all(responses.map(r => r.json())))
            .then(responses => cb(spaces, responses));
    });
}
