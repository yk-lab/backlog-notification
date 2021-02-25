'use strict';

import './options.css';

import 'choices.js/public/assets/styles/choices.css';
import * as Choices from 'choices.js';

import { JSONEditor } from '@json-editor/json-editor';
import { optionsStore, spacesStore } from './store';
import { optionsSchema, spacesSchema } from './schemas';

window.Choices = Choices;

// document.addEventListener('DOMContentLoaded', restore_options);
// document.getElementById('SAVE').addEventListener('click', save_options);

window.onload = function () {
    let editor;
    spacesStore.get(function (spaces) {
        editor = new JSONEditor(document.getElementById('editor_holder'), {
            schema: spacesSchema,
            startval: spaces,

            // Require all properties by default
            required_by_default: true,

            disable_collapse: true,
            disable_edit_json: true,
            no_additional_properties: true,
            disable_properties: true,
            enable_array_copy: true,
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

    let options_editor;
    optionsStore.get().then(data => {
        options_editor = new JSONEditor(document.getElementById('options_editor_holder'), {
            schema: optionsSchema,
            startval: data,

            // Require all properties by default
            // required_by_default: true,

            disable_collapse: true,
            disable_edit_json: true,
            no_additional_properties: true,
            disable_properties: true,
            // enable_array_copy: true,
        });
    });

    // Hook up the submit button to log to the console
    document.getElementById('submit').addEventListener('click', function () {
        const values = editor.getValue();
        const options = options_editor.getValue();
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
                Promise.all([spacesStore.set(s), optionsStore.set(options)])
                    .then(() => { window.alert('保存しました'); });
            });
        })();
    });
};
