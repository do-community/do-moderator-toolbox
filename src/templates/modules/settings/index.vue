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

        <br /><br />

        <PrettyCheck v-model="openOnLoad" class="p-switch p-fill" @change="save">
            Open Toolbox on <b>Every</b> Page Load
        </PrettyCheck>
        <PrettyCheck v-model="openHourOnLoad" class="p-switch p-fill" @change="save">
            Open Toolbox <b>Once per Hour</b> on Page Load
        </PrettyCheck>

        <br /><br />

        <PrettyCheck v-model="loadPostsOnLoad" class="p-switch p-fill" @change="save">
            Load All User Posts and Stats on Profile Page Load
        </PrettyCheck>

        <br /><br />

        <PrettyCheck v-model="loadQuestionsOnLoad" class="p-switch p-fill" @change="save">
            Load Other Questions from User on Question Page Load
        </PrettyCheck>

        <template v-if="isAdmin()">
            <br /><br />

            <PrettyCheck v-model="queueCountsOnLoad" class="p-switch p-fill" @change="save">
                Load Queue counts on Page Load
            </PrettyCheck>
        </template>
    </div>
    <div v-else-if="app.$data.state === 'home'">
        <hr />
        <div><a class="dmt-button dmt-button-tertiary" @click="app.$data.state = 'settings'">Toolbox Settings</a></div>
    </div>
</template>

<script>
    const isAdmin = require('../../../utils/isAdmin');
    const storage = require('../../../utils/storage');
    const PrettyCheck = require('pretty-checkbox-vue/check');

    let openedOnLoad = false;
    let openedHourOnLoad = false;

    const callbacks = {
        hideModeratorToolbar: () => {
            if (storage.get('hideModeratorToolbar')) {
                document.body.classList.add('dmt-hide-toolbar');
            } else {
                document.body.classList.remove('dmt-hide-toolbar');
            }
        },
        openHourOnLoad: app => {
            if (!openedOnLoad) {
                if (storage.get('openOnLoad')) {
                    app.$data.showToolbox = true;
                }
                openedOnLoad = true;
            }
        },
        openOnLoad: app => {
            if (!openedHourOnLoad) {
                if (storage.get('openHourOnLoad')) {
                    const last = storage.get('openHourOnLoadLast');
                    if (!last || last < Date.now() - 1000 * 60 * 60) {
                        storage.set('openHourOnLoadLast', Date.now());
                        app.$data.showToolbox = true;
                    }
                }
                openedHourOnLoad = true;
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
                openHourOnLoad: storage.get('openHourOnLoad') || true,
                loadPostsOnLoad: storage.get('loadPostsOnLoad') || false,
                loadQuestionsOnLoad: storage.get('loadQuestionsOnLoad') || false,
                queueCountsOnLoad: storage.get('queueCountsOnLoad') || false,
            };
        },
        methods: {
            isAdmin,
            save() {
                storage.set('hideModeratorToolbar', this.$data.hideModeratorToolbar);
                storage.set('openOnLoad', this.$data.openOnLoad);
                storage.set('openHourOnLoad', this.$data.openHourOnLoad);
                storage.set('loadPostsOnLoad', this.$data.loadPostsOnLoad);
                storage.set('loadQuestionsOnLoad', this.$data.loadQuestionsOnLoad);
                storage.set('queueCountsOnLoad', this.$data.queueCountsOnLoad);
                runCallbacks(this.$data.app);
            },
        },
        created() {
            this.$data.app = this.$parent;
            this.save();
        },
    };
</script>
