'use strict';

import './popup.css';

const { getMyIssues } = require('./backlogApi.js');

(function () {
  function init() {
    getMyIssues((requests, responses) => {
      console.log(requests, responses);
      const issueList = document.getElementById('issueList');
      issueList.innerHTML = '';

      responses.map((response, i) => {
        const request = requests[i];
        response.map(item => {
          const template = document.getElementById('listItem');

          const clone = template.content.cloneNode(true);

          clone.querySelector('.status').textContent = item.status.name;
          clone.querySelector('.issue-type').textContent = item.issueType.name;
          clone.querySelector('.issue-key').textContent = item.issueKey;
          clone.querySelector('.summary').textContent = item.summary;
          clone.querySelector('.updated').textContent = item.updated;
          clone.querySelector('.updated-user').textContent = item.updatedUser.name;

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
  }

  document.addEventListener('DOMContentLoaded', init);
})();
