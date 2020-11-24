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
        <div class="dmt-user-posts feed_container">
            <div v-if="state === 0">
                <p><a class="dmt-button" @click="loadUserPosts()">Load all posts by user</a></p>
                <br />
            </div>
            <div v-if="state === 1">
                <p>User posts are loading...</p>
                <br />
            </div>
            <div v-if="state === 2">
                <h3 class="section_header">
                    User stats
                </h3>

                <div class="sidebar">
                    <UserChart :posts="posts"></UserChart>

                    <ul class="post-stats">
                        <li>
                            <b>
                                Questions: {{ posts.filter(p => p.type === 'questions').length.toLocaleString() }}
                            </b>
                            <ul>
                                <li>
                                    Upvotes: {{ upvotes(posts.filter(p => p.type === 'questions')).toLocaleString() }}
                                </li>
                                <li><hr /></li>
                                <li v-for="(statePosts, state) in states(posts.filter(p => p.type === 'questions'))">
                                    {{ title(state) }}: {{ statePosts.length.toLocaleString() }}
                                </li>
                            </ul>
                        </li>

                        <li>
                            <b>
                                Answers: {{ posts.filter(p => p.type === 'answers').length.toLocaleString() }}
                            </b>
                            <ul>
                                <li>
                                    Upvotes: {{ upvotes(posts.filter(p => p.type === 'answers')).toLocaleString() }}
                                </li>
                                <li>
                                    Accepted: {{ posts.reduce((pr, po) => pr + (po.type === 'answers' && po.attributes.accepted ? 1 : 0), 0).toLocaleString() }}
                                </li>
                                <li><hr /></li>
                                <li v-for="(statePosts, state) in states(posts.filter(p => p.type === 'answers'))">
                                    {{ title(state) }}: {{ statePosts.length.toLocaleString() }}
                                </li>
                            </ul>
                        </li>

                        <li>
                            <b>
                                Tutorials: {{ posts.filter(p => p.type === 'tutorials').length.toLocaleString() }}
                            </b>
                            <ul>
                                <li>
                                    Upvotes: {{ upvotes(posts.filter(p => p.type === 'tutorials')).toLocaleString() }}
                                </li>
                                <li>
                                    Views: {{ views(posts.filter(p => p.type === 'tutorials')).toLocaleString() }}
                                </li>
                                <li><hr /></li>
                                <li v-for="(statePosts, state) in states(posts.filter(p => p.type === 'tutorials'))">
                                    {{ title(state) }}: {{ statePosts.length.toLocaleString() }}
                                </li>
                            </ul>
                        </li>

                        <li>
                            <b>
                                Comments: {{ posts.filter(p => p.type === 'comments').length.toLocaleString() }}
                            </b>
                            <ul>
                                <li>
                                    Upvotes: {{ upvotes(posts.filter(p => p.type === 'comments')).toLocaleString() }}
                                </li>
                                <li><hr /></li>
                                <li v-for="(statePosts, state) in states(posts.filter(p => p.type === 'comments'))">
                                    {{ title(state) }}: {{ statePosts.length.toLocaleString() }}
                                </li>
                                <li><hr /></li>
                                <li v-for="(commentablePosts, commentable) in commentables(posts.filter(p => p.type === 'comments'))">
                                    {{ title(commentable) }}: {{ commentablePosts.length.toLocaleString() }}
                                </li>
                            </ul>
                        </li>
                    </ul>

                    <b>Total Upvotes: {{ upvotes(posts).toLocaleString() }}</b>
                    <!--<b>Total Views: {{ views(posts).toLocaleString() }}</b>-->
                </div>

                <br />
                <h3 class="section_header">
                    User Contributions
                </h3>

                <p>
                    <a class="dmt-button" @click="toggleContributions">
                        {{ showContributions ? 'Show public contributions' : 'Show all contributions' }}
                    </a>
                </p>

                <nav v-if="showContributions" class="navbar">
                    <ul role="menubar" class="primary bounded">
                        <li role="menuitem">
                            <a :class="filter === null ? 'active' : ''" @click="filterSet(null)">
                                All
                                ({{ posts.length.toLocaleString() }})
                            </a>
                        </li>
                        <li role="menuitem">
                            <a v-if="counts.published" :class="filter === 'published' ? 'active' : ''" @click="filterSet('published')">
                                Published
                                ({{ counts.published.toLocaleString() }})
                            </a>
                        </li>
                        <li role="menuitem">
                            <a v-if="counts.rejected" :class="filter === 'rejected' ? 'active' : ''" @click="filterSet('rejected')">
                                Spam
                                ({{ counts.rejected.toLocaleString() }})
                            </a>
                        </li>
                        <li role="menuitem">
                            <a v-if="counts.under_review" :class="filter === 'under_review' ? 'active' : ''" @click="filterSet('under_review')">
                                Under Review
                                ({{ counts.under_review.toLocaleString() }})
                            </a>
                        </li>
                        <li role="menuitem">
                            <a v-if="counts.trashed" :class="filter === 'trashed' ? 'active' : ''" @click="filterSet('trashed')">
                                Trash
                                ({{ counts.trashed.toLocaleString() }})
                            </a>
                        </li>
                    </ul>
                </nav>

                <div v-if="showContributions" class="feed">
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
    </section>
</template>

<script>
    const storage = require('../../../utils/storage');
    const getUserPosts = require('../../../utils/user/getUserPosts');

    const UserChart = require('./chart');

    module.exports = {
        name: 'UserPosts',
        components: {
            UserChart,
        },
        data() {
            return {
                app: null,
                state: 0,
                posts: null,
                counts: {},
                filter: null,
                showContributions: true,
            };
        },
        methods: {
            loadUserPosts() {
                this.$data.state = 1;

                const user = window.location.pathname.match(/\/community\/users\/(.+)/)[1];
                getUserPosts(user).then(data => {
                    // Hide the original contributions
                    const originalContribs = document.querySelector('.large_column').lastElementChild;
                    originalContribs.style.display = 'none';
                    originalContribs.querySelector('.section_header').style.display = 'none';

                    // Show our full contributions
                    this.$data.state = 2;
                    this.$data.posts = data;
                    this.$data.counts = this.$data.posts.reduce((acc, post) => {
                        acc[post.attributes.state] = (acc[post.attributes.state] || 0) + 1;
                        return acc;
                    }, {});
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
            upvotes(posts) {
                return posts.reduce((prev, post) =>
                    'upvotes-count' in post.attributes ? prev + post.attributes['upvotes-count'] : prev, 0);
            },
            views(posts) {
                return posts.reduce((prev, post) =>
                    'pageviews' in post.attributes ? prev + post.attributes.pageviews : prev, 0);
            },
            states(posts) {
                const states = {};
                posts.forEach(post => {
                    if (!(post.attributes.state in states)) states[post.attributes.state] = [];
                    states[post.attributes.state].push(post);
                });
                return states;
            },
            commentables(posts) {
                const commentables = {};
                posts.forEach(post => {
                    if (!(post.attributes['commentable-type'] in commentables))
                        commentables[post.attributes['commentable-type']] = [];
                    commentables[post.attributes['commentable-type']].push(post);
                });
                return commentables;
            },
            toggleContributions() {
                if (this.$data.showContributions) {
                    this.$data.showContributions = false;
                    document.querySelector('.large_column').lastElementChild.style.display = '';
                    return;
                }

                this.$data.showContributions = true;
                document.querySelector('.large_column').lastElementChild.style.display = 'none';
            },
        },
        created() {
            this.$data.app = this.$parent;
            if (storage.get('loadPostsOnLoad')) this.loadUserPosts();
        },
    };
</script>
