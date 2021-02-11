'use strict';

const getMyIssues = function (cb) {
    chrome.storage.sync.get({ projects: [] }, items => {
        const projects = items.projects;
        if (projects.length === 0) {
            alert('オプション画面で設定してください');
            return;
        }
        Promise.all(
            projects.map((item) => {
                const url = `https://${item.domain}/api/v2/issues?apiKey=${item.apiKey}&assigneeId[]=${item.userId}&sort=updated`;
                return fetch(url, { method: "GET", mode: "no-cors" }).then(response => response.json());
            })
        ).then(response => cb(projects, response));
    });
};

module.exports = {
    getMyIssues: getMyIssues,
};
