<!--
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
-->

<template>
    <div v-if="this.active()">
        <div v-if="['home', 'macros'].includes(app.$data.state)">
            <h4>Question response macros</h4>
            <dropdown @input="this.input" ref="dropdown"></dropdown>
        </div>
        <div v-if="app.$data.state === 'macros'">
            <textarea :rows="rows" ref="textarea">{{ rendered }}</textarea>
            <div><a class="dmt-button" @click="this.post">Post as Answer</a></div>
        </div>
    </div>
</template>

<script>
    const { responses, render } = require('./data');
    const dropdown = require('./dropdown.vue');

    module.exports = {
        name: 'Macros',
        components: {
            dropdown,
        },
        methods: {
            active() {
                return !!(window.location.pathname.match(/\/community\/questions\/.+/))
            },
            reset() {
                this.$data.app.$data.state = 'home';
                this.$data.rendered = '';
            },
            input(val) {
                if (val === null) {
                    this.reset();
                    return;
                }
                this.$data.rendered = render(responses[val], this.$data.app);
                this.$data.rows = Math.round(this.$data.rendered.split(/\r\n|\r|\n/).length * 1.4);
                this.$data.app.$data.state = 'macros';
            },
            post() {
                document.getElementById('answer_content').value = this.$refs.textarea.value;
                document.querySelector('#new_answer .answer-submit-button').click();
                this.reset();
                this.$refs.dropdown.set(null); // TODO: this needs to reset the selected value
                this.$data.app.$data.showToolbox = false;
            }
        },
        data() {
            return {
                app: null,
                rendered: '',
                rows: 0,
            };
        },
        created() {
            this.$data.app = this.$parent;
        },
    };
</script>
