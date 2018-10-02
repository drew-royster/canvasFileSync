<template>
  <v-content>
    <v-layout row justify-center id="wrapper">
      <v-flex xs12 class="text-xs-center centered">
        <img id="logo" class="logo" src="~@/assets/icons_normal/icons/logo.svg" alt="electron-vue">
      </v-flex>
    </v-layout>
    <v-layout id="main-content" row>
      <v-flex xs3></v-flex>
      <v-flex xs6>
        <v-card>
          <v-card-text>
            <v-container>
              <v-form ref="form" v-model="valid" lazy-validation>
                <v-layout row>
                  <v-autocomplete
                    ref="schoolSearch"
                    v-model="school"
                    :items="schools"
                    :loading="isLoading"
                    :search-input.sync="search"
                    color="white"
                    hide-no-data
                    hide-selected
                    item-text="name"
                    item-value="domain"
                    label="School"
                    placeholder="Search for schools or enter domain"
                    prepend-icon="school"
                    return-object
                    required
                  ></v-autocomplete>
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
                    <v-switch label="Manual Mode" v-model="manual"></v-switch>
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
              </v-form>
            </v-container>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex xs3></v-flex>
    </v-layout>
  </v-content>
</template>

<script>
  const request = require('request-promise');
  export default {
    name: 'home',
    data() {
      return {
        manual: false,
        valid: false,
        school: null,
        schools: [],
        isLoading: false,
        search: null,
        authToken: null,
        authTokenRules: [
          v => !!v || 'auth token is required',
          v => (v && v.length > 10) || 'auth token is too short',
        ],
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
          uri: `https://canvas.instructure.com/api/v1/accounts/search?name=${val}`,
          json: true,
        };
        request(options).then((res) => {
          this.count = res.length;
          this.schools = res;
        }).catch((err) => {
          console.log(err);
        }).finally(() => {
          this.isLoading = false;
        });
      },
    },
    methods: {
      connect() {
        if (this.$refs.form.validate()) {
          try {
            // check if school has been searched for and found
            if (this.school && this.manual) {
              // manual connect using school.domain
              this.$store.commit('SET_CONNECTION_PARAMETERS', { rootURL: this.school.domain, authToken: this.authToken });
              this.$store.dispatch('connect');
            } else if (this.school && !this.manual) {
              // go to school.domain to login TODO
              this.$store.dispatch('goUniversityLogin', { rootURL: this.school.domain });
            } else if (!this.school && this.manual) {
              // manual connect using search value as URL
            } else if (!this.school && !this.manual) {
              // go to seach value as URL to login
            } else {
              alert('No domain specified');
            }
          } catch (err) {
            console.error(err);
          }
        }
      },
    },
  };
</script>

<style scoped>
  .centered
  {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .logo
  {
    margin-top: 5%;
    max-width: 100%;
  }

  #main-content
  {
    margin-top: 2%;
  }

  .link-btn
  {
    width: 150px;
  }
</style>
