'use strict';

// With background scripts you can communicate with popup
// and contentScript files.
// For more information on background script,
// See https://developer.chrome.com/extensions/background_pages

import { latestAssignedMeStrage } from './storage';
import { getMyIssues } from './backlogApi';
import { sha256 } from './utils';

(function () {
  const urls = {};
  chrome.alarms.onAlarm.addListener(function (alarm) {
    if (alarm.name == "BacklogNotificationAlarms_notifyAssignedMeIssues") {
      getMyIssues((requests, responses) => {
        latestAssignedMeStrage.get(latestAssignedMe => {
          console.log(latestAssignedMe);
          responses.map((response, i) => {
            const request = requests[i];
            sha256(`${request.domain}/${request.apiKey}`).then(digest => {
              let latestUpdated = 0;
              response.forEach(function (item) {
                const updated = Date.parse(item.updated);
                latestUpdated = Math.max(latestUpdated, updated);
                const url = `https://${request.domain}/view/${item.issueKey}`;
                if (digest in latestAssignedMe && latestAssignedMe[digest] < updated) {
                  chrome.notifications.create(
                    {
                      iconUrl: "./icons/icon_128.png",
                      type: "basic",
                      title: `${item.issueKey}: ${item.summary}`,
                      message: `${item.updatedUser.name} さんが更新しました`,
                      requireInteraction: true,
                    },
                    notificationId => {
                      urls[notificationId] = url;
                    }
                  );
                }
              });
              latestAssignedMe[digest] = latestUpdated;
            });
          });
          latestAssignedMeStrage.set(latestAssignedMe);
        });
      });
    }
  });

  chrome.notifications.onClicked.addListener(notificationId => {
    chrome.tabs.create({ active: true, url: urls[notificationId] });
    chrome.notifications.clear(notificationId, notificationId => {
      delete urls[notificationId];
    });
  });

  chrome.notifications.onClosed.addListener(notificationId => {
    delete urls[notificationId];
  });

  // 30分毎実行
  // TODO: 設定で実行間隔変更出来るようにする
  chrome.alarms.create("BacklogNotificationAlarms_notifyAssignedMeIssues", { "periodInMinutes": 30 });

})();
