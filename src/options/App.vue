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
          <div class="flex flex-col md:flex-row mb-4">
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
          <div class="flex flex-col md:flex-row">
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
                        <option v-for="l in languages" :value="l.code">{{ l.name }}</option>
                      </select>
                    </label>
                    <label class="ml-2 w-1/2">
                      <span class="text-dark">Timezone</span>
                      <select v-model="tmp.ipRule.tz" class="form-select mt-1 block w-full">
                        <option v-for="t in timezones" :value="t.zone">({{ t.offset }}) {{ t.zone }}</option>
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
                      <button @click="saveRule" class="bg-green-500 hover:bg-green-600 font-semibold text-white py-2 px-4 border border-green-500 rounded">Save</button>
                      <button @click="showModal = false" class="bg-transparent font-semibold py-2 px-4 rounded">
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else-if="modalType === Modal.CONFIRM_IP_DELETE || modalType === Modal.CONFIRM_WL_DELETE" class="w-1/3 modal h-128">
              <div class="flex flex-col px-6 pt-6 pb-8">
                <span class="text-center text-red-500 mb-4"><feather stroke-width="1" type="alert-circle" size="8em"></feather></span>
                <span class="my-1 text-xl font-semibold text-center">Are you sure you want to delete this rule?</span>
                <div class="my-4 text-center text-lg">
                  <div>{{ tmp.ipRule.name }}</div>
                  <div>{{ tmp.ipRule.ips.length }} rule(s)</div>
                </div>
                <div class="flex justify-center">
                  <button @click="reallyDelete" class="bg-red-500 hover:bg-red-600 font-semibold text-white py-2 px-4 border border-red-500 rounded">Yes, delete it!</button>
                  <button @click="showModal = false" class="bg-transparent font-semibold py-2 px-4 rounded">
                    Cancel
                  </button>
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
import * as lang from '../lib/language';
import * as tz from '../lib/tz';
import util from '../lib/util';
import webext from '../lib/webext';
import { directive as onClickaway } from 'vue-clickaway';
import { Component } from 'vue-property-decorator';
const uuidv4 = require('uuid/v4');

enum Modal {
  DEFAULT,
  IP_RULE,
  CONFIRM_IP_DELETE,
  CONFIRM_WL_DELETE,
}

@Component({
  directives: {
    onClickaway: onClickaway,
  },
})
export default class App extends Vue {
  public currentTab: string = 'about';
  public iconPath: string;
  public Modal = Modal;
  public modalType: Modal = Modal.DEFAULT;
  public ready: boolean = false;
  public showModal: boolean = false;
  public languages: lang.Language[] = lang.getAllLanguages();
  public timezones: tz.Timezone[] = tz.getTimezones();
  public errors: any = {
    ipRuleName: false,
    ipRuleIPs: false,
  };
  public version: string;
  public tmp: any = {
    ipRule: {
      id: '',
      name: '',
      lang: '',
      tz: '',
      ips: '',
    },
  };

  get darkMode(): boolean {
    return this.settings.config.theme === 'dark';
  }

  get settings(): any {
    return this['$store'].state;
  }

  activeTab(tab: string): string[] {
    return this.currentTab === tab ? ['active'] : ['hover:bg-primary-soft'];
  }

  changeTab(tab: string): void {
    window.location.hash = '#' + tab;
  }

  async created(): Promise<void> {
    this.iconPath = browser.runtime.getURL('icons/icon_32.png');
    this.version = browser.runtime.getManifest().version;

    await this['$store'].dispatch('initialize');

    if (window.location.hash === '#checklist') {
      this.currentTab = 'checklist';
    } else if (window.location.hash === '#iprules') {
      this.currentTab = 'iprules';
    } else if (window.location.hash === '#whitelist') {
      this.currentTab = 'whitelist';
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

  editIPRule(id: string): void {
    let rule: any = this.settings.ipRules.find(r => r.id === id);

    this.tmp.ipRule.id = rule.id;
    this.tmp.ipRule.name = rule.name;
    this.tmp.ipRule.lang = rule.lang;
    this.tmp.ipRule.tz = rule.tz;
    this.tmp.ipRule.ips = rule.ips.join('\n');

    this.showModal = true;
    this.modalType = Modal.IP_RULE;
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

  getLangName(langCode: string): string {
    return lang.getLanguage(langCode).name;
  }

  modalEventHandler(): void {
    if (this.showModal && this.ready) {
      this.showModal = false;
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
      this.settings.ipRules.splice(this.settings.ipRules.findIndex(r => r.id === this.tmp.ipRule.id), 1);

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

  async saveRule(): Promise<void> {
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
