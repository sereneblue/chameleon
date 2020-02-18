<template>
  <div class="flex flex-col min-h-screen" :class="darkMode ? ['bg-dark'] : ['bg-light']">
    <div class="flex-none fixed w-full z-10">
      <div class="bg-primary flex items-center">
        <img class="h-6 mx-2" :src="iconPath" />
        <div @click="changeTab('about')" class="options-tab" :class="activeTab('about')">
          About
        </div>
        <div @click="changeTab('whitelist')" class="options-tab" :class="activeTab('whitelist')">
          Whitelist
        </div>
        <div @click="changeTab('iprules')" class="options-tab" :class="activeTab('iprules')">
          IP Rules
        </div>
        <div @click="changeTab('checklist')" class="options-tab" :class="activeTab('checklist')">
          Checklist
        </div>
      </div>
    </div>
    <div class="flex-grow px-4 pt-12 z-0">
      <div v-show="currentTab === 'about'" class="text-2xl flex flex-col">
        <div class="border-b-2 border-primary">
          <div class="text-3xl mb-4">Chameleon v{{ version }}</div>
          <div class="flex flex-col xl:flex-row mb-4">
            <button class="transparent-btn">
              <div class="flex items-center">
                <feather class="mr-2" type="help-circle" size="1em"></feather>
                <a href="https://sereneblue.github.io/chameleon/#/wiki">Wiki</a>
              </div>
            </button>
            <button class="transparent-btn">
              <div class="flex items-center">
                <feather class="mr-2" type="alert-triangle" size="1em"></feather>
                <a href="https://github.com/sereneblue/chameleon/issues">Issue Tracker</a>
              </div>
            </button>
            <button class="transparent-btn">
              <div class="flex items-center">
                <feather class="mr-2" type="message-circle" size="1em"></feather>
                <a href="https://sereneblue.github.io/chameleon/#/support">Support</a>
              </div>
            </button>
            <button class="transparent-btn">
              <div class="flex items-center">
                <feather class="mr-2" type="github" size="1em"></feather>
                <a href="https://github.com/sereneblue/chameleon">Source Code</a>
              </div>
            </button>
            <button class="transparent-btn">
              <div class="flex items-center">
                <feather class="mr-2" type="mic" size="1em"></feather>
                <a href="https://crowdin.com/project/chameleon">Help Translate</a>
              </div>
            </button>
          </div>
        </div>
        <div class="mt-4">
          <div class="text-3xl mb-4">Settings</div>
          <div class="flex flex-col xl:flex-row">
            <button class="transparent-btn">
              <div class="flex items-center">
                <feather class="mr-2" type="upload" size="1em"></feather>
                Import
              </div>
            </button>
            <button class="transparent-btn">
              <div class="flex items-center">
                <feather class="mr-2" type="download" size="1em"></feather>
                Export
              </div>
            </button>
            <button class="transparent-btn">
              <div class="flex items-center">
                <feather class="mr-2" type="rotate-ccw" size="1em"></feather>
                Reset to Default
              </div>
            </button>
          </div>
        </div>
      </div>
      <div v-show="currentTab === 'whitelist'" class="text-2xl flex flex-col">
        <div class="flex flex-col md:flex-row">
          <button @click="createNewWhitelistRule" class="transparent-btn">
            <div class="flex items-center">
              <feather class="mr-2" type="plus" size="1em"></feather>
              Create new rule
            </div>
          </button>
        </div>
        <input
          v-model="query"
          class="bg-gray-300 appearance-none border-2 border-gray-300 rounded w-full py-2 px-4 my-4 text-gray-800 leading-tight focus:outline-none focus:bg-white focus:border-primary"
          type="text"
          placeholder="Search rules"
        />
        <div class="flex flex-wrap pb-12">
          <table id="iprules" class="w-full">
            <thead class="border-b-2">
              <tr class="flex flex-col flex-no wrap md:table-row text-left">
                <th class="font-bold py-4 w-2/5">Whitelist Rule</th>
                <th class="font-bold py-4">Profile</th>
                <th class="font-bold py-4">URLs</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="r in filteredWhitelist" :key="r.id" class="flex flex-col px-2 border-b-2 md:table-row text-left">
                <td class="flex justify-between py-4 mr-8">
                  <span class="max-w-lg truncate">{{ r.name }} ({{ r.sites.length }})</span>
                  <div>
                    <button @click="editWLRule(r.id)" class="px-2">
                      <feather type="edit-2" size="1em"></feather>
                    </button>
                    <button @click="deleteWLRule(r.id)" class="px-2">
                      <feather type="trash" size="1em"></feather>
                    </button>
                  </div>
                </td>
                <td class="py-4">
                  {{ getProfile(r.profile) }}
                </td>
                <td class="py-4">
                  {{
                    r.sites
                      .map(s => s.domain)
                      .slice(0, 3)
                      .join(', ')
                  }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div v-show="currentTab === 'iprules'" class="text-2xl flex flex-col">
        <div class="flex flex-col md:flex-row">
          <button @click="createNewRule" class="transparent-btn">
            <div class="flex items-center">
              <feather class="mr-2" type="plus" size="1em"></feather>
              Create new rule
            </div>
          </button>
          <button @click="reloadIPInfo" class="transparent-btn">
            <div class="flex items-center">
              <feather class="mr-2" type="refresh-cw" size="1em"></feather>
              Reload IP info
            </div>
          </button>
        </div>
        <div class="flex flex-wrap pb-12">
          <table id="iprules" class="w-full">
            <thead class="border-b-2">
              <tr class="flex flex-col flex-no wrap md:table-row text-left">
                <th class="font-bold py-4 w-2/5">IP Rule</th>
                <th class="font-bold py-4">Language</th>
                <th class="font-bold py-4">Timezone</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="r in settings.ipRules" :key="r.id" class="flex flex-col px-2 border-b-2 md:table-row text-left">
                <td class="flex justify-between py-4 mr-8">
                  <span class="max-w-lg truncate">{{ r.name }} ({{ r.ips.length }})</span>
                  <div>
                    <button @click="editIPRule(r.id)" class="px-2">
                      <feather type="edit-2" size="1em"></feather>
                    </button>
                    <button @click="deleteIPRule(r.id)" class="px-2">
                      <feather type="trash" size="1em"></feather>
                    </button>
                  </div>
                </td>
                <td class="py-4">{{ getLangName(r.lang) }}</td>
                <td class="py-4">{{ r.tz }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div v-show="currentTab === 'checklist'" class="text-2xl flex flex-col">
        <div class="text-xl mb-4">
          <div class="mb-0">Note: To view a list of changed preferences, visit: <strong>about:support#prefs-tbody</strong></div>
          <div class="mb-2">Create option if it does not exist.</div>
        </div>
        <div>
          <div v-for="c in checklist" :key="c.preference" class="border-primary border-1 p-4 shadow-sm mb-8 rounded fg">
            <div class="text-md pb-2 mb-4 border-b-2 border-primary flex items-center">
              <div>{{ c.name }}</div>
              <feather @click="showInfo(c)" class="ml-2 hover:cursor-pointer" type="help-circle"></feather>
            </div>
            <div>
              <span class="break-all">{{ c.preference }}</span>
              <div>
                Set to <strong>{{ c.value }}</strong>
              </div>
            </div>
            <p v-if="c.causeBreak" class="flex items-center text-md mt-4"><feather class="mr-2" type="alert-triangle"></feather>Likely to break sites</p>
          </div>
        </div>
      </div>
    </div>
    <transition name="fade" @after-enter="toggleOpen" @after-leave="toggleOpen">
      <div v-show="showModal" class="h-screen w-full fixed top-0 z-30 bg-dark-modal">
        <div class="flex flex-col justify-center h-full">
          <div v-on-clickaway="modalEventHandler">
            <div v-if="modalType === Modal.IP_RULE" class="w-3/4 modal h-128">
              <div class="px-6 pt-6 pb-8 text-xl">
                <div class="text-xl font-bold border-primary border-b-2 mb-4">IP Rule Editor</div>
                <div class="w-full">
                  <div class="mb-4">
                    <label for="headers.spoofIP.rangeFrom">
                      <span class="text-dark">Name</span>
                    </label>
                    <input v-model="tmp.ipRule.name" name="headers.spoofIP.rangeFrom" class="block w-full form-input" :class="{ error: errors.ipRuleName }" />
                  </div>
                  <div class="flex items-center mb-4">
                    <label class="mr-2 w-1/2">
                      <span class="text-dark">Language</span>
                      <select v-model="tmp.ipRule.lang" class="form-select mt-1 block w-full">
                        <option v-for="l in languages" :key="l.code" :value="l.code">{{ l.name }}</option>
                      </select>
                    </label>
                    <label class="ml-2 w-1/2">
                      <span class="text-dark">Timezone</span>
                      <select v-model="tmp.ipRule.tz" class="form-select mt-1 block w-full">
                        <option v-for="t in timezones" :key="t.zone" :value="t.zone">({{ t.offset }}) {{ t.zone }}</option>
                      </select>
                    </label>
                  </div>
                  <div>
                    <div class="mb-2">IP Ranges / Addresses</div>
                    <textarea
                      v-model="tmp.ipRule.ips"
                      class="form-textarea mt-1 text-xl block w-full"
                      :class="{ error: errors.ipRuleIPs }"
                      rows="10"
                      placeholder="One IP/IP range per line"
                    ></textarea>
                  </div>
                  <div class="flex items-center">
                    <div class="flex mt-6 w-full">
                      <button @click="saveIPRule" class="bg-green-500 hover:bg-green-600 font-semibold text-white py-2 px-4 border border-green-500 rounded">
                        Save
                      </button>
                      <button @click="closeModal" class="bg-transparent font-semibold py-2 px-4 rounded">
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else-if="modalType === Modal.WL_RULE" class="w-3/4 modal h-128">
              <div class="px-6 pt-6 pb-8 text-xl">
                <div class="text-xl font-bold border-primary border-b-2 mb-4">Whitelist Rule Editor</div>
                <div class="flex-col lg:flex">
                  <div class="mb-2 md:mb-0">
                    <div class="mb-2">
                      <label>
                        <span class="text-dark">Name</span>
                      </label>
                      <input v-model="tmp.wlRule.name" class="block w-full form-input" :class="{ error: errors.wlRuleName }" />
                    </div>
                    <div class="mb-2">
                      <label>
                        Accept-Language
                        <select v-model="tmp.wlRule.lang" class="form-select mt-1 block w-full">
                          <option v-for="l in languages" :key="l.code" :value="l.code">{{ l.name }}</option>
                        </select>
                      </label>
                    </div>
                    <div class="mb-2">
                      <label>
                        Profile
                        <select v-model="tmp.wlRule.profile" class="form-select mt-1 block w-full">
                          <option value="default">Default Whitelist Profile</option>
                          <option value="none">Real Profile</option>
                          <option v-for="p in profileList" :key="p.id" :value="p.id">{{ p.name }}</option>
                        </select>
                      </label>
                    </div>
                    <div class="mb-2">
                      <label for="headers.spoofIP.rangeFrom">
                        <span class="text-dark">Header IP (VIa & X-Forwarded-For)</span>
                      </label>
                      <input v-model="tmp.wlRule.spoofIP" class="block w-full form-input" :class="{ error: errors.wlRuleIP }" />
                    </div>
                    <div class="my-4">
                      <div class="flex justify-around">
                        <div>
                          <div class="mb-2">
                            <div class="form-switch inline-block align-middle">
                              <input v-model="tmp.wlRule.options.ref" id="ref" type="checkbox" class="form-switch-checkbox" />
                              <label class="form-switch-label" for="ref"></label>
                            </div>
                            <label class="text-sm">Disable Referer</label>
                          </div>
                          <div>
                            <div class="form-switch inline-block align-middle">
                              <input v-model="tmp.wlRule.options.ws" id="ws" type="checkbox" class="form-switch-checkbox" />
                              <label class="form-switch-label" for="ws"></label>
                            </div>
                            <label class="text-sm">Disable WebSocket</label>
                          </div>
                        </div>
                        <div>
                          <div class="mb-2">
                            <div class="form-switch inline-block align-middle">
                              <input v-model="tmp.wlRule.options.name" id="name" type="checkbox" class="form-switch-checkbox" />
                              <label class="form-switch-label" for="name"></label>
                            </div>
                            <label class="text-sm">Enable protect window name</label>
                          </div>
                          <div>
                            <div class="form-switch inline-block align-middle">
                              <input v-model="tmp.wlRule.options.tz" id="tz" type="checkbox" class="form-switch-checkbox" />
                              <label class="form-switch-label" for="tz"></label>
                            </div>
                            <label class="text-sm">Enable timezone spoofing</label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>Sites</div>
                  <div class="text-sm">One rule per line: domain,[optional regex pattern]</div>
                  <textarea
                    v-model="tmp.wlRule.sites"
                    class="form-textarea mt-1 text-xl block w-full"
                    :class="{ error: errors.wlRuleSites }"
                    rows="7"
                    placeholder="Ex. reddit.com,r/(webdev|popular|privacy)"
                  ></textarea>
                </div>
                <div class="flex items-center">
                  <div class="flex mt-6 w-full">
                    <button @click="saveWLRule" class="bg-green-500 hover:bg-green-600 font-semibold text-white py-2 px-4 border border-green-500 rounded">
                      Save
                    </button>
                    <button @click="closeModal" class="bg-transparent font-semibold py-2 px-4 rounded">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div v-else-if="modalType === Modal.CONFIRM_IP_DELETE" class="w-1/3 modal h-128">
              <div class="flex flex-col px-6 pt-6 pb-8">
                <span class="text-center text-red-500 mb-4"><feather stroke-width="1" type="alert-circle" size="8em"></feather></span>
                <span class="my-1 text-xl font-semibold text-center">Are you sure you want to delete this rule?</span>
                <div class="my-4 text-center text-lg">
                  <div>{{ tmp.ipRule.name }}</div>
                  <div>{{ tmp.ipRule.ips.length }} rule(s)</div>
                </div>
                <div class="flex justify-center">
                  <button @click="reallyDelete" class="bg-red-500 hover:bg-red-600 font-semibold text-white py-2 px-4 border border-red-500 rounded">Yes, delete it!</button>
                  <button @click="closeModal" class="bg-transparent font-semibold py-2 px-4 rounded">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
            <div v-else-if="modalType === Modal.CONFIRM_WL_DELETE" class="w-1/3 modal h-128">
              <div class="flex flex-col px-6 pt-6 pb-8">
                <span class="text-center text-red-500 mb-4"><feather stroke-width="1" type="alert-circle" size="8em"></feather></span>
                <span class="my-1 text-xl font-semibold text-center">Are you sure you want to delete this rule?</span>
                <div class="my-4 text-center text-lg">
                  <div>{{ tmp.wlRule.name }}</div>
                  <div>{{ tmp.wlRule.sites.length }} site(s)</div>
                </div>
                <div class="flex justify-center">
                  <button @click="reallyDelete" class="bg-red-500 hover:bg-red-600 font-semibold text-white py-2 px-4 border border-red-500 rounded">Yes, delete it!</button>
                  <button @click="closeModal" class="bg-transparent font-semibold py-2 px-4 rounded">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
            <div v-else-if="modalType === Modal.CHECKLIST_INFO" class="w-1/3 modal h-128">
              <div class="flex flex-col px-6 pt-6 pb-8">
                <span class="my-1 text-xl font-semibold text-center">{{ tmp.checklistItem.name }}</span>
                <div class="my-4 text-center text-lg">
                  {{ tmp.checklistItem.description }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Checklist, ChecklistItem } from '../lib/checklist';
import * as lang from '../lib/language';
import * as prof from '../lib/profiles';
import * as tz from '../lib/tz';
import util from '../lib/util';
import webext from '../lib/webext';
import { directive as onClickaway } from 'vue-clickaway';
import { Component } from 'vue-property-decorator';
const uuidv4 = require('uuid/v4');

enum Modal {
  DEFAULT,
  IP_RULE,
  WL_RULE,
  CONFIRM_IP_DELETE,
  CONFIRM_WL_DELETE,
  CHECKLIST_INFO,
}

@Component({
  directives: {
    onClickaway: onClickaway,
  },
})
export default class App extends Vue {
  public REGEX_DOMAIN: any = /^(?:^|\s)((https?:\/\/)?(?:localhost|[\w-]+(?:\.[\w-]+)+)(:\d+)?(\/\S*)?)/;
  public Modal = Modal;
  public modalType: Modal = Modal.DEFAULT;
  public checklist: ChecklistItem[] = Checklist;
  public currentTab: string = 'about';
  public iconPath: string;
  public query: string = '';
  public ready: boolean = false;
  public showModal: boolean = false;
  public languages: lang.Language[] = lang.getAllLanguages();
  public profiles: prof.ProfileListItem[] = new prof.Generator().getAllProfiles();
  public timezones: tz.Timezone[] = tz.getTimezones();
  public errors: any = {
    ipRuleName: false,
    ipRuleIPs: false,
    wlRuleName: false,
    wlRuleIP: false,
    wlRuleSites: false,
  };
  public version: string;
  public tmp: any = {
    checklistItem: {
      description: '',
    },
    ipRule: {
      id: '',
      name: '',
      lang: '',
      tz: '',
      ips: '',
    },
    wlRule: {
      id: '',
      name: '',
      sites: '',
      lang: '',
      profile: '',
      spoofIP: '',
      options: {
        name: false,
        ref: false,
        tz: false,
        ws: false,
      },
    },
  };

  get darkMode(): boolean {
    return this.settings.config.theme === 'dark';
  }

  get filteredWhitelist(): any {
    return this.settings.whitelist.rules.filter(r => {
      return (
        r.name.toLowerCase().includes(this.query) ||
        JSON.stringify(r.sites.map(s => s.domain))
          .toLowerCase()
          .includes(this.query)
      );
    });
  }

  get profileList(): prof.ProfileListItem[] {
    return [].concat.apply([], Object.values(this.profiles));
  }

  get settings(): any {
    return this['$store'].state;
  }

  activeTab(tab: string): string[] {
    return this.currentTab === tab ? ['active'] : ['hover:bg-primary-soft'];
  }

  addSite(): void {
    this.tmp.wlRule.sites.push({
      domain: '',
      pattern: '',
    });
  }

  changeTab(tab: string): void {
    window.location.hash = '#' + tab;
  }

  async created(): Promise<void> {
    this.iconPath = browser.runtime.getURL('icons/icon.svg');
    this.version = browser.runtime.getManifest().version_name;

    await this['$store'].dispatch('initialize');

    let hash = window.location.hash.split('?');
    let queryParams = hash.length > 1 ? hash[1] : '';

    if (hash[0] === '#checklist') {
      this.currentTab = 'checklist';
    } else if (hash[0] === '#iprules') {
      this.currentTab = 'iprules';
    } else if (hash[0] === '#whitelist') {
      this.currentTab = 'whitelist';

      let params = new URLSearchParams(queryParams);

      let id = params.get('id');
      let site = params.get('site');

      if (id) {
        this.editWLRule(id);
      } else {
        if (site) {
          this.createNewWhitelistRule();
          this.tmp.wlRule.sites = site;
        }
      }
    }
  }

  closeModal(): void {
    this.showModal = false;

    for (let e in this.errors) {
      this.errors[e] = false;
    }
  }

  createNewRule(): void {
    this.tmp.ipRule.id = '';
    this.tmp.ipRule.name = '';
    this.tmp.ipRule.lang = this.languages[0].code;
    this.tmp.ipRule.tz = this.timezones[0].zone;
    this.tmp.ipRule.ips = '';

    this.showModal = true;
    this.modalType = Modal.IP_RULE;
  }

  createNewWhitelistRule(): void {
    this.tmp.wlRule.id = '';
    this.tmp.wlRule.name = '';
    this.tmp.wlRule.sites = '';
    this.tmp.wlRule.lang = this.languages[0].code;
    this.tmp.wlRule.profile = 'default';
    this.tmp.wlRule.spoofIP = '';
    this.tmp.wlRule.options.name = false;
    this.tmp.wlRule.options.ref = false;
    this.tmp.wlRule.options.tz = false;
    this.tmp.wlRule.options.ws = false;

    this.showModal = true;
    this.modalType = Modal.WL_RULE;
  }

  editIPRule(id: string): void {
    let rule: any = this.settings.ipRules.find(r => r.id === id);

    if (rule) {
      this.tmp.ipRule.id = rule.id;
      this.tmp.ipRule.name = rule.name;
      this.tmp.ipRule.lang = rule.lang;
      this.tmp.ipRule.tz = rule.tz;
      this.tmp.ipRule.ips = rule.ips.join('\n');

      this.showModal = true;
      this.modalType = Modal.IP_RULE;
    }
  }

  editWLRule(id: string): void {
    let rule: any = this.settings.whitelist.rules.find(r => r.id === id);
    this.tmp.wlRule = Object.assign({}, rule);

    this.tmp.wlRule.sites = rule.sites.map(r => Object.values(r).join(',')).join('\n');

    this.showModal = true;
    this.modalType = Modal.WL_RULE;
  }

  deleteIPRule(id: string): void {
    let rule: any = this.settings.ipRules.find(r => r.id === id);

    this.tmp.ipRule.id = rule.id;
    this.tmp.ipRule.name = rule.name;
    this.tmp.ipRule.lang = rule.lang;
    this.tmp.ipRule.tz = rule.tz;
    this.tmp.ipRule.ips = rule.ips;

    this.showModal = true;
    this.modalType = Modal.CONFIRM_IP_DELETE;
  }

  deleteWLRule(id: string): void {
    let rule: any = this.settings.whitelist.rules.find(r => r.id === id);

    this.tmp.wlRule = Object.assign({}, rule);

    this.showModal = true;
    this.modalType = Modal.CONFIRM_WL_DELETE;
  }

  deleteSite(index: number): void {
    this.tmp.wlRule.sites.splice(index, 1);
    if (index === 0 && this.tmp.wlRule.sites.length === 0) {
      this.tmp.wlRule.sites.push({
        domain: '',
        pattern: '',
      });
    }
  }

  getLangName(langCode: string): string {
    return lang.getLanguage(langCode).name;
  }

  getProfile(profile: string): string {
    if (profile === 'default') {
      return 'Default Whitelist Profile';
    } else if (profile === 'none') {
      return 'None';
    }

    return this.profileList.find(p => p.id === profile).name;
  }
  modalEventHandler(): void {
    if (this.showModal && this.ready) {
      this.closeModal();
    }
  }

  mounted(): void {
    // listen for theme change
    browser.runtime.onMessage.addListener(
      function(request: any): void {
        if (request.action === 'save') {
          this.settings.config = Object.assign(this.settings.config, request.data.config);
        }
      }.bind(this)
    );

    window.onhashchange = function() {
      if (window.location.hash === '#checklist') {
        this.currentTab = 'checklist';
      } else if (window.location.hash === '#iprules') {
        this.currentTab = 'iprules';
      } else if (window.location.hash === '#whitelist') {
        this.currentTab = 'whitelist';
      } else {
        this.currentTab = 'about';
      }
    }.bind(this);
  }

  reallyDelete(): void {
    if (this.modalType === Modal.CONFIRM_IP_DELETE) {
      this.settings.ipRules.splice(
        this.settings.ipRules.findIndex(r => r.id === this.tmp.ipRule.id),
        1
      );

      this.showModal = false;
      this.modalType = Modal.DEFAULT;

      webext.sendToBackground(this.settings);
    } else {
      this.settings.whitelist.rules.splice(
        this.settings.whitelist.rules.findIndex(r => r.id === this.tmp.wlRule.id),
        1
      );

      this.showModal = false;
      this.modalType = Modal.DEFAULT;

      webext.sendToBackground(this.settings);
    }
  }

  reloadIPInfo(): void {
    browser.runtime.sendMessage({
      action: 'reloadIPInfo',
    });
  }

  async saveIPRule(): Promise<void> {
    this.tmp.ipRule.name = this.tmp.ipRule.name.trim();
    this.tmp.ipRule.ips = this.tmp.ipRule.ips.trim();
    if (this.tmp.ipRule.name === '') {
      this.errors.ipRuleName = true;
      return;
    } else {
      this.errors.ipRuleName = false;
    }

    if (this.tmp.ipRule.ips === '') {
      this.errors.ipRuleIPs = true;
      return;
    } else {
      this.errors.ipRuleIPs = false;
    }

    // validate ip/ip ranges
    let rules = this.tmp.ipRule.ips.split('\n').map(r => r.trim());
    for (let i = 0; i < rules.length; i++) {
      let isValid: boolean = false;
      let ip = rules[i].split('-');
      if (ip.length === 1) {
        isValid = util.validateIPRange('0.0.0.0', ip[0]);
      } else if (ip.length === 2) {
        isValid = util.validateIPRange(ip[0], ip[1]);
      } else {
        isValid = false;
      }

      if (!isValid) {
        this.errors.ipRuleIPs = true;
        return;
      }
    }

    this.errors.ipRules = false;

    if (this.tmp.ipRule.id) {
      let idx: number = this.settings.ipRules.findIndex(r => r.id === this.tmp.ipRule.id);
      this.settings.ipRules[idx] = Object.assign({}, this.tmp.ipRule, { ips: rules });
    } else {
      this.settings.ipRules.push(Object.assign({}, this.tmp.ipRule, { id: uuidv4(), ips: rules }));
    }

    webext.sendToBackground(this.settings);

    this.showModal = false;
  }

  async saveWLRule(): Promise<void> {
    this.tmp.wlRule.name = this.tmp.wlRule.name.trim();
    if (this.tmp.wlRule.name === '') {
      this.errors.wlRuleName = true;
      return;
    } else {
      this.errors.wlRuleName = false;
    }

    // validate ip
    if (this.tmp.wlRule.spoofIP != '') {
      if (!util.isValidIP(this.tmp.wlRule.spoofIP)) {
        this.errors.wlRuleIP = true;
        return;
      } else {
        this.errors.wlRuleIP = false;
      }
    }

    // validate sites patterns
    let sites = this.tmp.wlRule.sites.split('\n').map(s => s.split(','));

    let foundDomains = {};
    for (let i = 0; i < sites.length; i++) {
      if (sites[i].length > 2) {
        this.errors.wlRuleSites = true;
        return;
      }

      // check if already a rule
      if (foundDomains[sites[i][0]]) {
        this.errors.wlRuleSites = true;
        return;
      }

      // test if valid domain
      if (sites[i][0] === '' || !this.REGEX_DOMAIN.test(sites[i][0])) {
        this.errors.wlRuleSites = true;
        return;
      }

      foundDomains[sites[i][0]] = true;
    }

    this.errors.wlRuleSites = false;

    sites = sites.map(s => {
      return s.length === 2
        ? {
            domain: s[0],
            pattern: s[1],
          }
        : {
            domain: s[0],
          };
    });

    if (this.tmp.wlRule.id) {
      let idx: number = this.settings.whitelist.rules.findIndex(r => r.id === this.tmp.wlRule.id);
      this.settings.whitelist.rules[idx] = Object.assign({}, this.tmp.wlRule, { sites });
    } else {
      this.settings.whitelist.rules.push(Object.assign({}, this.tmp.wlRule, { id: uuidv4(), sites }));
    }

    webext.sendToBackground(this.settings);

    this.showModal = false;
  }

  showInfo(checklistItem: any): void {
    this.tmp.checklistItem = checklistItem;
    this.modalType = Modal.CHECKLIST_INFO;
    this.showModal = true;
  }

  toggleOpen(): void {
    this.ready = !this.ready;
    if (!this.ready) this.modalType = Modal.DEFAULT;
  }
}
</script>

<style type="text/css">
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.ps {
  height: 100%;
}

.ps__rail-y {
  opacity: 0.6 !important;
}
</style>
