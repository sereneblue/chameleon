<template>
  <div class="app h-screen flex" :class="[theme.bg]">
    <div class="text-xs bg-primary flex-none flex-col text-center">
      <div @click="setSelected('tab', 'main')" class="tab" :class="activeTab('main')">
        <feather type="home" size="1.5em"></feather>
      </div>
      <div @click="setSelected('tab', 'profile')" class="tab" :class="activeTab('profile')">
        <feather type="globe" size="1.5em"></feather>
      </div>
      <div @click="setSelected('tab', 'headers')" class="tab" :class="activeTab('headers')">
        <feather type="code" size="1.5em"></feather>
      </div>
      <div @click="setSelected('tab', 'options')" class="tab" :class="activeTab('options')">
        <feather type="sliders" size="1.5em"></feather>
      </div>
      <div @click="setSelected('tab', 'whitelist')" class="tab" :class="activeTab('whitelist')">
        <feather type="edit" size="1.5em"></feather>
      </div>
      <div @click="openOptionsPage" class="tab hover:bg-primary-soft">
        <feather type="settings" size="1.5em"></feather>
      </div>
    </div>
    <div class="flex-grow flex-col justify-around">
      <div v-if="isSelected('tab', 'main')">
        <div class="text-center mt-16">
          <div class="my-6 h-24">
            <div class="inline-block cursor-pointer" @click="toggleChameleon">
              <feather v-if="settings.config.enabled" type="shield" class="text-primary" size="6em" stroke-width="2" />
              <feather v-else type="shield-off" class="text-red-500" size="6em" stroke-width="2" />
            </div>
          </div>
          <div class="text-2xl" :class="[theme.text]">Chameleon is {{ settings.config.enabled ? 'enabled' : 'disabled' }}</div>
          <div class="text-lg mb-6" :class="[theme.text]">v{{ version }}</div>
          <div class="flex justify-center text-sm">
            <button @click="toggleTheme" class="rounded-lg cursor-pointer mr-2" :class="[theme.fg, theme.text]">
              <div class="flex items-center px-2 py-1">
                <feather v-if="darkMode" type="moon" size="1.5em"></feather>
                <feather v-else type="sun" size="1.5em"></feather>
                <span class="ml-1">{{ darkMode ? 'Dark' : 'Light' }}</span>
              </div>
            </button>
            <button @click="toggleNotifications" class="rounded-lg cursor-pointer" :class="[theme.fg, theme.text]">
              <div class="flex items-center px-2 py-1 ">
                <feather v-if="settings.config.notificationsEnabled" type="bell" size="1.5em"></feather>
                <feather v-else type="bell-off" size="1.5em"></feather>
                <span class="ml-1">Notifications</span>
              </div>
            </button>
          </div>
        </div>
        <div>
          <div class="text-center px-4 py-8">
            <div class="text-xs uppercase opacity-75 tracking-widest" :class="[theme.text]">Current Profile</div>
            <div class="text-lg" :class="[theme.text]">Android &middot; Firefox 77</div>
            <div class="text-lg" :class="[theme.text]">1366x768</div>
            <div class="text-lg" :class="[theme.text]">Europe/Berlin</div>
            <button
              v-show="['random', 'randomDesktop', 'randomMobile'].includes(settings.profile.selected)"
              class="inline-block mx-auto rounded-lg cursor-pointer px-2 py-1 my-1"
              :class="[theme.fg, theme.text]"
            >
              <div class="flex items-center">
                <feather type="repeat" size=".8em"></feather>
                <span class="ml-1 text-xs">change</span>
              </div>
            </button>
          </div>
          <div class="absolute bottom-0 py-2" :class="[theme.fg, theme.text]" style="width: -moz-available;">
            <div class="text-center text-sm uppercase mb-2 tracking-wider">on this page</div>
            <div class="flex w-full justify-around">
              <div class="">
                <feather type="headphones" size="1.5em"></feather>
              </div>
              <div class="">
                <feather type="box" size="1.5em"></feather>
              </div>
              <div class="">
                <feather type="calendar" size="1.5em"></feather>
              </div>
              <div class="">
                <feather type="monitor" size="1.5em"></feather>
              </div>
              <div class="">
                <feather type="wifi" size="1.5em"></feather>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else-if="isSelected('tab', 'profile')" class="m-4 text-md">
        <div class="text-lg border-primary border-b-2 mb-4" :class="[theme.text]">Profile</div>
        <div class="flex" :class="[theme.text]">
          <div class="flex flex-col mr-16">
            <label class="inline-flex items-center mb-2">
              <input @click="setSelected('profile', 'none')" type="radio" class="form-radio" :checked="isSelected('profile', 'none')" />
              <span class="ml-2">Real Profile</span>
            </label>
            <label class="inline-flex items-center">
              <input @click="setSelected('profile', 'random')" type="radio" class="form-radio" :checked="isSelected('profile', 'random')" />
              <span class="ml-2">Random</span>
            </label>
          </div>
          <div class="flex flex-col">
            <label class="inline-flex items-center mb-2">
              <input @click="setSelected('profile', 'randomDesktop')" type="radio" class="form-radio" :checked="isSelected('profile', 'randomDesktop')" />
              <span class="ml-2">Random Profile (Desktop)</span>
            </label>
            <label class="inline-flex items-center">
              <input @click="setSelected('profile', 'randomMobile')" type="radio" class="form-radio" :checked="isSelected('profile', 'randomMobile')" />
              <span class="ml-2">Random Profile (Mobile)</span>
            </label>
          </div>
        </div>
        <div class="flex items-center mb-2">
          <label class="w-full mt-4">
            <span :class="[theme.text]">Change periodically</span>
            <select @change="setOption($event)" :value="settings.profile.interval.option" name="profile.interval.option" class="form-select mt-1 block w-full">
              <option value="0">No</option>
              <option value="-1">Custom interval</option>
              <option value="1">Every minute</option>
              <option value="5">Every 5 minutes</option>
              <option value="10">Every 10 minutes</option>
              <option value="20">Every 20 minutes</option>
              <option value="30">Every 30 minutes</option>
              <option value="40">Every 40 minutes</option>
              <option value="50">Every 50 minutes</option>
              <option value="60">Every 60 minutes</option>
            </select>
          </label>
        </div>
        <div v-show="settings.profile.interval.option == -1" class="flex justify-around mb-2 w-full">
          <input class="block w-2/5 form-input mr-2" placeholder="Min (minutes)" />
          <input class="block w-2/5 form-input" placeholder="Max (minutes)" />
        </div>
        <div class="mt-6" :class="[theme.text]">
          <ul class="flex text-center w-full">
            <li @click="setSelected('os', 'windows')" :class="[theme.fg, isSelected('os', 'windows') ? 'active' : '']" class="group rounded-l-sm cursor-pointer">
              Windows
            </li>
            <li @click="setSelected('os', 'macOS')" :class="[theme.fg, isSelected('os', 'macOS') ? 'active' : '']" class="group cursor-pointer">
              macOS
            </li>
            <li @click="setSelected('os', 'linux')" :class="[theme.fg, isSelected('os', 'linux') ? 'active' : '']" class="group cursor-pointer">
              Linux
            </li>
            <li @click="setSelected('os', 'ios')" :class="[theme.fg, isSelected('os', 'ios') ? 'active' : '']" class="group cursor-pointer">
              iOS
            </li>
            <li @click="setSelected('os', 'android')" :class="[theme.fg, isSelected('os', 'android') ? 'active' : '']" class="group rounded-r-sm cursor-pointer">
              Android
            </li>
          </ul>
          <div v-show="currentProfileGroup" class="mt-2 rounded-sm" :class="[theme.fg, settings.profile.interval.option != -1 ? 'h-80' : 'h-64']">
            <perfect-scrollbar class="pl-3 pr-3">
              <div class="profile-item" :class="[theme.fg]">
                <label :class="{ 'opacity-50': isExcluded(currentProfileGroup) }" class="flex items-center cursor-pointer">
                  <input @click="setSelected('profile', currentProfileGroup)" :checked="isSelected('profile', currentProfileGroup)" type="radio" class="form-radio" />
                  <span class="ml-2">Random {{ displayOS }} Browsers</span>
                </label>
                <div class="flex items-center">
                  Exclude
                  <input @click="excludeProfile(currentProfileGroup)" :checked="isExcluded(currentProfileGroup)" type="checkbox" class="ml-2 text-primary form-checkbox" />
                </div>
              </div>
              <div v-for="p in profileListing" class="profile-item" :class="[theme.fg]">
                <label class="flex items-center cursor-pointer" :class="{ 'opacity-50': p.excluded }">
                  <input @click="setSelected('profile', p.id)" :checked="isSelected('profile', p.id)" type="radio" class="form-radio" />
                  <span class="ml-2">{{ p.name }}</span>
                </label>
                <div class="flex items-center">
                  <input @click="excludeProfile(p.id)" :checked="p.excluded" type="checkbox" class="ml-2 text-primary form-checkbox" />
                </div>
              </div>
            </perfect-scrollbar>
          </div>
        </div>
      </div>
      <div v-else-if="isSelected('tab', 'headers')" class="m-4 text-md">
        <div class="text-lg border-primary border-b-2 mb-4" :class="[theme.text]">Headers</div>
        <div class="flex items-center mb-1">
          <label class="cursor-pointer">
            <input type="checkbox" class="text-primary form-checkbox" />
            <span class="ml-1" :class="[theme.text]">Disable Authorization</span>
          </label>
        </div>
        <div class="flex items-center mb-1">
          <label class="cursor-pointer">
            <input type="checkbox" class="text-primary form-checkbox" />
            <span class="ml-1" :class="[theme.text]">Enable DNT (Do Not Track)</span>
          </label>
        </div>
        <div class="flex items-center mb-1">
          <label class="cursor-pointer">
            <input type="checkbox" class="text-primary form-checkbox" />
            <span class="ml-1" :class="[theme.text]">Prevent Etag tracking</span>
          </label>
        </div>
        <div class="flex items-center mb-1">
          <label class="cursor-pointer">
            <input type="checkbox" class="text-primary form-checkbox" />
            <span class="ml-1" :class="[theme.text]">Spoof X-Forwarded-For/Via IP</span>
          </label>
        </div>
        <div v-show="!settings.headers.spoofIP.enabled" class="flex flex-col mb-1">
          <label class="ml-6">
            <select class="form-select mt-1 w-full">
              <option>Random IP</option>
              <option>Custom IP</option>
            </select>
          </label>
          <div v-show="settings.headers.spoofIP.option" class="flex ml-6 mt-2">
            <input class="form-input flex-grow w-2/5 mr-2" placeholder="Range From" />
            <input class="form-input flex-grow w-2/5" placeholder="Range To" />
          </div>
        </div>
        <div class="flex items-center mb-1">
          <label class="cursor-pointer">
            <input type="checkbox" class="text-primary form-checkbox" />
            <span class="ml-1" :class="[theme.text]">Upgrade Insecure Requests</span>
          </label>
        </div>
        <div class="flex items-center mb-1">
          <label class="cursor-pointer">
            <input type="checkbox" class="text-primary form-checkbox" />
            <span class="ml-1" :class="[theme.text]">Disable Referer</span>
          </label>
        </div>
        <div v-show="!settings.headers.referer.disabled">
          <div class="flex items-center mb-1">
            <label class="cursor-pointer">
              <input type="checkbox" class="text-primary form-checkbox" />
              <span class="ml-1" :class="[theme.text]">Spoof Source Referer</span>
            </label>
          </div>
          <div class="text-sm mt-2" :class="[darkMode ? 'text-red-400' : 'text-red-800']">Don't modify about:config settings for the options below.</div>
          <div class="flex items-center mb-1">
            <label class="w-full mt-2">
              <span :class="[theme.text]">Referer X Origin Policy</span>
              <select class="form-select mt-1 block w-full">
                <option></option>
              </select>
            </label>
          </div>
          <div class="flex items-center mb-1">
            <label class="w-full mt-2">
              <span :class="[theme.text]">Referer Trimming Policy</span>
              <select class="form-select mt-1 block w-full">
                <option></option>
              </select>
            </label>
          </div>
        </div>
      </div>
      <div v-else-if="isSelected('tab', 'options')" class="m-4 text-md">
        <div class="text-lg border-primary border-b-2 mb-4" :class="[theme.text]">Options</div>
        <div class="w-full mb-4">
          <button @click="openOptionsPage('checklist')" class="w-full bg-primary font-semibold text-light py-1 px-4 border border-primary hover:bg-primary-soft rounded">
            Open about:config checklist
          </button>
        </div>
        <div>
          <ul class="flex text-center w-full rounded-lg" :class="[theme.text]">
            <li @click="setSelected('options', 'injection')" :class="[theme.fg, isSelected('options', 'injection') ? 'active' : '']" class="group group-options rounded-l-sm">
              Injection
            </li>
            <li @click="setSelected('options', 'standard')" :class="[theme.fg, isSelected('options', 'standard') ? 'active' : '']" class="group group-options">
              Standard
            </li>
            <li @click="setSelected('options', 'cookie')" :class="[theme.fg, isSelected('options', 'cookie') ? 'active' : '']" class="group group-options rounded-r-sm">
              Cookie
            </li>
          </ul>
          <div>
            <div v-if="isSelected('options', 'injection')">
              <div class="flex items-center mt-2 mb-1">
                <label class="cursor-pointer">
                  <input type="checkbox" class="text-primary form-checkbox" />
                  <span class="ml-1" :class="[theme.text]">Enable script injection</span>
                </label>
              </div>
              <div class="flex items-center mb-1">
                <label class="cursor-pointer">
                  <input type="checkbox" class="text-primary form-checkbox" />
                  <span class="ml-1" :class="[theme.text]">Limit tab history</span>
                </label>
              </div>
              <div class="flex items-center mb-1">
                <label class="cursor-pointer">
                  <input type="checkbox" class="text-primary form-checkbox" />
                  <span class="ml-1" :class="[theme.text]">Protect window name</span>
                </label>
              </div>
              <div class="flex items-center mb-1">
                <label class="cursor-pointer">
                  <input type="checkbox" class="text-primary form-checkbox" />
                  <span class="ml-1" :class="[theme.text]">Spoof Audio Context</span>
                </label>
              </div>
              <div class="flex items-center mb-1">
                <label class="cursor-pointer">
                  <input type="checkbox" class="text-primary form-checkbox" />
                  <span class="ml-1" :class="[theme.text]">Spoof Client Rects</span>
                </label>
              </div>
              <div class="flex items-center mb-1">
                <label class="cursor-pointer">
                  <input type="checkbox" class="text-primary form-checkbox" />
                  <span class="ml-1" :class="[theme.text]">Protect keyboard fingerprint</span>
                </label>
              </div>
              <div v-show="settings.options.protectKBFingerprint.enabled" class="flex items-center mb-1 pl-6">
                <input class="block w-2/5 form-input" placeholder="Delay (ms)" />
              </div>
              <div class="flex items-center mb-2">
                <label class="w-full mt-2">
                  <span :class="[theme.text]">Screen Size</span>
                  <select class="form-select mt-1 block w-full">
                    <option></option>
                  </select>
                </label>
              </div>
              <div class="flex items-center mb-2">
                <label class="w-full mt-2">
                  <span :class="[theme.text]">Timezone</span>
                  <select class="form-select mt-1 block w-full">
                    <option></option>
                  </select>
                </label>
              </div>
            </div>
            <div v-else-if="isSelected('options', 'standard')">
              <div class="flex items-center mt-2 mb-1">
                <div class="flex-grow">
                  <label class="cursor-pointer">
                    <input type="checkbox" class="text-primary form-checkbox" />
                    <span class="ml-1" :class="[theme.text]">Enable 1st party isolation</span>
                  </label>
                </div>
                <button class="inline-block mx-auto rounded-lg cursor-pointer px-2 py-1 my-1" :class="[theme.fg, theme.text]">
                  <div class="flex items-center">
                    <feather type="repeat" size=".8em"></feather>
                    <span class="ml-1 text-xs">reset</span>
                  </div>
                </button>
              </div>
              <div class="flex items-center mb-1">
                <div class="flex-grow">
                  <label class="cursor-pointer">
                    <input type="checkbox" class="text-primary form-checkbox" />
                    <span class="ml-1" :class="[theme.text]">Enable resist fingerprinting</span>
                  </label>
                </div>
                <button class="inline-block mx-auto rounded-lg cursor-pointer px-2 py-1 my-1" :class="[theme.fg, theme.text]">
                  <div class="flex items-center">
                    <feather type="repeat" size=".8em"></feather>
                    <span class="ml-1 text-xs">reset</span>
                  </div>
                </button>
              </div>
              <div class="flex items-center mb-1">
                <label class="cursor-pointer">
                  <input type="checkbox" class="text-primary form-checkbox" />
                  <span class="ml-1" :class="[theme.text]">Disable WebRTC</span>
                </label>
              </div>
              <div class="flex items-center pl-6 mb-2">
                <label class="w-full mt-2">
                  <span :class="[theme.text]">WebRTC Policy</span>
                  <select class="form-select mt-1 block w-full">
                    <option></option>
                  </select>
                </label>
              </div>
              <div class="flex items-center mb-2">
                <label class="w-full mt-2">
                  <span :class="[theme.text]">Tracking protection mode</span>
                  <select class="form-select mt-1 block w-full">
                    <option></option>
                  </select>
                </label>
              </div>
              <div class="flex items-center mb-2">
                <label class="w-full mt-2">
                  <span :class="[theme.text]">Websockets</span>
                  <select class="form-select mt-1 block w-full">
                    <option></option>
                  </select>
                </label>
              </div>
            </div>
            <div v-else-if="isSelected('options', 'cookie')">
              <div class="flex items-center mb-2">
                <label class="w-full mt-2">
                  <span :class="[theme.text]">Policy</span>
                  <select class="form-select mt-1 block w-full">
                    <option value="allow_all">Allow all</option>
                    <option value="allow_visited">Allow visited</option>
                    <option value="reject_all">Reject all</option>
                    <option value="reject_third_party">Reject third party</option>
                    <option value="reject_trackers">Reject trackers</option>
                  </select>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else-if="isSelected('tab', 'whitelist')" class="m-4 text-md">
        <div class="text-lg border-primary border-b-2 mb-4" :class="[theme.text]">Whitelist</div>
        <div class="flex items-center mb-1">
          <label class="cursor-pointer">
            <input @change="setOption($event)" :checked="settings.whitelist.enabled" name="whitelist.enabled" type="checkbox" class="text-primary form-checkbox" />
            <span class="ml-1" :class="[theme.text]">Enable whitelist (requires script injection)</span>
          </label>
        </div>
        <div class="flex items-center mb-1">
          <label class="cursor-pointer">
            <input
              @change="setOption($event)"
              :checked="settings.whitelist.enabledContextMenu"
              name="whitelist.enabledContextMenu"
              type="checkbox"
              class="text-primary form-checkbox"
            />
            <span class="ml-1" :class="[theme.text]">Add context menu item to open current tab domain in whitelist</span>
          </label>
        </div>
        <div class="flex items-center mb-2">
          <label class="w-full mt-4">
            <span :class="[theme.text]">Default Profile</span>
            <select @change="setOption($event)" :value="settings.whitelist.defaultProfile" name="whitelist.defaultProfile" class="form-select mt-1 block w-full">
              <option value="default">Default Whitelist Profile</option>
              <option value="real">Real Profile</option>
              <option v-for="p in profileList" :value="p.id">{{ p.name }}</option>
            </select>
          </label>
        </div>
        <div v-show="currentPage.domain" class="text-center mt-6 py-2" :class="[theme.text]">
          <feather v-if="currentPage.whitelisted" class="text-primary mb-2" type="check-circle" size="4em"></feather>
          <feather v-else class="text-primary mb-2" type="alert-circle" size="4em"></feather>
          <div class="max-w-xs text-lg mx-auto truncate">
            {{ currentPage.domain }}
          </div>
          <div class="mb-2 text-lg">
            {{ currentPage.whitelisted ? 'is whitelisted' : 'is not whitelisted' }}
          </div>
          <div class="mb-6 text-lg">
            <div class="font-semibold">Profile:</div>
            {{ getWhitelistProfile(currentPage.rule.profile) }}
          </div>
          <button @click="openOptionsPage('whitelist')" class="bg-primary font-semibold text-light py-2 px-4 border border-primary hover:bg-primary-soft rounded">
            Open in whitelist
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import util from '../store/util';
import * as prof from '../lib/profiles';

@Component
export default class App extends Vue {
  public currentTab: string = 'main';
  public currentProfileGroup: string = '';
  public currentOption: string = 'injection';
  public currentPage = {
    domain: '',
    whitelisted: false,
    rule: {
      id: '',
      idx: 0,
      profile: '',
    },
  };
  public profiles: prof.ProfileListItem[];

  get darkMode(): boolean {
    return this.settings.config.theme === 'dark';
  }

  get displayOS(): string {
    if (this.currentProfileGroup === 'windows') {
      return 'Windows';
    } else if (this.currentProfileGroup === 'macOS') {
      return 'macOS';
    } else if (this.currentProfileGroup === 'linux') {
      return 'Linux';
    } else if (this.currentProfileGroup === 'ios') {
      return 'iOS';
    } else if (this.currentProfileGroup === 'android') {
      return 'Android';
    }
  }

  get profileList(): prof.ProfileListItem[] {
    return [].concat.apply([], Object.values(this.profiles));
  }

  get profileListing(): any {
    if (this.currentProfileGroup) {
      let profiles = this.profiles[this.currentProfileGroup];

      for (let i = 0; i < profiles.length; i++) {
        profiles[i].excluded = this.settings.excluded.includes(profiles[i].id);
      }

      return profiles;
    }

    return [];
  }

  get settings(): any {
    return this['$store'].state;
  }

  get theme(): any {
    if (this.darkMode) {
      return {
        bg: 'bg-dark',
        fg: 'bg-dark-fg',
        text: 'text-light',
      };
    }

    return {
      bg: 'bg-light',
      fg: 'bg-light-fg',
      text: 'text-dark',
    };
  }

  get version(): string {
    return browser.runtime.getManifest().version;
  }

  activeTab(tab: string): string[] {
    if (this.currentTab === tab) {
      return [this.theme.bg, 'active'];
    }

    return ['hover:bg-primary-soft'];
  }

  created(): void {
    // this.loadSettings();
    // this.localize();
    this.getCurrentPage();
    this.profiles = new prof.Generator().getAllProfiles();

    if (!/random|none/.test(this.settings.profile.selected)) {
      let os = this.settings.profile.selected.match(/[a-z]+/)[0];

      switch (os) {
        case 'win':
          this.currentProfileGroup = 'windows';
          break;
        case 'mac':
          this.currentProfileGroup = 'macOS';
          break;
        case 'lin':
          this.currentProfileGroup = 'linux';
          break;
        case 'ios':
          this.currentProfileGroup = 'iOS';
          break;
        case 'android':
          this.currentProfileGroup = 'android';
          break;
        default:
          break;
      }
    }
  }

  async getCurrentPage(): Promise<void> {
    const currentTab = await browser.tabs.query({ active: true, currentWindow: true });

    let l = document.createElement('a');
    l.href = currentTab[0].url;

    if (['http:', 'https:'].includes(l.protocol)) {
      this.currentPage.domain = l.host;

      let rule = util.findWhitelistRule(this.settings.whitelist.rules, l.host, l.href);
      if (rule !== null) {
        this.currentPage.whitelisted = true;
        this.currentPage.rule = rule;
      }
    } else {
      this.currentPage.domain = '';
    }
  }

  getWhitelistProfile(profile: string): string {
    let p = this.profileList.find(p => p.id === profile);

    return p ? p.name : profile === 'default' ? 'Default Whitelist Profile' : 'Real Profile';
  }

  excludeProfile(profile: string): void {
    if (!/[0-9]/.test(profile)) {
      this['$store'].dispatch('excludeProfile', this.profileListing.map(p => p.id));
    } else {
      this['$store'].dispatch('excludeProfile', profile);
    }
  }

  isExcluded(profileId: string): boolean {
    if (!profileId) return false;

    if (!/[0-9]/.test(profileId)) {
      return this.profileListing.every(p => p.excluded);
    }
  }

  isSelected(type: string, value: string): boolean {
    if (type === 'options') {
      return this.currentOption === value;
    } else if (type === 'os') {
      return this.currentProfileGroup === value;
    } else if (type === 'profile') {
      return this['$store'].state.profile.selected === value;
    } else if (type === 'tab') {
      return this.currentTab === value;
    }

    return false;
  }

  openOptionsPage(tab: string): void {
    let params: string = '';

    if (tab === 'whitelist') {
      if (this.currentPage.whitelisted) {
        params = `?id=${this.currentPage.rule.id}&index=${this.currentPage.rule.idx}`;
      } else {
        params = `?url=${this.currentPage.domain}`;
      }
    }

    browser.tabs.create({
      url: browser.runtime.getURL(`/options/options.html${'#' + tab + params}`),
    });
    window.close();
  }

  setOption(evt: any) {
    let v = evt.target.value;

    this['$store'].dispatch('changeSetting', [
      {
        name: evt.target.name,
        value: v === 'on' ? true : v === 'off' ? false : evt.target.value,
      },
    ]);
  }

  setSelected(type: string, value: string): void {
    if (type === 'options') {
      this.currentOption = value;
    } else if (type === 'os') {
      this.currentProfileGroup = this.currentProfileGroup === value ? '' : value;
    } else if (type === 'profile') {
      this['$store'].dispatch('changeProfile', value);
    } else if (type === 'tab') {
      this.currentTab = value;
    }
  }

  toggleChameleon(): void {
    this['$store'].dispatch('toggleChameleon', !this.settings.config.enabled);
  }

  toggleNotifications(): void {
    this['$store'].dispatch('toggleNotifications');
  }

  toggleTheme(): void {
    this['$store'].dispatch('toggleTheme');
  }
}
</script>

<style type="text/css">
body {
  background-color: white;
  border: 0;
  margin: 0;
  overflow: hidden;
  padding: 0;
  min-width: 510px;
  max-width: 510px;
  min-height: 600px;
  max-height: 600px;
}

@media only screen and (min-width: 600px) {
  body {
    min-width: 100% !important;
  }
}
.ps {
  height: 100%;
}
</style>
