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

const getStorage = () => {
    const data = window.localStorage.getItem('dmt');
    if (!data) return {};
    const parsed = JSON.parse(data);
    if (!parsed) return {};
    return parsed;
};
const setStorage = data => window.localStorage.setItem('dmt', JSON.stringify(data));

const get = key => getStorage()[key];

const set = (key, data) => {
    const store = getStorage();
    store[key] = data;
    setStorage(store);
};

const remove = key => {
    const store = getStorage();
    if (key in store) {
        delete store[key];
        setStorage(store);
    }
};

module.exports = { get, set, remove };
