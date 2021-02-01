'use strict';

import './popup.css';

const { getMyIssues } = require('./backlogApi.js');

(function () {
  function init() {
    getMyIssues(response => {
      console.log(response);

      const issueList = document.getElementById('issueList');
      issueList.innerHTML = '';

      response.map(item => {
        const template = document.getElementById('listItem');

        const clone = template.content.cloneNode(true);
        clone.querySelector('.status').textContent = item.status.name;
        clone.querySelector('.issue-type').textContent = item.issueType.name;
        clone.querySelector('.issue-key').textContent = item.issueKey;
        clone.querySelector('.summary').textContent = item.summary;
        clone.querySelector('.updated').textContent = item.updated;
        clone.querySelector('.updated-user').textContent = item.updatedUser.name;
        issueList.appendChild(clone);
      });
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
