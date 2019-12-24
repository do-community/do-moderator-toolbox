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
    <div>
        <div :class="`dmt-container${showToolbox ? ' dmt-container-active' : ''}`">
            <div class="dmt-background" @click="showToolbox = false"></div>
            <div class="dmt-main">
                <Header></Header>

                <div v-for="mod in modules">
                    <component :is="mod.name"></component>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    // Load in utils
    const getCurrentAdmin = require('../utils/getCurrentAdmin');

    // Load in core components
    const Header = require('./core/header.vue');
    const components = {
        Header,
    };

    // Load in modules
    const modules = require('./modules');
    modules.forEach(mod => {
        components[mod.name] = mod;
    });

    module.exports = {
        name: 'App',
        components,
        data() {
            return {
                state: 'home',
                showToolbox: false,
                modules,
                user: getCurrentAdmin(),
            };
        },
        methods: {
            keyListener(e) {
                console.log(e);
                if (e.target !== document.body) return;
                if (e.key === '`') return this.$data.showToolbox = !this.$data.showToolbox;
                if (e.key === 'Escape' || e.key === 'Esc') return this.$data.showToolbox = false;
            },
        },
        mounted() {
            document.addEventListener('keydown', this.keyListener);
        },
        destroyed() {
            document.removeEventListener('keydown', this.keyListener);
        },
    };
</script>
