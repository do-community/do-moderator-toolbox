/*
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
*/

const getMetaCSRF = require('../getMetaCSRF');

const fetchPage = async (userId, page) => {
    const resp = await fetch(`/community/api/users/${userId}/posts?page[number]=${page}&page[size]=12`, {
        method: 'GET',
        headers: {'x-csrf-token': getMetaCSRF()},
    }).catch(() => {});
    if (!resp) return;
    return await resp.json().catch(() => {});
};

const processBatch = async (requests, posts) => {
    const results = await Promise.all(requests);
    for (const data of results) {
        if (data && data.data) posts.push(...data.data);
    }
};

module.exports = async userId => {
    // Make the first request to get meta data
    const allPosts = [];
    const initial = await fetchPage(userId, 1).catch(() => {});
    if (initial && initial.data) allPosts.push(...initial.data);

    // If there are more pages, fetch them all in batches
    if (initial && initial.meta && initial.meta['total-pages'] && initial.meta['total-pages'] > 1) {
        let requests = [];
        let start = Date.now();
        for (let i = 2; i <= initial.meta['total-pages']; i++) {
            requests.push(fetchPage(userId, i));

            // Batch requests into chunks of 5
            if ((i - 1) % 5 === 0) {
                console.log(`Fetching ${i}... total pages ${initial.meta['total-pages']}`);
                await processBatch(requests, allPosts);

                // Add a delay, aiming for 1rps
                const delay = Math.max((5 * 1000) - (Date.now() - start));
                console.log(`Waiting for ${delay}ms before continuing fetching`);
                await new Promise(r => setTimeout(r, delay));

                // Reset for next batch
                requests = [];
                start = Date.now();
            }
        }

        // Handle any in the final batch
        await processBatch(requests, allPosts);
    }

    // Sort by date
    allPosts.sort((a, b) => { return b.attributes['created-at'] - a.attributes['created-at']; });

    // Done
    return allPosts;
};
