const parts = {
    "open-personal": "In our public community, we aim to answer open questions about anything SysAdmin, DigitalOcean and beyond. However, we make every attempt to keep personal information safe and so don't ever access personal account information here. This means we can't provide help with any account or billing-related issues.",
    "opener": "Hey {{OP}},\n\n{{P:open-personal}}\n\n",
    "closer": "\n\nHope that helps!\n\\- {{USER}}."
};

const responses = {
    "Reach out to support": "{{P:opener}}Please reach out to our amazing support team who will be more than happy to assist you with your account issue! :)\n\n> https://www.digitalocean.com/company/contact/#support{{P:closer}}",
    "Asked support to check ticket": "{{P:opener}}I have asked our amazing support team to check-in on your ticket. They will be able to help you further where we cannot! :){{P:closer}}",
    "Do you have a ticket number?": "{{P:opener}}Do you have a ticket number from when you contacted our support team so that I can get this followed up for you?{{P:closer}}",
    "Old Q - Do you have a ticket number?": "{{P:opener}}I'm hoping that you've now managed to get this resolved, but if not, do you have a ticket number from when you contacted our support team so that I can get this followed up for you?{{P:closer}}",
};

const render = (string, app) => {
    // Part substitutions
    while (match = string.match(/{{P:(.+?)}}/)) {
        if (match[1] in parts) {
            string = string.replace(match[0], parts[match[1]]);
        } else {
            string = string.replace(match[0], '<unknown part>')
        }
    }

    // Extra substitutions
    const op = document.body.querySelector('.question-container .section-primary .postable-info-bar-container .username');
    string = string.replace(/{{OP}}/g, `@${op.textContent}`);
    string = string.replace(/{{USER}}/g, app.$data.user.first_name);
    return string;
};

module.exports = { responses, render };
