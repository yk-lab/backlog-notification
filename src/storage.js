'use strict';

const counterStorage = {
    get: cb => {
        chrome.storage.sync.get(['count'], result => {
            cb(result.count);
        });
    },
    set: (value, cb) => {
        chrome.storage.sync.set(
            {
                count: value,
            },
            () => {
                cb();
            }
        );
    },
};

// API KEY
// TODO: 複数持てるようにする
const apiKeyStorage = {
    get: cb => {
        chrome.storage.sync.get(['apiKey'], result => {
            cb(result.apiKey);
        });
    },
    set: (value, cb) => {
        chrome.storage.sync.set(
            {
                apiKey: value,
            },
            () => {
                cb();
            }
        );
    },
};

module.exports = {
    counterStorage: counterStorage,
    apiKeyStorage: apiKeyStorage,
};
