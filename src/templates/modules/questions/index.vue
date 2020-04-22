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
    <!-- This module shows nothing in the toolbox itself -->
    <div></div>
</template>

<script>
    const Vue = require('vue').default;
    const QuestionsQuestions = require('./questions');

    const onQuestion = () => {
        return !!(window.location.pathname.match(/\/community\/questions\/.+/));
    };

    module.exports = {
        name: 'Questions',
        data() {
            return {
                app: null,
            };
        },
        created() {
            this.$data.app = this.$parent;

            if (!this.$data.domVersion) {
                if (onQuestion()) {
                    const DOMQuestions = Vue.extend(QuestionsQuestions);
                    const instanceDOMQuestions = new DOMQuestions({ parent: this.$parent });
                    instanceDOMQuestions.$mount();
                    const actions = document.querySelector('.question-actions');
                    actions.parentElement.insertBefore(instanceDOMQuestions.$el, actions);
                }
            }
        },
    };
</script>
