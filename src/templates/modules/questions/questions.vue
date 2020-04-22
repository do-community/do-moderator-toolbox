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
    <section class="dmt">
        <div class="dmt-user-posts dmt-questions feed_container">
            <div v-if="state === 0">
                <p><a class="dmt-button" @click="load()">Load other questions from user</a></p>
            </div>
            <div v-if="state === 1">
                <p>User questions are loading...</p>
            </div>
            <div v-if="state === 2">
                <p v-if="posts.length === 0">
                    No other questions from user.
                </p>
                <div v-else>
                    <nav class="navbar">
                        <ul role="menubar" class="primary bounded">
                            <li role="menuitem">
                                <a :class="filter === null ? 'active' : ''" @click="filterSet(null)">
                                    All
                                    ({{ posts.length.toLocaleString() }})
                                </a>
                            </li>
                            <li role="menuitem">
                                <a :class="filter === 'published' ? 'active' : ''" @click="filterSet('published')">
                                    Published
                                    ({{ posts.filter(p => p.attributes.state === 'published').length.toLocaleString() }})
                                </a>
                            </li>
                            <li role="menuitem">
                                <a :class="filter === 'rejected' ? 'active' : ''" @click="filterSet('rejected')">
                                    Spam
                                    ({{ posts.filter(p => p.attributes.state === 'rejected').length.toLocaleString() }})
                                </a>
                            </li>
                            <li role="menuitem">
                                <a :class="filter === 'under_review' ? 'active' : ''" @click="filterSet('under_review')">
                                    Under Review
                                    ({{ posts.filter(p => p.attributes.state === 'under_review').length.toLocaleString() }})
                                </a>
                            </li>
                            <li role="menuitem">
                                <a :class="filter === 'trashed' ? 'active' : ''" @click="filterSet('trashed')">
                                    Trash
                                    ({{ posts.filter(p => p.attributes.state === 'trashed').length.toLocaleString() }})
                                </a>
                            </li>
                        </ul>
                    </nav>

                    <div class="feed">
                        <div class="filter-objects">
                            <ul class="feedable-list">
                                <li v-for="(post, i) in posts"
                                    :class="post.type.replace(/s+$/, '')"
                                    :data-state="post.attributes.state"
                                    :style="{ display: filterShow(post) ? 'list-item' : 'none' }"
                                >
                                    <span class="eyebrow">
                                        <b>{{ title(post.attributes.state) }}</b>
                                        Question
                                        <small>(Post #{{ (posts.length - i).toLocaleString() }})</small>
                                    </span>
                                    <h3>
                                        <a :href="post.attributes.url">{{ post.attributes.title }}</a>
                                    </h3>
                                    <div v-if="post.attributes.content && post.attributes.content.length > 100"
                                         class="summary"
                                    >
                                        {{ (post.attributes.content || 'No content').substring(0, 100) }}...
                                    </div>
                                    <div v-else class="summary">
                                        {{ (post.attributes.content || 'No content') }}
                                    </div>
                                    <div class="meta-section">
                                        <span class="publish-date">
                                            {{ (new Date(post.attributes['created-at'])).toLocaleString() }}
                                        </span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
    const storage = require('../../../utils/storage');
    const getUserPosts = require('../../../utils/user/getUserPosts');

    module.exports = {
        name: 'QuestionsQuestions',
        data() {
            return {
                app: null,
                state: 0,
                posts: null,
                filter: null,
            };
        },
        methods: {
            load() {
                this.$data.state = 1;

                const user = document.body.querySelector('.question-container .section-primary .postable-info-bar-container .username').textContent;
                const slug = window.location.pathname.match(/\/community\/questions\/(.+)/)[1];
                getUserPosts(user).then(data => {
                    // Show our full contributions
                    this.$data.state = 2;
                    this.$data.posts = data.filter(post => post.type === 'questions' && post.attributes.slug !== slug);
                });
            },
            title(str) {
                return str.charAt(0).toUpperCase() + str.slice(1);
            },
            filterSet(type) {
                this.$data.filter = type;
            },
            filterShow(post) {
                if (!this.$data.filter) return true;
                return post.attributes.state === this.$data.filter;
            },
        },
        created() {
            this.$data.app = this.$parent;
            if (storage.get('loadQuestionsOnLoad')) this.load();
        },
    };
</script>
