'use strict';

import './popup.css';

import { getMyIssues } from './backlogApi';
import { optionsStore } from './store';

(function () {
  function init() {
    load();
  }

  function load() {
    getMyIssues((requests, responses) => {
      optionsStore.get().then(options => {
        const issueList = document.getElementById('issueList');
        issueList.innerHTML = '';

        responses.map((response, i) => {
          const request = requests[i];
          response.map(item => {
            const template = document.getElementById('listItem');

            const clone = template.content.cloneNode(true);

            clone.querySelector('.space-domain').textContent = request.domain.split('.')[0];
            clone.querySelector('.issue-key').textContent = item.issueKey;
            clone.querySelector('.summary').textContent = item.summary;
            clone.querySelector('.updated-user').textContent = item.updatedUser.name;

            // TODO: 設定画面から言語を選択可能にする
            clone.querySelector('.updated').textContent = new Date(Date.parse(item.updated)).toLocaleString('ja-JP', { timeZone: options.timezone });

            // status
            clone.querySelector('.status').style.backgroundColor = item.status.color;
            clone.querySelector('.status span').textContent = item.status.name;
            clone.querySelector('.status span').style.color = item.status.color;

            // issue-type
            clone.querySelector('.issue-type').style.backgroundColor = item.issueType.color;
            clone.querySelector('.issue-type span').textContent = item.issueType.name;
            clone.querySelector('.issue-type span').style.color = item.issueType.color;

            // link
            const el_item = clone.querySelector('.item');
            el_item.dataset.issueUrl = `https://${request.domain}/view/${item.issueKey}`;
            el_item.addEventListener('click', function (e) {
              const url = this.dataset.issueUrl;
              chrome.tabs.create({ active: true, url: url });
            });

            issueList.appendChild(clone);
          });
        });
      });
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
