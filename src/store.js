'use strict';

export const spacesStore = {
    get: cb => {
        chrome.storage.sync.get({ spaces: [] }, result => {
            cb(result.spaces);
        });
    },
    set: (value, cb) => {
        chrome.storage.sync.set(
            {
                spaces: value,
            },
            () => {
                cb();
            }
        );
    },
};

export const latestAssignedMeStore = {
    get: cb => {
        chrome.storage.sync.get({ latestAssignedMe: {} }, result => {
            cb(result.latestAssignedMe);
        });
    },
    set: (value, cb) => {
        chrome.storage.sync.set(
            {
                latestAssignedMe: value,
            },
            () => {
                cb();
            }
        );
    },
};
