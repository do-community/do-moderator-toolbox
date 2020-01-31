/*
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
*/

module.exports = () => {
    if (!document.body.classList.contains('signed-in')) return;
    if (!document.body.classList.contains('admin-user')) return;
    return {
        username: document.body.getAttribute('data-user-id'),
        first_name: document.body.querySelector('nav.navbar ul.primary li:last-child header').textContent.split(' ')[0],
        full_name: document.body.querySelector('nav.navbar ul.primary li:last-child header').textContent,
    };
};
