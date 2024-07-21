<template>
  <div class="flex flex-col min-h-screen" :class="darkMode ? ['bg-dark'] : ['bg-light']">
    <div class="flex-none fixed w-full z-10">
      <div class="bg-primary flex items-center">
        <img class="h-6 mx-2" :src="iconPath" />
        <div @click="changeTab('about')" class="options-tab" :class="activeTab('about')" v-t="'options-tab-about.message'"></div>
        <div @click="changeTab('whitelist')" class="options-tab" :class="activeTab('whitelist')" v-t="'text-whitelist.message'"></div>
        <div @click="changeTab('iprules')" class="options-tab" :class="activeTab('iprules')" v-t="'options-tab-ipRules.message'"></div>
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
                <a href="https://sereneblue.github.io/chameleon/wiki" v-t="'options-about-wiki.message'"></a>
              </div>
            </button>
            <button class="transparent-btn">
              <div class="flex items-center">
                <feather class="mr-2" type="alert-triangle" size="1em"></feather>
                <a href="https://github.com/sereneblue/chameleon/issues" v-t="'options-about-issueTracker.message'"></a>
              </div>
            </button>
            <button class="transparent-btn">
              <div class="flex items-center">
                <feather class="mr-2" type="message-circle" size="1em"></feather>
                <a href="https://sereneblue.github.io/chameleon/contact" v-t="'options-about-support.message'"></a>
              </div>
            </button>
            <button class="transparent-btn">
              <div class="flex items-center">
                <feather class="mr-2" type="github" size="1em"></feather>
                <a href="https://github.com/sereneblue/chameleon" v-t="'options-about-sourceCode.message'"></a>
              </div>
            </button>
            <button class="transparent-btn">
              <div class="flex items-center">
                <feather class="mr-2" type="mic" size="1em"></feather>
                <a href="https://crowdin.com/project/chameleon" v-t="'options-about-translate.message'"></a>
              </div>
            </button>
            <button class="transparent-btn">
              <div class="flex items-center">
                <feather class="mr-2" type="info" size="1em"></feather>
                <a href="https://sereneblue.github.io/chameleon/wiki/known-issues" v-t="'options-about-knownIssues.message'"></a>
              </div>
            </button>
          </div>
        </div>
        <div class="mt-4">
          <div class="text-3xl mb-4" v-t="'options-settings.message'"></div>
          <div class="flex flex-col xl:flex-row">
            <button @click="importSettings" class="transparent-btn">
              <div class="flex items-center">
                <feather class="mr-2" type="upload" size="1em"></feather>
                <span v-t="'options-settings-import.message'"></span>
              </div>
              <input class="hidden" type="file" ref="chameleonImport" id="chameleonImport" @change="readSettings" />
            </button>
            <button @click="exportSettings" class="transparent-btn">
              <div class="flex items-center">
                <feather class="mr-2" type="download" size="1em"></feather>
                <span v-t="'options-settings-export.message'"></span>
              </div>
            </button>
            <button @click="openResetModal" class="transparent-btn">
              <div class="flex items-center">
                <feather class="mr-2" type="rotate-ccw" size="1em"></feather>
                <span v-t="'options-settings-reset.message'"></span>
              </div>
            </button>
          </div>
          <a id="export"></a>
          <div v-if="platform != 'android' && !isLegacyVersion">
            <div class="text-xl mb-4" v-t="'options-settings-permissions.message'"></div>
            <div class="flex flex-col xl:flex-row">
              <button @click="togglePrivacyPermission" class="transparent-btn">
                <div class="flex items-center">
                  <feather class="mr-2" type="key" size="1em"></feather>
                  <span v-if="hasPrivacyPermission" v-t="'options-settings-permissions-remove.message'"></span>
                  <span v-else v-t="'options-settings-permissions-request.message'"></span>
                </div>
              </button>
            </div>
          </div>
          <div v-else>
            <div class="text-xl mb-4" v-t="'options-settings-permissions-legacy.message'"></div>
            <div class="flex flex-col xl:flex-row">
              <button class="transparent-btn">
                <div class="flex items-center">
                  <feather class="mr-2" type="info" size="1em"></feather>
                  <a href="https://sereneblue.github.io/chameleon/wiki/legacy" v-t="'options-settings-permissions-legacy-wiki.message'"></a>
                </div>
              </button>
            </div>
          </div>
        </div>
        <div v-show="isImporting" class="mt-4">
          <div v-t="'options-settings-importing.message'"></div>
          <div class="mt-1 font-bold" :class="[importError.error ? 'text-red-500' : 'text-green-500']" v-text="importError.msg"></div>
        </div>
      </div>
      <div v-show="currentTab === 'whitelist'" class="text-2xl flex flex-col">
        <div class="flex flex-col md:flex-row">
          <button @click="createNewWhitelistRule" class="transparent-btn">
            <div class="flex items-center">
              <feather class="mr-2" type="plus" size="1em"></feather>
              <span v-t="'text-createNewRule.message'"></span>
            </div>
          </button>
        </div>
        <input
          v-model="query"
          class="bg-gray-300 appearance-none border-2 border-gray-300 rounded w-full py-2 px-4 my-4 text-gray-800 leading-tight focus:outline-none focus:bg-white focus:border-primary"
          type="text"
          :placeholder="$t('text-searchRules.message')"
        />
        <div class="flex flex-wrap pb-12">
          <table id="iprules" class="w-full">
            <thead class="border-b-2">
              <tr class="flex flex-col flex-no wrap md:table-row text-left">
                <th class="font-bold py-4 w-2/5" v-t="'options-whitelist-rule.message'"></th>
                <th class="font-bold py-4" v-t="'text-profile.message'"></th>
                <th class="font-bold py-4">URLS</th>
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
              <span v-t="'text-createNewRule.message'"></span>
            </div>
          </button>
          <button @click="reloadIPInfo" class="transparent-btn">
            <div class="flex items-center">
              <feather class="mr-2" type="refresh-cw" size="1em"></feather>
              <span v-t="'options-ipRules-reload.message'"></span>
            </div>
          </button>
          <div class="flex gap-x-2 items-center">
            <label for="config.reloadIPStartupDelay">
              <span class="text-dark" v-t="'text-startupDelay.message'"></span>
            </label>
            <input
              id="reloadIPStartupDelay"
              @input="changeSetting($event)"
              name="config.reloadIPStartupDelay"
              v-model.number="settings.config.reloadIPStartupDelay"
              type="number"
              min="0"
              class="block form-input"
            />
          </div>
        </div>
        <div class="flex flex-wrap pb-12">
          <table id="iprules" class="w-full">
            <thead class="border-b-2">
              <tr class="flex flex-col flex-no wrap md:table-row text-left">
                <th class="font-bold py-4 w-2/5" v-t="'options-ipRules-ipRule.message'"></th>
                <th class="font-bold py-4" v-t="'text-language.message'"></th>
                <th class="font-bold py-4" v-t="'text-timezone.message'"></th>
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
        <div class="flex flex-col justify-center h-screen">
          <div v-if="modalType === Modal.IP_RULE" class="w-4/5 modal overflow-y-auto" style="max-height: 90vh;">
            <div class="px-6 pt-6 pb-8 text-xl">
              <div class="text-xl font-bold border-primary border-b-2 mb-4" v-t="'options-ipRules-editorTitle.message'"></div>
              <div class="w-full">
                <div class="mb-4">
                  <label for="headers.spoofIP.rangeFrom">
                    <span class="text-dark" v-t="'text-name.message'"></span>
                  </label>
                  <input v-model="tmp.ipRule.name" name="headers.spoofIP.rangeFrom" class="block w-full form-input" :class="{ error: errors.ipRuleName }" />
                </div>
                <div class="flex flex-col md:flex-row items-center mb-4">
                  <label class="md:mr-2 mb-4 md:mb-0 w-full md:w-1/2">
                    <span class="text-dark" v-t="'text-language.message'"></span>
                    <select v-model="tmp.ipRule.lang" class="form-select mt-1 block w-full">
                      <option v-for="l in languages" :key="l.code" :value="l.code">{{ l.name }}</option>
                    </select>
                  </label>
                  <label class="md:ml-2 w-full md:w-1/2">
                    <span class="text-dark" v-t="'text-timezone.message'"></span>
                    <select v-model="tmp.ipRule.tz" class="form-select mt-1 block w-full">
                      <option v-for="t in timezones" :key="t.zone" :value="t.zone">({{ t.offset }}) {{ t.zone }}</option>
                    </select>
                  </label>
                </div>
                <div>
                  <div class="mb-2" v-t="'options-ipRules-textareaLabel.message'"></div>
                  <textarea
                    v-model="tmp.ipRule.ips"
                    class="form-textarea mt-1 text-xl block w-full"
                    :class="{ error: errors.ipRuleIPs }"
                    rows="10"
                    :placeholder="$t('options-ipRules-textareaPlaceholder.message')"
                  ></textarea>
                </div>
                <div class="flex items-center">
                  <div class="flex mt-6 w-full">
                    <button
                      @click="saveIPRule"
                      class="bg-green-500 hover:bg-green-600 font-semibold text-white py-2 px-4 border border-green-500 rounded"
                      v-t="'text-save.message'"
                    ></button>
                    <button @click.once="closeModal" class="bg-transparent font-semibold py-2 px-4 rounded" v-t="'text-cancel.message'"></button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else-if="modalType === Modal.WL_RULE" class="w-4/5 modal overflow-y-auto" style="max-height: 90vh;">
            <div class="px-6 pt-6 pb-8 text-xl">
              <div class="text-xl font-bold border-primary border-b-2 mb-4" v-t="'options-whitelist-editorTitle.message'"></div>
              <div class="flex-col lg:flex">
                <div class="mb-2 md:mb-0">
                  <div class="mb-2">
                    <label>
                      <span class="text-dark" v-t="'text-name.message'"></span>
                    </label>
                    <input v-model="tmp.wlRule.name" class="block w-full form-input" :class="{ error: errors.wlRuleName }" />
                  </div>
                  <div class="mb-2">
                    <label>
                      <span v-t="'options-whitelist-acceptLang.message'"></span>
                      <select v-model="tmp.wlRule.lang" class="form-select mt-1 block w-full">
                        <option v-for="l in languages" :key="l.code" :value="l.code">{{ l.name }}</option>
                      </select>
                    </label>
                  </div>
                  <div class="mb-2">
                    <label>
                      <span v-t="'text-profile.message'"></span>
                      <select v-model="tmp.wlRule.profile" class="form-select mt-1 block w-full">
                        <option value="default" v-t="'text-defaultWhitelistProfile.message'"></option>
                        <option value="none" v-t="'text-realProfile.message'"></option>
                        <option v-for="p in profileList" :key="p.id" :value="p.id">{{ p.name }}</option>
                      </select>
                    </label>
                  </div>
                  <div class="mb-2">
                    <label for="headers.spoofIP.rangeFrom">
                      <span class="text-dark" v-t="'options-whitelist-headerIPLabel.message'"></span>
                    </label>
                    <input v-model="tmp.wlRule.spoofIP" class="block w-full form-input" :class="{ error: errors.wlRuleIP }" />
                  </div>
                  <div class="my-4">
                    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-y-2 grid-flow-row auto-rows-max">
                      <div>
                        <div class="form-switch inline-block align-middle">
                          <input v-model="tmp.wlRule.options.ref" id="ref" type="checkbox" class="form-switch-checkbox" />
                          <label class="form-switch-label" for="ref"></label>
                        </div>
                        <label class="text-sm" v-t="'text-disableReferer.message'"></label>
                      </div>
                      <div>
                        <div class="form-switch inline-block align-middle">
                          <input v-model="tmp.wlRule.options.ws" id="ws" type="checkbox" class="form-switch-checkbox" />
                          <label class="form-switch-label" for="ws"></label>
                        </div>
                        <label class="text-sm" v-t="'options-whitelist-options-ws.message'"></label>
                      </div>
                      <div>
                        <div class="form-switch inline-block align-middle">
                          <input v-model="tmp.wlRule.options.name" id="name" type="checkbox" class="form-switch-checkbox" />
                          <label class="form-switch-label" for="name"></label>
                        </div>
                        <label class="text-sm" v-t="'options-whitelist-options-name.message'"></label>
                      </div>
                      <div>
                        <div class="form-switch inline-block align-middle">
                          <input v-model="tmp.wlRule.options.tz" id="tz" type="checkbox" class="form-switch-checkbox" />
                          <label class="form-switch-label" for="tz"></label>
                        </div>
                        <label class="text-sm" v-t="'options-whitelist-options-tz.message'"></label>
                      </div>
                      <div>
                        <div class="form-switch inline-block align-middle">
                          <input v-model="tmp.wlRule.options.mediaDevices" id="mediaDevices" type="checkbox" class="form-switch-checkbox" />
                          <label class="form-switch-label" for="mediaDevices"></label>
                        </div>
                        <label class="text-sm" v-t="'options-whitelist-options-mediaDevices.message'"></label>
                      </div>
                      <div>
                        <div class="form-switch inline-block align-middle">
                          <input v-model="tmp.wlRule.options.cssExfil" id="cssExfil" type="checkbox" class="form-switch-checkbox" />
                          <label class="form-switch-label" for="cssExfil"></label>
                        </div>
                        <label class="text-sm" v-t="'options-whitelist-options-cssExfil.message'"></label>
                      </div>
                      <div>
                        <div class="form-switch inline-block align-middle">
                          <input v-model="tmp.wlRule.options.audioContext" id="audioContext" type="checkbox" class="form-switch-checkbox" />
                          <label class="form-switch-label" for="audioContext"></label>
                        </div>
                        <label class="text-sm" v-t="'options-whitelist-options-audioContext.message'"></label>
                      </div>
                      <div>
                        <div class="form-switch inline-block align-middle">
                          <input v-model="tmp.wlRule.options.clientRects" id="clientRects" type="checkbox" class="form-switch-checkbox" />
                          <label class="form-switch-label" for="clientRects"></label>
                        </div>
                        <label class="text-sm" v-t="'options-whitelist-options-clientRects.message'"></label>
                      </div>
                    </div>
                  </div>
                </div>
                <div>URLs</div>
                <div class="text-sm" v-t="'options-whitelist-sitesTip.message'"></div>
                <textarea
                  v-model="tmp.wlRule.sites"
                  class="form-textarea mt-1 text-xl block w-full"
                  :class="{ error: errors.wlRuleSites }"
                  rows="7"
                  placeholder="Ex. reddit.com@@r/(webdev|popular|privacy)"
                ></textarea>
              </div>
              <div class="flex items-center">
                <div class="flex mt-6 w-full">
                  <button
                    @click="saveWLRule"
                    class="bg-green-500 hover:bg-green-600 font-semibold text-white py-2 px-4 border border-green-500 rounded"
                    v-t="'text-save.message'"
                  ></button>
                  <button @click.once="closeModal" class="bg-transparent font-semibold py-2 px-4 rounded" v-t="'text-cancel.message'"></button>
                </div>
              </div>
            </div>
          </div>
          <div v-else-if="modalType === Modal.CONFIRM_IP_DELETE" class="w-4/5 md:w-1/3 modal overflow-y-auto" style="max-height: 60vh;">
            <div class="flex flex-col px-6 pt-6 pb-8">
              <span class="text-center text-red-500 mb-4"><feather stroke-width="1" type="alert-circle" size="8em"></feather></span>
              <span class="my-1 text-xl font-semibold text-center" v-t="'options-modal-askDelete.message'"></span>
              <div class="my-4 text-center text-xl">
                <span>{{ tmp.ipRule.name }}</span>
              </div>
              <div class="flex justify-center">
                <button
                  @click="reallyDelete"
                  class="bg-red-500 hover:bg-red-600 font-semibold text-white py-2 px-4 border border-red-500 rounded"
                  v-t="'options-modal-confirmDelete.message'"
                ></button>
                <button @click="closeModal" class="bg-transparent font-semibold py-2 px-4 rounded" v-t="'text-cancel.message'"></button>
              </div>
            </div>
          </div>
          <div v-else-if="modalType === Modal.CONFIRM_RESET" class="w-4/5 md:w-1/3 modal overflow-y-auto" style="max-height: 60vh;">
            <div class="flex flex-col px-6 pt-6 pb-8">
              <span class="text-center text-red-500 mb-4"><feather stroke-width="1" type="alert-circle" size="8em"></feather></span>
              <span class="my-1 text-xl font-semibold text-center" v-t="'options-modal-askReset.message'"></span>
              <div class="flex justify-center">
                <button
                  @click="resetSettings"
                  class="bg-red-500 hover:bg-red-600 font-semibold text-white py-2 px-4 border border-red-500 rounded"
                  v-t="'options-modal-confirmReset.message'"
                ></button>
                <button @click="closeModal" class="bg-transparent font-semibold py-2 px-4 rounded" v-t="'text-cancel.message'"></button>
              </div>
            </div>
          </div>
          <div v-else-if="modalType === Modal.CONFIRM_WL_DELETE" class="w-4/5 md:w-1/3 modal overflow-y-auto" style="max-height: 60vh;">
            <div class="flex flex-col px-6 pt-6 pb-8">
              <span class="text-center text-red-500 mb-4"><feather stroke-width="1" type="alert-circle" size="8em"></feather></span>
              <span class="my-1 text-xl font-semibold text-center" v-t="'options-modal-askDelete.message'"></span>
              <div class="my-4 text-center text-xl">
                <span>{{ tmp.wlRule.name }}</span>
              </div>
              <div class="flex justify-center">
                <button
                  @click="reallyDelete"
                  class="bg-red-500 hover:bg-red-600 font-semibold text-white py-2 px-4 border border-red-500 rounded"
                  v-t="'options-modal-confirmDelete.message'"
                ></button>
                <button @click="closeModal" class="bg-transparent font-semibold py-2 px-4 rounded" v-t="'text-cancel.message'"></button>
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
import * as prof from '../lib/profiles';
import * as tz from '../lib/tz';
import util from '../lib/util';
import webext from '../lib/webext';
import { Component } from 'vue-property-decorator';
import { v4 as uuidv4 } from 'uuid';

enum Modal {
  DEFAULT,
  IP_RULE,
  WL_RULE,
  CONFIRM_IP_DELETE,
  CONFIRM_RESET,
  CONFIRM_WL_DELETE,
}

@Component
export default class App extends Vue {
  public REGEX_DOMAIN: any = /^(?:^|\s)((https?:\/\/)?(?:localhost|[\w-]+(?:\.[\w-]+)+)(:\d+)?(\/\S*)?)/;
  public Modal = Modal;
  public modalType: Modal = Modal.DEFAULT;
  public currentTab: string = 'about';
  public defaultLanguage: string = browser.i18n.getUILanguage();
  public iconPath: string = '';
  public query: string = '';
  public platform: string = '';
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
  public isImporting: boolean = false;
  private isLegacyVersion: boolean = false;
  private savingIPRule: boolean = false;
  private savingWLRule: boolean = false;
  public importError: any = {
    error: false,
    msg: '',
  };
  public hasPrivacyPermission: boolean = !!browser.privacy;
  public version: string = '';
  public tmp: any = {
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
        audioContext: false,
        clientRects: false,
        cssExfil: false,
        mediaDevices: false,
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

  async changeSetting(evt: any): Promise<void> {
    webext.sendToBackground(this.settings);
  }

  changeTab(tab: string): void {
    window.location.hash = '#' + tab;
  }

  async created(): Promise<void> {
    this.iconPath = browser.runtime.getURL('icons/icon.svg');
    this.version = browser.runtime.getManifest().version_name;
    this.platform = (await browser.runtime.getPlatformInfo()).os;
    this.isLegacyVersion = parseInt(await browser.runtime.getBrowserInfo().version) < 75;

    await this['$store'].dispatch('initialize');

    let hash = window.location.hash.split('?');
    let queryParams = hash.length > 1 ? hash[1] : '';

    if (hash[0] === '#iprules') {
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
          let rule = util.findWhitelistRule(this.settings.whitelist.rules, site, site);
          if (rule !== null) {
            this.editWLRule(rule.id);
          } else {
            this.createNewWhitelistRule();
            this.tmp.wlRule.sites = site;
            this.tmp.wlRule.name = site;
          }
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
    let lang: string;

    if (this.languages.findIndex(l => l.code === this.defaultLanguage) > -1) {
      lang = this.defaultLanguage;
    } else {
      lang = 'en-US';
    }

    this.tmp.ipRule.id = '';
    this.tmp.ipRule.name = '';
    this.tmp.ipRule.lang = lang;
    this.tmp.ipRule.tz = this.timezones[0].zone;
    this.tmp.ipRule.ips = '';

    this.showModal = true;
    this.modalType = Modal.IP_RULE;
  }

  createNewWhitelistRule(): void {
    let lang: string;

    if (this.languages.findIndex(l => l.code === this.defaultLanguage) > -1) {
      lang = this.defaultLanguage;
    } else {
      lang = 'en-US';
    }

    this.tmp.wlRule.id = '';
    this.tmp.wlRule.name = '';
    this.tmp.wlRule.sites = '';
    this.tmp.wlRule.lang = lang;
    this.tmp.wlRule.profile = 'default';
    this.tmp.wlRule.spoofIP = '';
    this.tmp.wlRule.options.audioContext = false;
    this.tmp.wlRule.options.clientRects = false;
    this.tmp.wlRule.options.cssExfil = false;
    this.tmp.wlRule.options.mediaDevices = false;
    this.tmp.wlRule.options.name = false;
    this.tmp.wlRule.options.ref = false;
    this.tmp.wlRule.options.tz = false;
    this.tmp.wlRule.options.ws = false;

    this.showModal = true;
    this.modalType = Modal.WL_RULE;
  }

  importSettings(evt): void {
    (this.$refs.chameleonImport as any).click();
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

    this.tmp.wlRule = [
      {
        id: '',
        name: '',
        sites: '',
        lang,
        profile: 'default',
        spoofIP: '',
        options: {
          audioContext: false,
          clientRects: false,
          cssExfil: false,
          mediaDevices: false,
          name: false,
          ref: false,
          tz: false,
          ws: false,
        },
      },
      rule,
    ].reduce(util.deepMerge, {});

    this.tmp.wlRule.sites = rule.sites.map(r => Object.values(r).join('@@')).join('\n');

    this.showModal = true;
    this.modalType = Modal.WL_RULE;
  }

  async exportSettings(): Promise<void> {
    let s: any = await browser.runtime.sendMessage({
      action: 'getSettings',
    });

    let settings: string = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(s, null, 2));
    let exportElement = document.getElementById('export');
    exportElement.setAttribute('href', settings);
    exportElement.setAttribute('download', `chameleon_${new Date().getTime()}.json`);
    exportElement.click();
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
      return this.$t('text-defaultWhitelistProfile.message') as string;
    } else if (profile === 'none') {
      return this.$t('text-realProfile.message') as string;
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
      if (window.location.hash === '#iprules') {
        this.currentTab = 'iprules';
      } else if (window.location.hash === '#whitelist') {
        this.currentTab = 'whitelist';
      } else {
        this.currentTab = 'about';
      }
    }.bind(this);
  }

  openResetModal(): void {
    this.showModal = true;
    this.modalType = Modal.CONFIRM_RESET;
  }

  readSettings(evt: Event): void {
    this.isImporting = true;
    let reader = new FileReader();

    // inject an image with the src url
    reader.onload = async (e: any): Promise<void> => {
      try {
        let data: object = JSON.parse(e.target.result);
        this.importError = await browser.runtime.sendMessage({
          action: 'validateSettings',
          data,
        });
      } catch (e) {
        let msg: string = this.$t('options-import-couldNotImport.message') as string;
        this.importError = {
          error: true,
          msg,
        };
      }
    };

    reader.readAsText((evt.target as any).files[0]);
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
      data: true,
    });
  }

  async resetSettings(): Promise<void> {
    await browser.runtime.sendMessage({
      action: 'reset',
    });
  }

  async saveIPRule(): Promise<void> {
    if (this.savingIPRule) return;

    this.savingIPRule = true;

    this.tmp.ipRule.name = this.tmp.ipRule.name.trim();
    this.tmp.ipRule.ips = this.tmp.ipRule.ips.trim();
    if (this.tmp.ipRule.name === '') {
      this.errors.ipRuleName = true;
      this.savingIPRule = false;

      return;
    } else {
      this.errors.ipRuleName = false;
    }

    if (this.tmp.ipRule.ips === '') {
      this.errors.ipRuleIPs = true;
      this.savingIPRule = false;

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
        this.savingIPRule = false;

        return;
      }
    }

    this.errors.ipRules = false;

    if (this.tmp.ipRule.id) {
      let idx: number = this.settings.ipRules.findIndex(r => r.id === this.tmp.ipRule.id);

      this.$set(this.settings.ipRules, idx, Object.assign({}, this.tmp.ipRule, { ips: rules }));
    } else {
      this.settings.ipRules.push(Object.assign({}, this.tmp.ipRule, { id: uuidv4(), ips: rules }));
    }

    await browser.runtime.sendMessage({
      action: 'updateIPRules',
      data: this.settings.ipRules,
    });

    this.showModal = false;
    this.savingIPRule = false;
  }

  async saveWLRule(): Promise<void> {
    if (this.savingWLRule) return;

    this.savingWLRule = true;

    this.tmp.wlRule.name = this.tmp.wlRule.name.trim();
    if (this.tmp.wlRule.name === '') {
      this.errors.wlRuleName = true;
      this.savingWLRule = false;
      return;
    } else {
      this.errors.wlRuleName = false;
    }

    // validate ip
    if (this.tmp.wlRule.spoofIP != '') {
      if (!util.isValidIP(this.tmp.wlRule.spoofIP)) {
        this.errors.wlRuleIP = true;
        this.savingWLRule = false;
        return;
      } else {
        this.errors.wlRuleIP = false;
      }
    }

    // validate sites patterns
    let sites = this.tmp.wlRule.sites
      .trim()
      .split('\n')
      .map(s => s.split('@@'));

    let foundDomains = {};
    for (let i = 0; i < sites.length; i++) {
      if (sites[i].length > 2) {
        this.errors.wlRuleSites = true;
        this.savingWLRule = false;
        return;
      }

      // check if already a rule
      if (foundDomains[sites[i][0]]) {
        this.errors.wlRuleSites = true;
        this.savingWLRule = false;
        return;
      }

      // test if valid domain
      if (sites[i][0] === '' || !this.REGEX_DOMAIN.test(sites[i][0])) {
        this.errors.wlRuleSites = true;
        this.savingWLRule = false;

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

      this.$set(this.settings.whitelist.rules, idx, Object.assign({}, this.tmp.wlRule, { sites }));
    } else {
      this.settings.whitelist.rules.push(Object.assign({}, this.tmp.wlRule, { id: uuidv4(), sites }));
    }

    await browser.runtime.sendMessage({
      action: 'updateWhitelist',
      data: this.settings.whitelist,
    });

    await browser.runtime.sendMessage({
      action: 'reloadInjectionScript',
    });

    this.savingWLRule = false;
    this.showModal = false;
  }

  async togglePrivacyPermission(): Promise<void> {
    let success: boolean;

    if (this.hasPrivacyPermission) {
      success = await browser.permissions.remove({
        permissions: ['privacy'],
      });

      this.hasPrivacyPermission = !success;
    } else {
      this.hasPrivacyPermission = await browser.permissions.request({
        permissions: ['privacy'],
      });
    }

    setTimeout(() => {
      browser.runtime.reload();
    }, 1000);
  }

  toggleOpen(): void {
    this.ready = !this.ready;
    if (!this.ready) this.modalType = Modal.DEFAULT;
  }
}
</script>

<style type="text/css">
html {
  font-size: 16px;
}

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
