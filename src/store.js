'use strict';

import { validate } from "json-schema";
import { optionsSchema } from "./schemas";

export const spacesStore = {
    get: cb => {
        chrome.storage.sync.get({ spaces: [] }, result => {
            cb(result.spaces);
        });
    },
    set: (value) => {
        return new Promise(function (resolve, reject) {
            chrome.storage.sync.set(
                {
                    spaces: value,
                },
                () => {
                    resolve();
                }
            );
        });
    },
};

export const latestAssignedMeStore = {
    get: cb => {
        chrome.storage.sync.get({ latestAssignedMe: {} }, result => {
            cb(result.latestAssignedMe);
        });
    },
    set: (value) => {
        return new Promise(function (resolve, reject) {
            chrome.storage.sync.set(
                {
                    latestAssignedMe: value,
                },
                () => {
                    resolve();
                }
            );
        });
    },
};

export const optionsStore = {
    get: () => {
        return new Promise(function (resolve, reject) {
            chrome.storage.sync.get({ options: {} }, result => {
                const options = result.options;
                const results = validate(options, optionsSchema);
                if (results.valid) {
                    resolve(options);
                } else {
                    reject(results.errors);
                }
            });
        });
    },
    set: (value) => {
        return new Promise(function (resolve, reject) {
            chrome.storage.sync.set(
                {
                    options: value,
                },
                () => {
                    resolve();
                }
            );
        });
    },
};
