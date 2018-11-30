<template>
  <v-container>
    <v-content>
      <v-layout row id="wrapper">
        <v-flex xs3></v-flex>
        <v-flex xs6 class="text-xs-center">
          <v-card light>
            <v-card-text>
              <v-flex xs12>
                <img height="150px" width="150px" id="logo" class="logo" v-bind:src="logoURL" alt="Canvas File Sync Logo">
              </v-flex>
            </v-card-text>
          </v-card>
        </v-flex>
        <v-flex xs3></v-flex>
      </v-layout>
      <v-layout row>
        <v-flex xs3></v-flex>
        <v-flex xs6>
          <v-card>
            <v-card-text>
              <v-container>
                <v-layout row>
                  <v-autocomplete
                    id="school-search"
                    v-if="!manual"
                    ref="schoolSearch"
                    v-model="school"
                    :items="schools"
                    :loading="isLoading"
                    :search-input.sync="search"
                    color="white"
                    hide-no-data
                    hide-selected
                    item-text="name"
                    label="School"
                    placeholder="Search for schools"
                    prepend-icon="school"
                    return-object
                    required
                  ></v-autocomplete>
                  <v-text-field
                    v-else
                    placeholder="Enter schools canvas domain name"
                    v-model="schoolURL"
                    prepend-icon="school"
                    required
                  ></v-text-field>
                </v-layout>
                <v-layout v-if="manual" row>
                  <v-flex xs12>
                    <v-text-field
                      :rules="authTokenRules"
                      name="Auth Token"
                      label="Auth Token"
                      id="authToken"
                      v-model="authToken"
                      type="text"
                      prepend-icon="vpn_key"
                      @keyup.enter="connect"
                      required
                    ></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex>
                    <v-switch label="Hacker Mode" v-model="manual"></v-switch>
                  </v-flex>
                </v-layout>
                <v-layout justify-center>
                  <v-flex text-xs-center>
                    <v-btn
                      :disabled="!valid"
                      @click="connect"
                    >
                    CONNECT
                    </v-btn>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
          </v-card>
        </v-flex>
        <v-flex xs3></v-flex>
      </v-layout>
    </v-content>
  </v-container>
</template>

<script>
  const log = require('electron-log');
  const request = require('request-promise');
  export default {
    name: 'home',
    data() {
      return {
        manual: false,
        valid: false,
        school: null,
        schoolURL: null,
        schools: [],
        isLoading: false,
        search: null,
        authToken: null,
        logoURL: 'static/icons_normal/logo.png',
        authTokenRules: [
          v => !!v || 'auth token is required',
          v => (v && v.length > 10) || 'auth token is too short',
        ],
        options: [
          { value: '1', text: 'aa - 1' },
          { value: '2', text: 'ab - 2' },
          { value: '3', text: 'bc - 3' },
          { value: '4', text: 'cd - 4' },
          { value: '5', text: 'de - 5' },
        ],
        item: {
          value: '',
          text: '',
        },
      };
    },
    watch: {
      search(val) {
        // Items have already been loaded
        // if (this.items.length > 0) return;
        if (this.school && val !== this.school.name) {
          this.school = null;
        }
        this.isLoading = true;
        // Lazily load input items
        const options = {
          method: 'GET',
          uri: `https://canvas.instructure.com/api/v1/accounts/search?name=${val}&per_page=100`,
          json: true,
        };
        request(options).then((res) => {
          this.count = res.length;
          this.schools = res;
        }).catch((err) => {
          log.error(err);
        }).finally(() => {
          this.isLoading = false;
        });
      },
      school(val) {
        if (!this.manual && val !== null) {
          this.valid = true;
        } else if (!this.manual && val === null) {
          this.valid = false;
        }
      },
      manual(val) {
        if (val) {
          this.valid = true;
        } else {
          this.valid = false;
        }
      },
    },
    methods: {
      connect() {
        try {
          if (this.manual) {
            const cleanURL = this.cleanURL(this.schoolURL);
            this.$store.commit('SET_CONNECTION_PARAMETERS', { rootURL: cleanURL, authToken: this.authToken });
            this.$store.dispatch('connect');
            this.$router.push('/configure');
          } else {
            this.$store.dispatch('goUniversityLogin', { rootURL: this.school.domain });
          }
        } catch (err) {
          log.error(err);
        }
      },
      cleanURL(url) {
        let cleanedURL = url.replace('http://', '').replace('https://', '');
        if (cleanedURL.substring(cleanedURL.length - 1) === '/') {
          cleanedURL = cleanedURL.substring(0, cleanedURL.length - 1);
        }
        return cleanedURL;
      },
    },
  };
</script>
