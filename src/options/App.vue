<template>
  <div class="flex flex-col min-h-screen" :class="[theme.bg]">
    <div class="flex-none fixed w-full z-10">
      <div class="bg-primary flex items-center">
        <img class="h-6 mx-2" :src="iconPath" />
        <div @click="setSelected('tab', 'about')" class="options-tab" :class="activeTab('about')">
          About
        </div>
        <div @click="setSelected('tab', 'whitelist')" class="options-tab" :class="activeTab('whitelist')">
          Whitelist
        </div>
        <div @click="setSelected('tab', 'iprules')" class="options-tab" :class="activeTab('iprules')">
          IP Rules
        </div>
        <div @click="setSelected('tab', 'checklist')" class="options-tab" :class="activeTab('checklist')">
          Checklist
        </div>
      </div>
    </div>
    <div class="flex-grow px-4 pt-12 z-0">
      <div v-show="isSelected('tab', 'about')" class="text-2xl flex flex-col">
        <div class="border-b-2 border-primary">
          <div class="text-3xl mb-4">Chameleon v{{ version }}</div>
          <div class="flex flex-col md:flex-row mb-4">
            <button class="about-btn">
              <div class="flex items-center">
                <feather class="mr-2" type="help-circle" size="1em"></feather>
                <a href="https://sereneblue.github.io/chameleon/#/wiki">Wiki</a>
              </div>
            </button>
            <button class="about-btn">
              <div class="flex items-center">
                <feather class="mr-2" type="alert-triangle" size="1em"></feather>
                <a href="https://github.com/sereneblue/chameleon/issues">Issue Tracker</a>
              </div>
            </button>
            <button class="about-btn">
              <div class="flex items-center">
                <feather class="mr-2" type="message-circle" size="1em"></feather>
                <a href="https://sereneblue.github.io/chameleon/#/support">Support</a>
              </div>
            </button>
            <button class="about-btn">
              <div class="flex items-center">
                <feather class="mr-2" type="github" size="1em"></feather>
                <a href="https://github.com/sereneblue/chameleon">Source Code</a>
              </div>
            </button>
            <button class="about-btn">
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
            <button class="about-btn">
              <div class="flex items-center">
                <feather class="mr-2" type="upload" size="1em"></feather>
                Import
              </div>
            </button>
            <button class="about-btn">
              <div class="flex items-center">
                <feather class="mr-2" type="download" size="1em"></feather>
                Export
              </div>
            </button>
            <button class="about-btn">
              <div class="flex items-center">
                <feather class="mr-2" type="rotate-ccw" size="1em"></feather>
                Reset to Default
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';

@Component
export default class App extends Vue {
  public currentTab: string = 'about';
  public iconPath: string;

  get darkMode(): boolean {
    return this.settings.config.theme === 'dark';
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

  get settings(): any {
    return this['$store'].state;
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

  created() {
    this.iconPath = browser.runtime.getURL('icons/icon_32.png');
    let hash = window.location.hash.substr(1).split('?')[0];

    if (hash === 'whitelist') {
      this.currentTab = 'whitelist';
    } else if (hash === 'checklist') {
      this.currentTab = 'checklist';
    }
  }

  isSelected(type: string, value: string): boolean {
    if (type === 'tab') {
      return this.currentTab === value;
    }

    return false;
  }

  setSelected(type: string, value: string) {
    if (type === 'tab') {
      this.currentTab = value;
    }
  }
}
</script>
