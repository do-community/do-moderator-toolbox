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
        <h3 class="section_header">
            All User Posts
        </h3>
        <div class="dmt-user-posts feed_container">
            <div v-if="state === 0">
                <a class="dmt-button" @click="loadUserPosts()">Load all posts by user</a>
            </div>
            <div v-if="state === 1">
                <p>User posts are loading...</p>
            </div>
            <div v-if="state === 2">
                <nav class="navbar">
                    <ul role="menubar" class="primary bounded">
                        <li role="menuitem">
                            <a @click="filterSet(null)" :class="filter === null ? 'active' : ''">
                                All
                                ({{ posts.length.toLocaleString() }})
                            </a>
                        </li>
                        <li role="menuitem">
                            <a @click="filterSet('published')" :class="filter === 'published' ? 'active' : ''">
                                Published
                                ({{ posts.filter(p => p.attributes.state === 'published').length.toLocaleString() }})
                            </a>
                    </li>
                        <li role="menuitem">
                            <a @click="filterSet('rejected')" :class="filter === 'rejected' ? 'active' : ''">
                                Spam
                                ({{ posts.filter(p => p.attributes.state === 'rejected').length.toLocaleString() }})
                            </a>
                    </li>
                        <li role="menuitem">
                            <a @click="filterSet('trashed')" :class="filter === 'trashed' ? 'active' : ''">
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
                                    {{ title(post.type.replace(/s+$/, "")) }}
                                    <small>(Post #{{ (posts.length - i).toLocaleString() }})</small>
                                </span>
                                <h3>
                                    <a :href="post.attributes.url">
                                        {{ post.attributes.title || `View ${post.type.replace(/s+$/, "")}` }}
                                    </a>
                                </h3>
                                <div v-if="post.attributes.content.length > 100" class="summary">
                                    {{ post.attributes.content.substring(0, 100) }}...
                                </div>
                                <div v-else class="summary">
                                    {{ post.attributes.content }}
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
    </section>
</template>

<script>
    const getUserPosts = require('../../../utils/user/getUserPosts');

    const user = (window.location.pathname.startsWith('/community/questions/') ?
        document.body.querySelector('.question-container .section-primary .postable-info-bar-container .username').textContent
        : window.location.pathname.match(/\/community\/users\/(.+)/)[1]);

    module.exports = {
        name: 'UserPosts',
        data() {
            return {
                app: null,
                state: 0,
                posts: null,
                filter: null,
            };
        },
        methods: {
            loadUserPosts() {
                this.$data.state = 1;
                getUserPosts(user).then(data => {
                    // Hide the original contributions
                    document.querySelector('.large_column section:not(.dmt)').style.display = 'none';

                    // Show our full contributions
                    this.$data.state = 2;
                    this.$data.posts = data;
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
            }
        },
        created() {
            this.$data.app = this.$parent;
        },
    };
</script>
