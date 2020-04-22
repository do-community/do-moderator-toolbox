/*
Copyright 2020 DigitalOcean

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
    'idea-opener': 'Hey {{OP}},\n\nGreat idea, sounds like it\'d be super useful!\n\n',
    'closer': '\n\nHope that helps!\n\\- {{USER}}.',
};

const responses = {
    'Reach out to support': '{{P:opener}}Please reach out to our amazing support team who will be more than happy to assist you with your account issue! :)\n\n> https://www.digitalocean.com/support/{{P:closer}}',
    'Asked support to check ticket': '{{P:opener}}I have asked our amazing support team to check-in on your ticket. They will be able to help you further where we cannot! :){{P:closer}}',
    'Do you have a ticket number?': '{{P:opener}}Do you have a ticket number from when you contacted our support team so that I can get this followed up for you?{{P:closer}}',
    'New product idea': '{{P:idea-opener}}The best thing to do to get your voice heard regarding this would be to head over to our Product Ideas board and post a new idea, including as much information as possible for what you\'d like to see implemented.\n\n> https://ideas.digitalocean.com/{{P:closer}}',
    'Existing product idea': '{{P:idea-opener}}It looks like someone has had the same idea before and has posted it on our Product Ideas board. The best thing to do would be to head over and add your vote to it, as well as adding any additional information in the comments for exactly what you\'d like to see implemented!\n\n> {{I:Idea page link||https://ideas.digitalocean.com/}}{{P:closer}}',
    'Old Question: Do you have a ticket number?': '{{P:opener}}I\'m hoping that you\'ve now managed to get this resolved, but if not, do you have a ticket number from when you contacted our support team so that I can get this followed up for you?{{P:closer}}',
};

const render = (string, app) => {
    // Part substitutions
    let match;
    do {
        match = string.match(/{{P:(.+?)}}/);
        if (match) {
            if (match[1] in parts) {
                string = string.replace(match[0], parts[match[1]]);
            } else {
                string = string.replace(match[0], '<unknown part>');
            }
        }
    } while (match);

    // Extra substitutions
    const op = document.body.querySelector('.question-container .section-primary .postable-info-bar-container .username');
    string = string.replace(/{{OP}}/g, `@${op.textContent}`);
    string = string.replace(/{{USER}}/g, app.$data.user.first_name);
    return string;
};

const getInserts = string => {
    return [...string.matchAll(/{{I:(.+?)\|\|(.+?)}}/g)].reduce((result, item) => {
        result[item[0]] = { name: item[1], value: '', default: item[2] };
        return result;
    }, {});
};

const setInserts = (string, inserts) => {
    // Insert substitutions
    let match;
    do {
        match = string.match(/{{I:(.+?)\|\|(.+?)}}/);
        if (match) {
            if (match[0] in inserts) {
                string = string.replace(match[0], inserts[match[0]].value);
            } else {
                string = string.replace(match[0], '<unknown insert>');
            }
        }
    } while (match);
    return string;
};

module.exports = { responses, render, getInserts, setInserts };
