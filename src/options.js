'use strict';

import { JSONEditor } from "./jsoneditor";

// https://developer.chrome.com/docs/extensions/mv2/options/
// function save_options() {
//     const domain = document.getElementById('DOMAIN').value;
//     const apiKey = document.getElementById('API_KEY').value;
//     const url = `https://${domain}/api/v2/users/myself?apiKey=${apiKey}`;
//     fetch(
//         url,
//         {
//             method: "GET",
//             mode: "no-cors",
//         }).then(
//             response => response.json()
//         ).then(
//             response => {
//                 chrome.storage.sync.set({
//                     apiKey: apiKey,
//                     domain: domain,
//                     userId: response.id,
//                 }, function () {
//                     alert('保存しました');
//                 });
//             }
//         );
// }

// function restore_options() {
//     chrome.storage.sync.get({
//         apiKey: '',
//         domain: '',
//     }, function (items) {
//         document.getElementById('DOMAIN').value = items.domain;
//         document.getElementById('API_KEY').value = items.apiKey;
//     });
// }

// document.addEventListener('DOMContentLoaded', restore_options);
// document.getElementById('SAVE').addEventListener('click', save_options);

const json_schema_projects = {
    type: "array",
    title: "Backlog Projects",
    // format: "tabs",
    items: {
        title: "Project",
        headerTemplate: "{{i}} - {{self.domain}}",
        properties: {
            domain: {
                type: "string",
                default: "project-name.backlog.jp",
            },
            apiKey: {
                type: "string",
                format: "password",
            },
            userId: {
                type: "integer",
                format: "hidden",
            }
        },
    }
};

window.onload = function () {
    chrome.storage.sync.get({ projects: [] }, function (items) {
        const editor = new JSONEditor(document.getElementById('editor_holder'), {
            // Enable fetching schemas via ajax
            // ajax: true,

            // The schema for the editor
            schema: json_schema_projects,

            // Seed the form with a starting value
            startval: items.projects,

            // Disable additional properties
            // no_additional_properties: true,

            // Require all properties by default
            required_by_default: true
        });

        // Hook up the submit button to log to the console
        document.getElementById('submit').addEventListener('click', function () {
            const values = editor.getValue();
            (async () => {
                let results;

                const responses = await Promise.all(
                    values.map((item) => {
                        const domain = item.domain;
                        const apiKey = item.apiKey;
                        return fetch(
                            `https://${domain}/api/v2/users/myself?apiKey=${apiKey}`
                        ).then(
                            response => response.json()
                        );
                    })
                );

                results = Promise.all(
                    responses.map((response, i) => {
                        const item = values[i];
                        return {
                            apiKey: item.apiKey,
                            domain: item.domain,
                            userId: response.id,
                        };
                    })
                );

                results.then((s) => {
                    chrome.storage.sync.set({
                        projects: s,
                    }, function () {
                        console.log(s);
                        alert('保存しました');
                        // chrome.storage.sync.get({ projects: [] }, function (items) {
                        //     console.log(items);
                        // });
                    });
                });
            })();
        });


        editor.on('change', function () {
            var errors = editor.validate();

            var indicator = document.getElementById('valid_indicator');

            // Not valid
            if (errors.length) {
                indicator.style.color = 'red';
                indicator.textContent = "not valid";
            }
            // Valid
            else {
                indicator.style.color = 'green';
                indicator.textContent = "valid";
            }
        });
    });
};
