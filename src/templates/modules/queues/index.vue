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
    <div v-if="active() && app.$data.state === 'home'" class="dmt-queues">
        <a v-for="queue in Object.values(queues)" class="dmt-button" :href="queue.link">
            {{ queue.text }}
            {{ queue.count !== null ? ` (${queue.count})` : '' }}
        </a>

        <small v-if="!countsLoaded">
            <a class="dmt-button dmt-button-secondary" @click="loadCounts">Load queue counts</a>
        </small>
    </div>
</template>

<script>
    const isAdmin = require('../../../utils/isAdmin');
    const storage = require('../../../utils/storage');

    const encodeQueryData = data => {
        const ret = [];
        for (let d in data)
            ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
        return ret.join('&');
    };

    const queues = {
        underReview: {
            link: '/community/moderation/under_review?moderation=true',
            text: 'Under Review',
            count: null,
            async getCount() {
                const resp = await fetch('https://www.digitalocean.com/community/moderation/under_review?moderation=true&per_page=1');
                const html = document.createElement('div');
                html.innerHTML = await resp.text();

                let posts = html.querySelector('.layout-wrapper h2');
                posts = posts && posts.textContent
                    ? posts.textContent.match('There are ([\\d,]+) Under Review Posts?')
                    : [];
                posts = posts.length > 1 ? posts[1] : '?';

                return posts.toLocaleString();
            },
        },
        flagged: {
            link: '/community/moderation/flagged?moderation=true',
            text: 'Flagged',
            count: null,
            async getCount() {
                const resp = await fetch('https://www.digitalocean.com/community/moderation/flagged?moderation=true&per_page=1');
                const html = document.createElement('div');
                html.innerHTML = await resp.text();

                let flagged = html.querySelector('.layout-wrapper h2');
                flagged = flagged && flagged.textContent
                    ? flagged.textContent.match('There are ([\\d,]+) Flagged Posts?')
                    : [];
                flagged = flagged.length > 1 ? flagged[1] : '?';

                let tutorials = html.querySelectorAll('.layout-wrapper h3');
                tutorials = tutorials && tutorials.length > 0 && tutorials[0].textContent
                    ? tutorials[0].textContent.match('Tutorial Feedback \\(([\\d,]+)\\)')
                    : [];
                tutorials = tutorials.length > 1 ? tutorials[1] : '?';

                let tools = html.querySelectorAll('.layout-wrapper h3');
                tools = tools && tools.length > 1 && tools[1].textContent
                    ? tools[1].textContent.match('Tool Feedback \\(([\\d,]+)\\)')
                    : [];
                tools = tools.length > 1 ? tools[1] : '?';

                return `${flagged.toLocaleString()}:${tutorials.toLocaleString()}:${tools.toLocaleString()}`;
            },
        },
        unansweredQuestions: {
            link: '/community/questions?secondary_filter=unanswered',
            text: 'Unanswered Questions',
            count: null,
            async getCount() {
                const applicationId = '6ZHEUVKJ88';
                const apiKey = 'c5470567eae7fa1177d43222e18ba086';
                const index = 'production_community_consolidated_newest';
                const resp = await fetch(`https://${applicationId.toLowerCase()}-dsn.algolia.net/1/indexes/${index}/query?x-algolia-application-id=${applicationId}&x-algolia-api-key=${apiKey}`, {
                    method: 'POST',
                    body: JSON.stringify({
                        params: encodeQueryData({
                            query: '',
                            page: 0,
                            hitsPerPage: 0,
                            facetFilters: '["feedable_language:en","item_type:question"]',
                            numericFilters: '["indexed_answers_count=0"]',
                        }),
                    }),
                });

                return (await resp.json()).nbHits;
            },
        },
    };

    module.exports = {
        name: 'Queues',
        data() {
            return {
                app: null,
                queues,
                countsLoaded: false,
            };
        },
        created() {
            this.$data.app = this.$parent;
        },
        mounted() {
            if (storage.get('queueCountsOnLoad')) {
                this.loadCounts();
            }
        },
        methods: {
            active: isAdmin,
            loadCounts() {
                this.$data.countsLoaded = true;
                Object.keys(this.$data.queues).forEach(key => {
                    this.$data.queues[key].getCount().then(count => {
                        this.$data.queues[key].count = count;
                    });
                });
            },
        },
    };
</script>
