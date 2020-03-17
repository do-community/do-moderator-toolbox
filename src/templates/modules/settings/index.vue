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
    <div v-if="app.$data.state === 'settings'">
        <h4>Moderator Toolbox Settings</h4>

        <PrettyCheck v-model="hideModeratorToolbar" class="p-switch p-fill" @change="save">
            Hide Moderator Toolbar
        </PrettyCheck>

        <PrettyCheck class="p-switch p-fill" :v-model="openOnLoad" @change="save">
            Open Toolbox on Page Load
        </PrettyCheck>

        <PrettyCheck v-model="loadPostsOnLoad" class="p-switch p-fill" @change="save">
            Load User Posts on Profile Load
        </PrettyCheck>
    </div>
    <div v-else-if="app.$data.state === 'home'">
        <hr />
        <div><a class="dmt-button dmt-button-tertiary" @click="app.$data.state = 'settings'">Toolbox Settings</a></div>
    </div>
</template>

<script>
    const storage = require('../../../utils/storage');
    const PrettyCheck = require('pretty-checkbox-vue/check');

    let openedOnLoad = false;

    const callbacks = {
        hideModeratorToolbar: () => {
            if (storage.get('hideModeratorToolbar')) {
                document.body.classList.add('dmt-hide-toolbar');
            } else {
                document.body.classList.remove('dmt-hide-toolbar');
            }
        },
        openOnLoad: app => {
            if (!openedOnLoad) {
                if (storage.get('openOnLoad')) {
                    app.$data.showToolbox = true;
                }
                openedOnLoad = true;
            }
        },
    };

    const runCallbacks = app => {
        Object.values(callbacks).forEach(func => func(app));
    };

    module.exports = {
        name: 'Settings',
        components: {
            PrettyCheck,
        },
        data() {
            return {
                app: null,
                hideModeratorToolbar: storage.get('hideModeratorToolbar') || false,
                openOnLoad: storage.get('openOnLoad') || false,
                loadPostsOnLoad: storage.get('loadPostsOnLoad') || false,
            };
        },
        methods: {
            save() {
                storage.set('hideModeratorToolbar', this.$data.hideModeratorToolbar);
                storage.set('openOnLoad', this.$data.openOnLoad);
                storage.set('loadPostsOnLoad', this.$data.loadPostsOnLoad);
                runCallbacks(this.$data.app);
            },
        },
        created() {
            this.$data.app = this.$parent;
            this.save();
        },
    };
</script>
