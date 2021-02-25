import moment from 'moment-timezone';

export const spacesSchema = {
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

export const optionsSchema = {
    type: "object",
    // format: "table",
    title: "詳細設定",
    // required: ["timezone"],
    additionalProperties: false,
    properties: {
        timezone: {
            type: "string",
            format: "choices",
            enum: moment.tz.names(),
            default: 'Asia/Tokyo',
            options: {
                choices_options: {
                    shouldSort: true
                }
                //     selectize: {
                //         create: false
                //     }
            }
        },
    }
};