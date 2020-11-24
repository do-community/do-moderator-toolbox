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
    <vueSelect v-if="context" v-model="select" :options="Object.keys(responses[context])" @input="input"></vueSelect>
</template>

<script>
    const vueSelect = require('vue-select').default;
    const { responses } = require('./data');

    const context =
        window.location.pathname.match(/\/community\/questions\/.+/)
            ? 'questions'
            : (window.location.pathname.match(/\/community\/spam_flags\/.+/)
                ? 'flags'
                : null);

    module.exports = {
        name: 'MacrosDropdown',
        components: {
            vueSelect,
        },
        data() {
            return {
                app: null,
                select: null,
                context,
                responses,
            };
        },
        methods: {
            set(val) {
                this.$data.select = val;
            },
            input(val) {
                this.$emit('input', val);
            },
        },
        created() {
            this.$data.app = this.$parent.$data.app;
        },
    };
</script>
