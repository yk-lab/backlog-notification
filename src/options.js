'use strict';

import './options.css';

import { JSONEditor } from "@json-editor/json-editor";
import { spacesStore } from "./store";

// document.addEventListener('DOMContentLoaded', restore_options);
// document.getElementById('SAVE').addEventListener('click', save_options);

const json_schema_spaces = {
    type: "array",
    title: "Backlog Spaces",
    // format: "tabs",
    // format: "table",
    // format: "tabs-top",
    items: {
        title: "Space",
        headerTemplate: "{{i}} - {{self.domain}}",
        properties: {
            domain: {
                type: "string",
                title: "Backlog Workspace Domain",
                // description: "",
                options: {
                    inputAttributes: {
                        placeholder: "ex.) project-name.backlog.jp",
                    }
                }
            },
            apiKey: {
                type: "string",
                format: "password",
            },
            userId: {
                type: "integer",
                format: "hidden",
                options: {
                    hidden: true
                },
            }
        },
    },
};

window.onload = function () {
    spacesStore.get(function (spaces) {
        const editor = new JSONEditor(document.getElementById('editor_holder'), {
            schema: json_schema_spaces,
            startval: spaces,

            // Require all properties by default
            required_by_default: true,

            disable_collapse: true,
            disable_edit_json: true,
            no_additional_properties: true,
            disable_properties: true,
            enable_array_copy: true,
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
                    spacesStore.set(s, function () {
                        window.alert('保存しました');
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
