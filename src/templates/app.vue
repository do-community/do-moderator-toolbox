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

<style lang="scss">
    @import "../scss/app.scss";
</style>

<template>
    <div v-if="showToolbox" class="dmt-container">
        <div class="dmt-main">
            <h1>{{ getCurrentAdmin() }}</h1>
        </div>
    </div>
</template>

<script>
    const getCurrentAdmin = require('../utils/getCurrentAdmin');

    module.exports = {
        name: 'App',
        data() {
            return {
                showToolbox: false,
            };
        },
        methods: {
            getCurrentAdmin,
            keyPressListener(e) {
                console.log(e);
                if (e.key !== '`') return;
                if (e.target !== document.body) return;
                this.$data.showToolbox = !this.$data.showToolbox;
                console.log(this.$data.showToolbox);
            },
        },
        mounted() {
            document.addEventListener('keypress', this.keyPressListener);
        },
        destroyed() {
            document.removeEventListener('keypress', this.keyPressListener);
        },
    };
</script>
