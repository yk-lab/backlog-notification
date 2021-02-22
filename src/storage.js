'use strict';

export const spacesStrage = {
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

export const latestAssignedMeStrage = {
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
