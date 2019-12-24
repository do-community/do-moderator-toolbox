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
    <div v-if="app.$data.state === 'home'" class="dmt-queues">
        <a v-for="queue in queues" class="dmt-button" :href="queue.link">{{ queue.text }}</a>
    </div>
</template>

<script>
    const getQueue = href => {
        const elm = document.querySelector(`.moderation-bar li a[href="${href}"]`);
        if (!elm) return;
        return {
            link: href,
            text: elm.textContent,
        };
    };

    const queues = [
        getQueue('/community/moderation/under_review?moderation=true'),
        getQueue('/community/moderation/flagged?moderation=true'),
        {
            link: '/community/questions?primary_filter=unanswered',
            text: 'Unanswered Questions',
        },
    ];

    module.exports = {
        name: 'Queues',
        data() {
            return {
                app: null,
                queues,
            };
        },
        created() {
            this.$data.app = this.$parent;
        },
    };
</script>
