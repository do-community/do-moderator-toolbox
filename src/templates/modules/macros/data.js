/*
Copyright 2019 DigitalOcean

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

const parts = {
    'open-personal': 'In our public community, we aim to answer open questions about anything SysAdmin, DigitalOcean and beyond. However, we make every attempt to keep personal information safe and so don\'t ever access personal account information here. This means we can\'t provide help with any account or billing-related issues.',
    'opener': 'Hey {{OP}},\n\n{{P:open-personal}}\n\n',
    'closer': '\n\nHope that helps!\n\\- {{USER}}.',
};

const responses = {
    'Reach out to support': '{{P:opener}}Please reach out to our amazing support team who will be more than happy to assist you with your account issue! :)\n\n> https://www.digitalocean.com/company/contact/#support{{P:closer}}',
    'Asked support to check ticket': '{{P:opener}}I have asked our amazing support team to check-in on your ticket. They will be able to help you further where we cannot! :){{P:closer}}',
    'Do you have a ticket number?': '{{P:opener}}Do you have a ticket number from when you contacted our support team so that I can get this followed up for you?{{P:closer}}',
    'Old Question: Do you have a ticket number?': '{{P:opener}}I\'m hoping that you\'ve now managed to get this resolved, but if not, do you have a ticket number from when you contacted our support team so that I can get this followed up for you?{{P:closer}}',
};

const render = (string, app) => {
    // Part substitutions
    let match;
    while (match = string.match(/{{P:(.+?)}}/)) { // eslint-disable-line no-cond-assign
        if (match[1] in parts) {
            string = string.replace(match[0], parts[match[1]]);
        } else {
            string = string.replace(match[0], '<unknown part>');
        }
    }

    // Extra substitutions
    const op = document.body.querySelector('.question-container .section-primary .postable-info-bar-container .username');
    string = string.replace(/{{OP}}/g, `@${op.textContent}`);
    string = string.replace(/{{USER}}/g, app.$data.user.first_name);
    return string;
};

module.exports = { responses, render };
