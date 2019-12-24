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
    <div class="dmt-header">
        <h3>{{ getGreeting(app.$data.user.first_name) }}</h3>
        <i :class="`icon icon-${icon()}`" @click="button"></i>
    </div>
</template>

<script>
    const getGreeting = require('../../utils/getGreeting');

    module.exports = {
        name: 'Header',
        methods: {
            getGreeting,
            icon() {
                if (this.$data.app.$data.state === 'home') return 'close';
                return 'arrow-left';
            },
            button() {
                if (this.$data.app.$data.state === 'home') return this.$data.app.$data.showToolbox = false;
                return this.$data.app.$data.state = 'home';
            },
        },
        data() {
            return {
                app: null,
            };
        },
        created() {
            this.$data.app = this.$parent;
        },
    };
</script>
