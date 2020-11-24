<!--
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
-->

<template>
    <div v-if="active()">
        <div v-if="['home', 'macros'].includes(app.$data.state)">
            <h4>Response macros</h4>
            <dropdown ref="dropdown" @input="input"></dropdown>
        </div>
        <div v-if="app.$data.state === 'macros'">
            <div ref="inserts">
                <div v-if="Object.keys(inserts).length">
                    <h4>Macro inserts</h4>
                    <div v-for="[key, val] of Object.entries(inserts)">
                        <h5>{{ val.name }}</h5>
                        <input type="text"
                               :data-insert="key"
                               :value="val.value"
                               :placeholder="val.default"
                               class="dmt-input dmt-input-invalid"
                               required="required"
                               @input="updateInserts"
                        />
                    </div>

                    <h4>Macro response</h4>
                </div>
            </div>
            <textarea v-model="rendered" :rows="rows" class="dmt-input"></textarea>
            <div>
                <a :class="`dmt-button${missingInserts() ? ' dmt-button-disabled' : ''}`"
                   @click="post"
                >Post as response</a>
                <a :class="`dmt-button dmt-button-secondary${missingInserts() ? ' dmt-button-disabled' : ''}`"
                   @click="insert"
                >Insert into textbox</a>
            </div>
        </div>
    </div>
</template>

<script>
    const Vue = require('vue').default;
    const { responses, render, getInserts, setInserts } = require('./data');
    const dropdown = require('./dropdown.vue');

    module.exports = {
        name: 'Macros',
        components: {
            dropdown,
        },
        methods: {
            activeQuestions() {
                return !!(window.location.pathname.match(/\/community\/questions\/.+/));
            },
            activeSpamFlags() {
                return !!(window.location.pathname.match(/\/community\/spam_flags\/.+/));
            },
            active() {
                return this.activeQuestions() || this.activeSpamFlags();
            },

            reset() {
                this.$data.app.$data.state = 'home';
                this.$data.macro = '';
                this.$data.inserts = {};
                this.$data.rendered = '';
            },
            updateInserts() {
                const elms = this.$refs.inserts.querySelectorAll('[data-insert]');
                for (const elm of elms) {
                    const key = elm.getAttribute('data-insert');
                    if (key in this.$data.inserts) {
                        this.$data.inserts[key].value = elm.value;

                        // Highlight inputs
                        if (elm.value) elm.classList.remove('dmt-input-invalid');
                        else elm.classList.add('dmt-input-invalid');
                    }
                }
                this.render();
            },
            render() {
                this.$data.rendered = setInserts(this.$data.macro, this.$data.inserts);
            },
            input(val, context) {
                if (val === null) return this.reset();
                if (context === null) return this.reset();
                this.$data.app.$data.state = 'macros';
                this.$refs.dropdown.set(val);
                this.$data.macro = render(responses[context][val], this.$data.app);
                this.$data.inserts = getInserts(this.$data.macro);
                this.$nextTick(() => {
                    this.render();
                    this.$data.rows = Math.round(this.$data.rendered.split(/\r\n|\r|\n/).length * 1.4);
                    this.$data.app.$data.showToolbox = true;
                });
            },

            formElement() {
                if (this.activeQuestions()) return document.getElementById('new_answer');
                if (this.activeSpamFlags()) return document.getElementById('new_comment');
            },
            inputElement() {
                return this.formElement().querySelector('textarea');
            },
            buttonElement() {
                return this.formElement().querySelector('button[type="submit"]');
            },
            setInput(val) {
                // Set the value
                const input = this.inputElement();
                input.value = val;

                // Send a fake input event
                const event = new Event('input', {
                    bubbles: true,
                    cancelable: true,
                });
                input.dispatchEvent(event);
            },
            insert() {
                // Set
                this.render();
                this.setInput(this.$data.rendered);

                // Reset
                this.reset();
                this.$refs.dropdown.set(null);
                this.$data.app.$data.showToolbox = false;

                // Focus on input
                this.inputElement().focus();
            },
            post() {
                // Set & submit
                this.render();
                this.setInput(this.$data.rendered);
                this.buttonElement().click();

                // Reset
                this.reset();
                this.$refs.dropdown.set(null);
                this.$data.app.$data.showToolbox = false;
            },
            missingInserts() {
                return Object.values(this.$data.inserts).filter(x => !x.value).length !== 0;
            },
        },
        data() {
            return {
                app: null,
                macro: '',
                rendered: '',
                inserts: {},
                rows: 0,
            };
        },
        created() {
            this.$data.app = this.$parent;

            // Inject a second dropdown into the DOM
            const DOMDropdown = Vue.extend(dropdown);
            const instanceDOMDropdown = new DOMDropdown({ parent: this });
            instanceDOMDropdown.$on('input', this.input);
            instanceDOMDropdown.$mount();
            const elementDOMDropdown = document.createElement('div');
            elementDOMDropdown.className = 'dmt';
            const titleDOMDropdown = document.createElement('h3');
            titleDOMDropdown.textContent = 'Moderator Toolbox Macro Responses';
            elementDOMDropdown.appendChild(titleDOMDropdown);
            elementDOMDropdown.appendChild(instanceDOMDropdown.$el);
            elementDOMDropdown.style.marginBottom = '1.5em';

            // Inject above input box
            const form = this.formElement();
            if (form) {
                const formContainer = form.parentElement;
                if (formContainer) {
                    formContainer.insertBefore(elementDOMDropdown, formContainer.firstChild);
                }
            }
        },
    };
</script>
