<template>
  <div class="app h-screen flex" :class="[theme.bg]">
    <div class="text-xs bg-primary flex-none flex-col text-center">
      <div @click="currentTab = 'home'" class="tab" :class="activeTab('home')">
        <feather type="home" size="1.5em"></feather>
      </div>
      <div @click="currentTab = 'profile'" class="tab" :class="activeTab('profile')">
        <feather type="globe" size="1.5em"></feather>
      </div>
      <div @click="currentTab = 'headers'" class="tab" :class="activeTab('headers')">
        <feather type="code" size="1.5em"></feather>
      </div>
      <div @click="currentTab = 'options'" class="tab" :class="activeTab('options')">
        <feather type="sliders" size="1.5em"></feather>
      </div>
      <div @click="currentTab = 'whitelist'" class="tab" :class="activeTab('whitelist')">
        <feather type="edit" size="1.5em"></feather>
      </div>
      <div @click="openOptionsPage" class="tab hover:bg-primary-soft">
        <feather type="settings" size="1.5em"></feather>
      </div>
    </div>
    <div class="flex-grow flex-col justify-around">
      <div v-if="currentTab == 'home'">
        <div class="text-center mt-16">
          <div class="my-6 h-24">
            <div class="inline-block cursor-pointer" @click="toggleChameleon">
              <feather v-if="config.enabled" type="shield" class="text-primary" size="6em" stroke-width="2" />
              <feather v-else type="shield-off" class="text-red-500" size="6em" stroke-width="2" />
            </div>
          </div>
          <div class="text-2xl mb-2 font-thin" :class="[theme.text]">Chameleon is {{ config.enabled ? 'enabled' : 'disabled' }}</div>
          <div class="flex justify-center text-sm">
            <div @click="toggleTheme" class="rounded-lg cursor-pointer mr-2" :class="[darkMode ? 'bg-gray-700' : 'bg-gray-300', theme.text]">
              <div class="flex items-center px-2 py-1">
                <feather v-if="darkMode" type="moon" size="1.5em"></feather>
                <feather v-else type="sun" size="1.5em"></feather>
                <span class="ml-1">{{ darkMode ? 'Dark' : 'Light' }}</span>
              </div>
            </div>
            <div @click="toggleNotifications" class="rounded-lg cursor-pointer" :class="[darkMode ? 'bg-gray-700' : 'bg-gray-300', theme.text]">
              <div class="flex items-center px-2 py-1 ">
                <feather v-if="config.notificationsEnabled" type="bell" size="1.5em"></feather>
                <feather v-else type="bell-off" size="1.5em"></feather>
                <span class="ml-1">Notifications</span>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div class="text-center px-4 py-8">
            <div class="text-xs uppercase tracking-widest" :class="[theme.text]">Current Profile</div>
            <div class="text-lg" :class="[theme.text]">Android &middot; Firefox 77</div>
            <div class="text-lg" :class="[theme.text]">1366x768</div>
            <div class="text-lg" :class="[theme.text]">Europe/Berlin</div>
            <div class="inline-block mx-auto rounded-lg cursor-pointer px-2 py-1 my-1" :class="[darkMode ? 'bg-gray-700' : 'bg-gray-300', theme.text]">
              <div class="flex items-center">
                <feather type="repeat" size=".8em"></feather>
                <span class="ml-1 text-xs">change</span>
              </div>
            </div>
          </div>
          <div class="absolute bottom-0 py-2" :class="[darkMode ? 'bg-dark-softer' : 'bg-gray-200', theme.text]" style="width: -moz-available;">
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
      <div v-else-if="currentTab == 'whitelist'" class="m-4 text-md">
        <div class="text-lg border-primary border-b-2 mb-2" :class="[theme.text]">Whitelist</div>
        <div class="flex items-center mb-1">
          <label class="cursor-pointer">
            <input type="checkbox" class="text-primary form-checkbox" />
            <span class="ml-1" :class="[theme.text]">Enable whitelist (requires script injection)</span>
          </label>
        </div>
        <div class="flex items-center mb-1">
          <label class="cursor-pointer">
            <input type="checkbox" class="text-primary form-checkbox" />
            <span class="ml-1" :class="[theme.text]">Add context menu item to open current tab domain in whitelist</span>
          </label>
        </div>
        <div class="flex items-center mb-2">
          <label class="w-full mt-4">
            <span :class="[theme.text]">Default Profile</span>
            <select class="form-select mt-1 block w-full">
              <option>Real Profile</option>
            </select>
          </label>
        </div>
        <div class="text-center mt-6 py-2" :class="[theme.text]">
          <feather class="text-primary mb-2" type="check-circle" size="4em"></feather>
          <div class="max-w-xs mx-auto truncate">
            example.com
          </div>
          <div class="mb-6">
            is whitelisted
          </div>
          <button @click="openWhitelist" class="bg-primary font-semibold text-light py-2 px-4 border border-primary hover:bg-primary-soft rounded">Open in whitelist</button>
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
  public currentTab: string = 'home';

  get config(): object {
    return this['$store'].state.config;
  }

  get darkMode(): boolean {
    return this['$store'].state.config.theme == 'dark';
  }

  get theme(): any {
    if (this.darkMode) {
      return {
        bg: 'bg-dark',
        text: 'text-light',
      };
    }

    return {
      bg: 'bg-light',
      text: 'text-dark',
    };
  }

  private activeTab(tab: string): string[] {
    if (this.currentTab === tab) {
      return [this.theme.bg, 'active'];
    }

    return ['hover:bg-primary-soft'];
  }

  private openOptionsPage(): void {
    browser.tabs.create({
      url: browser.runtime.getURL('/options/options.html'),
    });
    window.close();
  }

  private openWhitelist(): void {
    browser.tabs.create({
      url: browser.runtime.getURL('/options/options.html#whitelist'),
    });
    window.close();
  }

  private toggleChameleon(): void {
    this['$store'].dispatch('toggleChameleon');
  }

  private toggleNotifications(): void {
    this['$store'].dispatch('toggleNotifications');
  }

  private toggleTheme(): void {
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
}

.app {
  overflow: hidden;
}

@media only screen and (max-width: 511px) {
  .app {
    min-width: 510px;
    max-width: 510px;
    min-height: 800px;
    max-height: 800px;
  }
}
</style>
