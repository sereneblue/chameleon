<template>
  <div class="app h-screen w-screen flex" :class="darkMode ? ['bg-dark'] : ['bg-light']">
    <div class="text-xs bg-primary flex-none flex-col text-center">
      <div @click="setSelected('tab', 'main')" id="homeTab" class="tab" :class="activeTab('main')">
        <feather type="home" size="1.5em"></feather>
      </div>
      <div @click="setSelected('tab', 'profile')" id="profileTab" class="tab" :class="activeTab('profile')">
        <feather type="globe" size="1.5em"></feather>
      </div>
      <div @click="setSelected('tab', 'headers')" id="headersTab" class="tab" :class="activeTab('headers')">
        <feather type="code" size="1.5em"></feather>
      </div>
      <div @click="setSelected('tab', 'options')" id="optionsTab" class="tab" :class="activeTab('options')">
        <feather type="sliders" size="1.5em"></feather>
      </div>
      <div @click="setSelected('tab', 'whitelist')" id="whitelistTab" class="tab" :class="activeTab('whitelist')">
        <feather type="edit" size="1.5em"></feather>
      </div>
      <div @click="openOptionsPage('')" id="optionsPage" class="tab hover:bg-primary-soft">
        <feather type="settings" size="1.5em"></feather>
      </div>
    </div>
    <div class="flex-grow flex-col w-full justify-around">
      <div v-show="isSelected('tab', 'main')">
        <div class="text-center mt-12">
          <div class="my-4 h-24">
            <div id="chameleonEnabled" class="inline-block cursor-pointer" @click="toggleChameleon">
              <feather v-if="settings.config.enabled" type="shield" class="text-primary hover:text-primary-soft" size="6em" stroke-width="2" />
              <feather v-else type="shield-off" class="text-red-500 hover:text-red-400" size="6em" stroke-width="2" />
            </div>
          </div>
          <div class="text-2xl">{{ settings.config.enabled ? $t('popup-home-enabled.message') : $t('popup-home-disabled.message') }}</div>
          <div class="text-lg mb-4" id="chameleonVersion">v{{ version }}</div>
          <div class="flex justify-center text-md">
            <div id="toggleTheme" @click="toggleTheme" class="rounded-lg cursor-pointer mr-4 fg">
              <div class="flex items-center px-2 py-1">
                <feather v-if="darkMode" type="moon" size="1.5em"></feather>
                <feather v-else type="sun" size="1.5em"></feather>
                <span class="ml-2">{{ darkMode ? $t('popup-home-theme-dark.message') : $t('popup-home-theme-light.message') }}</span>
              </div>
            </div>
            <div id="notificationsEnabled" @click="toggleNotifications" class="rounded-lg cursor-pointer fg">
              <div class="flex items-center px-2 py-1">
                <feather v-if="settings.config.notificationsEnabled" type="bell" size="1.5em"></feather>
                <feather v-else type="bell-off" size="1.5em"></feather>
                <span class="ml-2">{{
                  settings.config.notificationsEnabled ? $t('popup-home-notification-enabled.message') : $t('popup-home-notification-disabled.message')
                }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="text-center px-4 py-8">
          <div class="text-xs uppercase opacity-75 tracking-widest" v-t="'popup-home-currentProfile.message'"></div>
          <div id="currentProfile" class="text-md py-2">
            <div>{{ currentProfile.profile }}</div>
            <div>{{ currentProfile.screen }}</div>
            <div>{{ currentProfile.timezone }}</div>
            <div>{{ currentProfile.lang }}</div>
          </div>
          <div v-show="isRandomProfile" class="flex justify-center text-md">
            <div id="changeProfile" @click="changeProfile" class="rounded-lg cursor-pointer fg">
              <div class="flex items-center px-2 py-1">
                <feather type="refresh-cw" size="1em"></feather>
                <span class="ml-2" v-t="'popup-home-change.message'"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-show="isSelected('tab', 'profile')" class="m-4 text-md">
        <div class="text-lg border-primary border-b-2 mb-4" v-t="'text-profile.message'"></div>
        <div class="flex">
          <div class="flex flex-col mr-16">
            <label class="inline-flex items-center mb-2">
              <input id="realProfile" @click="setSelected('profile', 'none')" type="radio" class="form-radio" :checked="isSelected('profile', 'none')" />
              <span class="ml-2" v-t="'text-realProfile.message'"></span>
            </label>
            <label class="inline-flex items-center">
              <input id="randomProfile" @click="setSelected('profile', 'random')" type="radio" class="form-radio" :checked="isSelected('profile', 'random')" />
              <span class="ml-2" v-t="'popup-profile-random.message'"></span>
            </label>
          </div>
          <div class="flex flex-col">
            <label class="inline-flex items-center mb-2">
              <input id="randomDesktop" @click="setSelected('profile', 'randomDesktop')" type="radio" class="form-radio" :checked="isSelected('profile', 'randomDesktop')" />
              <span class="ml-2" v-t="'popup-profile-randomDesktopProfile.message'"></span>
            </label>
            <label class="inline-flex items-center">
              <input id="randomMobile" @click="setSelected('profile', 'randomMobile')" type="radio" class="form-radio" :checked="isSelected('profile', 'randomMobile')" />
              <span class="ml-2" v-t="'popup-profile-randomMobileProfile.message'"></span>
            </label>
          </div>
        </div>
        <div v-show="!/\d|none/.test(settings.profile.selected)">
          <div class="flex items-center mb-2">
            <label class="w-full mt-4">
              <span v-t="'popup-profile-changePeriodically.message'"></span>
              <select
                id="profileInterval"
                @change="changeSetting($event)"
                :value="settings.profile.interval.option"
                name="profile.interval.option"
                class="form-select mt-1 block w-full"
              >
                <option value="0" v-t="'popup-profile-interval-no.message'"></option>
                <option value="-1" v-t="'popup-profile-interval-custom.message'"></option>
                <option value="1" v-t="'popup-profile-interval-minute.message'"></option>
                <option value="5" v-t="'popup-profile-interval-5minutes.message'"></option>
                <option value="10" v-t="'popup-profile-interval-10minutes.message'"></option>
                <option value="20" v-t="'popup-profile-interval-20minutes.message'"></option>
                <option value="30" v-t="'popup-profile-interval-30minutes.message'"></option>
                <option value="40" v-t="'popup-profile-interval-40minutes.message'"></option>
                <option value="50" v-t="'popup-profile-interval-50minutes.message'"></option>
                <option value="60" v-t="'popup-profile-interval-hour.message'"></option>
              </select>
            </label>
          </div>
          <div v-show="settings.profile.interval.option == -1" class="flex justify-around mb-2 w-full">
            <div class="mr-1">
              <label for="profile.interval.min" v-t="'popup-profile-interval-customMin.message'"></label>
              <input
                id="profileIntervalMin"
                @input="setProfileInterval($event)"
                v-model="tmp.intervalMin"
                :class="{ error: errors.intervalMin }"
                name="profile.interval.min"
                type="number"
                min="1"
                class="block w-full form-input"
              />
            </div>
            <div class="ml-1">
              <label for="profile.interval.max" v-t="'popup-profile-interval-customMax.message'"></label>
              <input
                id="profileIntervalMax"
                @input="setProfileInterval($event)"
                v-model="tmp.intervalMax"
                :class="{ error: errors.intervalMax }"
                name="profile.interval.max"
                type="number"
                min="1"
                class="block w-full form-input"
              />
            </div>
          </div>
        </div>
        <div class="mt-6">
          <ul class="flex text-center w-full">
            <li id="windowsProfiles" @click="setSelected('os', 'windows')" :class="[isSelected('os', 'windows') ? 'active' : '']" class="group fg rounded-l-sm cursor-pointer">
              Windows
            </li>
            <li id="macOSProfiles" @click="setSelected('os', 'macOS')" :class="[isSelected('os', 'macOS') ? 'active' : '']" class="group fg cursor-pointer">
              macOS
            </li>
            <li id="linuxProfiles" @click="setSelected('os', 'linux')" :class="[isSelected('os', 'linux') ? 'active' : '']" class="group fg cursor-pointer">
              Linux
            </li>
            <li id="iosProfiles" @click="setSelected('os', 'iOS')" :class="[isSelected('os', 'iOS') ? 'active' : '']" class="group fg cursor-pointer">
              iOS
            </li>
            <li id="androidProfiles" @click="setSelected('os', 'android')" :class="[isSelected('os', 'android') ? 'active' : '']" class="group fg rounded-r-sm cursor-pointer">
              Android
            </li>
          </ul>
          <div v-show="currentProfileGroup" class="mt-2 rounded-sm fg" :class="[settings.profile.interval.option != -1 ? 'h-80' : 'h-64']">
            <perfect-scrollbar ref="scrollView" class="px-3">
              <div class="profile-item fg">
                <label :class="{ 'opacity-50': isExcluded(currentProfileGroup) }" class="flex items-center cursor-pointer">
                  <input
                    @click="setSelected('profile', currentProfileGroup)"
                    :disabled="isExcluded(currentProfileGroup)"
                    :checked="isSelected('profile', currentProfileGroup)"
                    type="radio"
                    class="form-radio"
                  />
                  <span class="ml-2" v-t="`popup-profile-random${displayOS}.message`"></span>
                </label>
                <div class="flex items-center">
                  <span v-t="'popup-profile-exclude.message'"></span>
                  <input @click="excludeProfile(currentProfileGroup)" :checked="isExcluded(currentProfileGroup)" type="checkbox" class="ml-2 text-primary form-checkbox" />
                </div>
              </div>
              <div v-for="p in profileListing" :key="p.id" class="profile-item fg">
                <label class="flex items-center cursor-pointer" :class="{ 'opacity-50': p.excluded }">
                  <input :id="p.id" @click="setSelected('profile', p.id)" :disabled="p.excluded" :checked="isSelected('profile', p.id)" type="radio" class="form-radio" />
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
      <div v-show="isSelected('tab', 'headers')" class="m-4 text-md">
        <div class="text-lg border-primary border-b-2 mb-4" v-t="'popup-headers.message'"></div>
        <div class="flex items-center mb-1">
          <label class="cursor-pointer">
            <input
              id="enableDNT"
              @change="changeSetting($event)"
              :checked="settings.headers.enableDNT"
              name="headers.enableDNT"
              type="checkbox"
              class="text-primary form-checkbox"
            />
            <span class="ml-1" v-t="'popup-headers-enableDNT.message'"></span>
          </label>
        </div>
        <div class="flex items-center mb-1">
          <label class="cursor-pointer">
            <input
              id="blockEtag"
              @change="changeSetting($event)"
              :checked="settings.headers.blockEtag"
              name="headers.blockEtag"
              type="checkbox"
              class="text-primary form-checkbox"
            />
            <span class="ml-1" v-t="'popup-headers-preventEtag.message'"></span>
          </label>
        </div>
        <div class="flex items-center mb-1">
          <label class="cursor-pointer">
            <input
              id="spoofAcceptLang"
              @change="changeSetting($event)"
              :checked="settings.headers.spoofAcceptLang.enabled"
              name="headers.spoofAcceptLang.enabled"
              type="checkbox"
              class="text-primary form-checkbox"
            />
            <span class="ml-1" v-t="'popup-headers-spoofAcceptLang.message'"></span>
          </label>
        </div>
        <div v-show="settings.headers.spoofAcceptLang.enabled" class="flex flex-col mb-1">
          <label class="ml-6">
            <select
              id="spoofAcceptLangSelect"
              @change="changeSetting($event)"
              :value="settings.headers.spoofAcceptLang.value"
              name="headers.spoofAcceptLang.value"
              class="form-select mt-1 w-full"
            >
              <option value="ip">IP</option>
              <option value="default" v-t="'text-default.message'"></option>
              <option v-for="l in languages" :value="l.code" :key="l.code">{{ l.name }}</option>
            </select>
          </label>
        </div>
        <div class="flex items-center mb-1">
          <label class="cursor-pointer">
            <input
              id="spoofIP"
              @change="changeSetting($event)"
              :checked="settings.headers.spoofIP.enabled"
              name="headers.spoofIP.enabled"
              type="checkbox"
              class="text-primary form-checkbox"
            />
            <span class="ml-1" v-t="'popup-headers-spoofIP.message'"></span>
          </label>
        </div>
        <div v-show="settings.headers.spoofIP.enabled" class="flex flex-col mb-1">
          <label class="ml-6">
            <select id="spoofIPSelect" @change="changeSetting($event)" :value="settings.headers.spoofIP.option" name="headers.spoofIP.option" class="form-select mt-1 w-full">
              <option value="0" v-t="'popup-headers-spoofIP-random.message'"></option>
              <option value="1" v-t="'popup-headers-spoofIP-custom.message'"></option>
            </select>
          </label>
          <div v-show="settings.headers.spoofIP.option == 1" class="flex w-full ml-6 mt-2">
            <div class="mr-1 w-2/5">
              <label for="headers.spoofIP.rangeFrom" v-t="'popup-headers-spoofIP-rangeFrom.message'"></label>
              <input
                id="spoofIPRangeFrom"
                @input="setIPRange($event)"
                v-model="tmp.rangeFrom"
                name="headers.spoofIP.rangeFrom"
                class="block w-full form-input"
                :class="{ error: errors.rangeFrom }"
              />
            </div>
            <div class="ml-1 w-2/5">
              <label for="headers.spoofIP.rangeTo" v-t="'popup-headers-spoofIP-rangeTo.message'"></label>
              <input
                id="spoofIPRangeTo"
                @input="setIPRange($event)"
                v-model="tmp.rangeTo"
                name="headers.spoofIP.rangeTo"
                class="block w-full form-input"
                :class="{ error: errors.rangeTo }"
              />
            </div>
          </div>
        </div>
        <div class="flex items-center mb-1">
          <label class="cursor-pointer">
            <input
              id="disableReferer"
              @change="changeSetting($event)"
              :checked="settings.headers.referer.disabled"
              name="headers.referer.disabled"
              type="checkbox"
              class="text-primary form-checkbox"
            />
            <span class="ml-1" v-t="'text-disableReferer.message'"></span>
          </label>
        </div>
        <div v-show="!settings.headers.referer.disabled">
          <div class="text-sm mt-2" :class="[darkMode ? 'text-red-400' : 'text-red-800']" v-t="'popup-headers-refererWarning.message'"></div>
          <div class="flex items-center mb-1">
            <label class="w-full mt-2">
              <span v-t="'popup-headers-referer-xorigin.message'"></span>
              <select
                id="refererXorigin"
                @change="changeSetting($event)"
                :value="settings.headers.referer.xorigin"
                name="headers.referer.xorigin"
                class="form-select mt-1 block w-full"
              >
                <option value="0" v-t="'popup-headers-referer-xorigin-alwaysSend.message'"></option>
                <option value="1" v-t="'popup-headers-referer-xorigin-matchBaseDomain.message'"></option>
                <option value="2" v-t="'popup-headers-referer-xorigin-matchHost.message'"></option>
              </select>
            </label>
          </div>
          <div class="flex items-center mb-1">
            <label class="w-full mt-2">
              <span v-t="'popup-headers-referer-trimming.message'"></span>
              <select
                id="refererTrim"
                @change="changeSetting($event)"
                :value="settings.headers.referer.trimming"
                name="headers.referer.trimming"
                class="form-select mt-1 block w-full"
              >
                <option value="0" v-t="'popup-headers-referer-trimming-sendFullURI.message'"></option>
                <option value="1" v-t="'popup-headers-referer-trimming-schemeHostPortPath.message'"></option>
                <option value="2" v-t="'popup-headers-referer-trimming-schemeHostPort.message'"></option>
              </select>
            </label>
          </div>
        </div>
      </div>
      <div v-show="isSelected('tab', 'options')" class="m-4 text-md">
        <div class="text-lg border-primary border-b-2 mb-4" v-t="'popup-options.message'"></div>
        <div class="w-full mb-4">
          <button
            @click="openOptionsPage('checklist')"
            id="aboutConfigChecklist"
            class="w-full bg-transparent font-semibold py-1 px-4 border border-primary hover:bg-primary-soft rounded"
            v-t="'popup-options-aboutConfigButton.message'"
          ></button>
        </div>
        <div>
          <ul class="flex text-center w-full rounded-lg">
            <li
              id="injectionTab"
              @click="setSelected('options', 'injection')"
              :class="[isSelected('options', 'injection') ? 'active' : '']"
              class="group fg group-options rounded-l-sm"
              v-t="'popup-options-injection.message'"
            ></li>
            <li
              id="standardTab"
              @click="setSelected('options', 'standard')"
              :class="[isSelected('options', 'standard') ? 'active' : '']"
              class="group fg group-options"
              v-t="'popup-options-standard.message'"
            ></li>
            <li
              id="cookieTab"
              @click="setSelected('options', 'cookie')"
              :class="[isSelected('options', 'cookie') ? 'active' : '']"
              class="group fg group-options rounded-r-sm"
              v-t="'popup-options-cookie.message'"
            ></li>
          </ul>
          <div>
            <div v-if="isSelected('options', 'injection')">
              <div class="flex items-center mt-2 mb-1">
                <label class="cursor-pointer">
                  <input
                    id="blockMediaDevices"
                    @change="changeSetting($event)"
                    :checked="settings.options.blockMediaDevices"
                    name="options.blockMediaDevices"
                    type="checkbox"
                    class="text-primary form-checkbox"
                  />
                  <span class="ml-1" v-t="'popup-options-standard-blockMediaDevices.message'"></span>
                </label>
              </div>
              <div class="flex items-center mb-1">
                <label class="cursor-pointer">
                  <input
                    id="limitHistory"
                    @change="changeSetting($event)"
                    :checked="settings.options.limitHistory"
                    name="options.limitHistory"
                    type="checkbox"
                    class="text-primary form-checkbox"
                  />
                  <span class="ml-1" v-t="'popup-options-injection-limitTabHistory.message'"></span>
                </label>
              </div>
              <div class="flex items-center mb-1">
                <label class="cursor-pointer">
                  <input
                    id="protectKBFingerprint"
                    @change="changeSetting($event)"
                    :checked="settings.options.protectKBFingerprint.enabled"
                    name="options.protectKBFingerprint.enabled"
                    type="checkbox"
                    class="text-primary form-checkbox"
                  />
                  <span class="ml-1" v-t="'popup-options-injection-protectKBFingerprint.message'"></span>
                </label>
              </div>
              <div v-show="settings.options.protectKBFingerprint.enabled" class="flex items-center mb-1 pl-6">
                <input
                  id="protectKBFingerprintDelay"
                  @input="changeSetting($event)"
                  name="options.protectKBFingerprint.delay"
                  :value="settings.options.protectKBFingerprint.delay"
                  type="number"
                  min="1"
                  max="1000"
                  class="block w-2/5 form-input"
                  :placeholder="$t('popup-options-injection-protectKBFingerprintDelay.message')"
                />
              </div>
              <div class="flex items-center mb-1">
                <label class="cursor-pointer">
                  <input
                    id="protectWinName"
                    @change="changeSetting($event)"
                    :checked="settings.options.protectWinName"
                    name="options.protectWinName"
                    type="checkbox"
                    class="text-primary form-checkbox"
                  />
                  <span class="ml-1" v-t="'popup-options-injection-protectWinName.message'"></span>
                </label>
              </div>
              <div class="flex items-center mb-1">
                <label class="cursor-pointer">
                  <input
                    id="spoofAudioContext"
                    @change="changeSetting($event)"
                    :checked="settings.options.spoofAudioContext"
                    name="options.spoofAudioContext"
                    type="checkbox"
                    class="text-primary form-checkbox"
                  />
                  <span class="ml-1" v-t="'popup-options-injection-audioContext.message'"></span>
                </label>
              </div>
              <div class="flex items-center mb-1">
                <label class="cursor-pointer">
                  <input
                    id="spoofClientRects"
                    @change="changeSetting($event)"
                    :checked="settings.options.spoofClientRects"
                    name="options.spoofClientRects"
                    type="checkbox"
                    class="text-primary form-checkbox"
                  />
                  <span class="ml-1" v-t="'popup-options-injection-clientRects.message'"></span>
                </label>
              </div>
              <div class="flex items-center mb-1">
                <label class="cursor-pointer">
                  <input
                    id="spoofFontFingerprint"
                    @change="changeSetting($event)"
                    :checked="settings.options.spoofFontFingerprint"
                    name="options.spoofFontFingerprint"
                    type="checkbox"
                    class="text-primary form-checkbox"
                  />
                  <span class="ml-1" v-t="'popup-options-injection-spoofFontFingerprint.message'"></span>
                </label>
              </div>
              <div class="flex items-center mb-2">
                <label class="w-full mt-2">
                  <span v-t="'popup-options-injection-screen.message'"></span>
                  <select id="screenSize" @change="changeSetting($event)" :value="settings.options.screenSize" name="options.screenSize" class="form-select mt-1 block w-full">
                    <option value="default" v-t="'text-default.message'"></option>
                    <option value="profile" v-t="'text-profile.message'"></option>
                    <option value="1366x768">1366x768</option>
                    <option value="1440x900">1440x900</option>
                    <option value="1600x900">1600x900</option>
                    <option value="1920x1080">1920x1080</option>
                    <option value="1920x1200">1920x1200</option>
                    <option value="2560x1440">2560x1440</option>
                    <option value="2560x1600">2560x1600</option>
                    <option value="3840x2160">3840x2160</option>
                    <option value="4096x2304">4096x2304</option>
                    <option value="5120x2880">5120x2880</option>
                  </select>
                </label>
              </div>
              <div class="flex items-center mb-2">
                <label class="w-full mt-2">
                  <span v-t="'text-timezone.message'"></span>
                  <select id="timeZone" @change="changeSetting($event)" :value="settings.options.timeZone" name="options.timeZone" class="form-select mt-1 block w-full">
                    <option value="default" v-t="'text-default.message'"></option>
                    <option value="ip">IP</option>
                    <option v-for="t in timezones" :key="t.zone" :value="t.zone">({{ t.offset }}) {{ t.zone }}</option>
                  </select>
                </label>
              </div>
            </div>
            <div v-else-if="isSelected('options', 'standard')">
              <div class="flex items-center mt-2 mb-1">
                <label class="cursor-pointer">
                  <input
                    @change="changeSetting($event)"
                    id="firstPartyIsolate"
                    :checked="settings.options.firstPartyIsolate"
                    name="options.firstPartyIsolate"
                    type="checkbox"
                    class="text-primary form-checkbox"
                  />
                  <span class="ml-1" v-t="'popup-options-standard-firstPartyIsolation.message'"></span>
                </label>
              </div>
              <div class="flex items-center mb-1">
                <label class="cursor-pointer">
                  <input
                    id="resistFingerprinting"
                    @change="changeSetting($event)"
                    :checked="settings.options.resistFingerprinting"
                    name="options.resistFingerprinting"
                    type="checkbox"
                    class="text-primary form-checkbox"
                  />
                  <span class="ml-1" v-t="'popup-options-standard-resistFingerprinting.message'"></span>
                </label>
              </div>
              <div class="flex items-center mb-1">
                <label class="cursor-pointer">
                  <input
                    id="disableWebRTC"
                    @change="changeSetting($event)"
                    :checked="settings.options.disableWebRTC"
                    name="options.disableWebRTC"
                    type="checkbox"
                    class="text-primary form-checkbox"
                  />
                  <span class="ml-1" v-t="'popup-options-standard-disableWebRTC.message'"></span>
                </label>
              </div>
              <div v-show="!settings.options.disableWebRTC" class="flex items-center pl-6 mb-2">
                <label class="w-full">
                  <span v-t="'popup-options-standard-webRTCPolicy.message'"></span>
                  <select
                    id="webRTCPolicy"
                    @change="changeSetting($event)"
                    :value="settings.options.webRTCPolicy"
                    name="options.webRTCPolicy"
                    class="form-select mt-1 block w-full"
                  >
                    <option value="default" v-t="'text-default.message'"></option>
                    <option value="default_public_and_private_interfaces" v-t="'popup-options-standard-webRTCPolicy-publicPrivate.message'"></option>
                    <option value="default_public_interface_only" v-t="'popup-options-standard-webRTCPolicy-public.message'"></option>
                    <option value="disable_non_proxied_udp" v-t="'popup-options-standard-webRTCPolicy-nonProxified.message'"></option>
                  </select>
                </label>
              </div>
              <div class="flex items-center mb-2">
                <label class="w-full mt-2">
                  <span v-t="'popup-options-standard-trackingProtection.message'"></span>
                  <select
                    id="trackingProtectionMode"
                    @change="changeSetting($event)"
                    :value="settings.options.trackingProtectionMode"
                    name="options.trackingProtectionMode"
                    class="form-select mt-1 block w-full"
                  >
                    <option value="always" v-t="'popup-options-standard-trackingProtection-on.message'"></option>
                    <option value="never" v-t="'popup-options-standard-trackingProtection-off.message'"></option>
                    <option value="private_browsing" v-t="'popup-options-standard-trackingProtection-privateBrowsing.message'"></option>
                  </select>
                </label>
              </div>
              <div class="flex items-center mb-2">
                <label class="w-full mt-2">
                  Websockets
                  <select id="websockets" @change="changeSetting($event)" :value="settings.options.webSockets" name="options.webSockets" class="form-select mt-1 block w-full">
                    <option value="allow_all" v-t="'text-allowAll.message'"></option>
                    <option value="block_3rd_party" v-t="'popup-options-standard-webSockets-blockThirdParty.message'"></option>
                    <option value="block_all" v-t="'popup-options-standard-webSockets-blockAll.message'"></option>
                  </select>
                </label>
              </div>
            </div>
            <div v-else-if="isSelected('options', 'cookie')">
              <div class="flex items-center mb-2">
                <label class="w-full mt-2">
                  <input
                    id="cookiePersistent"
                    @change="changeSetting($event)"
                    :checked="settings.options.cookieNotPersistent"
                    name="options.cookieNotPersistent"
                    type="checkbox"
                    class="text-primary form-checkbox"
                  />
                  <span v-t="'popup-options-cookieNotPersistent.message'"></span>
                </label>
              </div>
              <div class="flex items-center mb-2">
                <label class="w-full mt-2">
                  <span v-t="'popup-options-cookiePolicy.message'"></span>
                  <select
                    id="cookiePolicy"
                    @change="changeSetting($event)"
                    :value="settings.options.cookiePolicy"
                    name="options.cookiePolicy"
                    class="form-select mt-1 block w-full"
                  >
                    <option value="allow_all" v-t="'text-allowAll.message'"></option>
                    <option value="allow_visited" v-t="'popup-options-cookiePolicy-allowVisited.message'"></option>
                    <option value="reject_all" v-t="'popup-options-cookiePolicy-rejectAll.message'"></option>
                    <option value="reject_third_party" v-t="'popup-options-cookiePolicy-rejectThirdParty.message'"></option>
                    <option value="reject_trackers" v-t="'popup-options-cookiePolicy-rejectTrackers.message'"></option>
                  </select>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-show="isSelected('tab', 'whitelist')" class="m-4 text-md">
        <div class="text-lg border-primary border-b-2 mb-4" v-t="'text-whitelist.message'"></div>
        <div class="flex items-center mb-1">
          <label class="cursor-pointer">
            <input
              id="enableContextMenu"
              @change="changeSetting($event)"
              :checked="settings.whitelist.enabledContextMenu"
              name="whitelist.enabledContextMenu"
              type="checkbox"
              class="text-primary form-checkbox"
            />
            <span class="ml-1" v-t="'popup-whitelist-contextMenu.message'"></span>
          </label>
        </div>
        <div class="flex items-center mb-2">
          <label class="w-full mt-4">
            <span v-t="'popup-whitelist-defaultProfileLabel.message'"></span>
            <select
              id="defaultWhitelistProfile"
              @change="changeSetting($event)"
              :value="settings.whitelist.defaultProfile"
              name="whitelist.defaultProfile"
              class="form-select mt-1 block w-full"
            >
              <option value="none" v-t="'text-realProfile.message'"></option>
              <option v-for="p in profileList" :value="p.id" :key="p.id">{{ p.name }}</option>
            </select>
          </label>
        </div>
        <div v-show="currentPage.domain" class="text-center mt-6 py-2">
          <feather v-if="currentPage.whitelisted" class="text-primary mb-2" type="check-circle" size="4em"></feather>
          <feather v-else class="text-primary mb-2" type="alert-circle" size="4em"></feather>
          <div class="max-w-xs text-lg mx-auto truncate">
            {{ currentPage.domain }}
          </div>
          <div class="mb-2 text-lg">
            {{ currentPage.whitelisted ? $t('popup-whitelist-isWhitelisted.message') : $t('popup-whitelist-isNotWhitelisted.message') }}
          </div>
          <div v-show="currentPage.whitelisted" class="mb-6 text-lg">
            <div class="font-semibold" v-t="'text-profile.message'"></div>
            {{ getWhitelistProfile(currentPage.rule.profile) }}
          </div>
          <button
            @click="openOptionsPage('whitelist')"
            class="bg-primary font-semibold text-light py-2 px-4 border border-primary hover:bg-primary-soft rounded"
            v-t="'popup-whitelist-open.message'"
          ></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import * as lang from '../lib/language';
import * as prof from '../lib/profiles';
import * as tz from '../lib/tz';
import util from '../lib/util';
import webext from '../lib/webext';

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
  public errors = {
    intervalMax: false,
    intervalMin: false,
    rangeFrom: false,
    rangeTo: false,
  };
  public languages: lang.Language[] = lang.getAllLanguages();
  public profiles: any = new prof.Generator().getAllProfiles();
  public timezones: tz.Timezone[] = tz.getTimezones();
  public tmp = {
    intervalMax: '',
    intervalMin: '',
    rangeFrom: '',
    rangeTo: '',
    store: {
      ipInfo: {
        lang: '',
        tz: '',
      },
      profile: '',
    },
  };

  get currentProfile(): any {
    let language: string;
    let profile: string;
    let timezone: string;
    let screen: string;

    if (this.settings.profile.selected === 'none' || this.tmp.store.profile === 'none' || this.settings.excluded.includes(this.settings.profile.selected)) {
      profile = this.$t('text-realProfile.message') as string;
    } else {
      let p: any = this.profileList.find(p => p.id === (/\d/.test(this.settings.profile.selected) ? this.settings.profile.selected : this.tmp.store.profile));
      profile = p ? p.name.replace('-', '/') : '';
    }

    if (this.settings.options.screenSize === 'default') {
      screen = this.$t('popup-home-currentProfile-defaultScreen.message') as string;
    } else if (this.settings.options.screenSize === 'profile') {
      screen = this.$t('popup-home-currentProfile-screenProfile.message') as string;
    } else {
      screen = this.settings.options.screenSize;
    }

    if (this.settings.options.timeZone === 'default') {
      timezone = this.$t('popup-home-currentProfile-defaultTimezone.message') as string;
    } else if (this.settings.options.timeZone === 'ip') {
      timezone = '(IP) ' + this.tmp.store.ipInfo.tz;
    } else {
      timezone = this.settings.options.timeZone;
    }

    if (this.settings.headers.spoofAcceptLang.enabled) {
      if (this.settings.headers.spoofAcceptLang.value) {
        if (this.settings.headers.spoofAcceptLang.value === 'default') {
          language = this.$t('popup-home-currentProfile-defaultLanguage.message') as string;
        } else if (this.settings.headers.spoofAcceptLang.value === 'ip') {
          if (this.tmp.store.ipInfo.lang != '') {
            language = lang.getLanguage(this.tmp.store.ipInfo.lang).name + ' (IP)';
          } else {
            language = this.$t('popup-home-currentProfile-gettingTimezone.message') as string;
          }
        } else {
          language = lang.getLanguage(this.settings.headers.spoofAcceptLang.value).name;
        }
      }
    } else {
      language = this.$t('popup-home-currentProfile-defaultLanguage.message') as string;
    }

    return {
      profile,
      screen,
      timezone,
      lang: language,
    };
  }

  get darkMode(): boolean {
    return this.settings.config.theme === 'dark';
  }

  get displayOS(): string {
    if (this.currentProfileGroup === 'windows') {
      return 'Windows';
    } else if (this.currentProfileGroup === 'macOS') {
      return 'MacOS';
    } else if (this.currentProfileGroup === 'linux') {
      return 'Linux';
    } else if (this.currentProfileGroup === 'iOS') {
      return 'IOS';
    } else if (this.currentProfileGroup === 'android') {
      return 'Android';
    }
  }

  get isRandomProfile(): boolean {
    if (this.settings.profile.selected.includes('random') || ['windows', 'macOS', 'linux', 'iOS', 'android'].includes(this.settings.profile.selected)) {
      return true;
    }

    return false;
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

  get version(): string {
    return browser.runtime.getManifest().version_name;
  }

  activeTab(tab: string): string[] {
    if (this.currentTab === tab) {
      return [this.darkMode ? 'bg-dark' : 'bg-light', 'active'];
    }

    return ['hover:bg-primary-soft'];
  }

  async changeProfile(): Promise<void> {
    browser.runtime.sendMessage({
      action: 'reloadProfile',
      data: null,
    });
  }

  async changeSetting(evt: any): Promise<void> {
    let v: string | boolean;

    if (evt.target.type === 'checkbox') {
      v = evt.target.checked;
    } else {
      v = evt.target.value;
    }

    await this['$store'].dispatch('changeSetting', [
      {
        name: evt.target.name,
        value: v,
      },
    ]);

    webext.sendToBackground(this.settings);
  }

  async created() {
    browser.runtime.onMessage.addListener(
      function(request: any): void {
        if (request.action === 'tempStore') {
          Vue.set(this.tmp, 'store', request.data);
        }
      }.bind(this)
    );

    await this['$store'].dispatch('initialize');

    this.getCurrentPage();

    if (!/random|none/.test(this.settings.profile.selected)) {
      if (this.settings.profile.selected.includes('win')) {
        this.currentProfileGroup = 'windows';
      } else if (this.settings.profile.selected.includes('mac')) {
        this.currentProfileGroup = 'macOS';
      } else if (this.settings.profile.selected.includes('lin')) {
        this.currentProfileGroup = 'linux';
      } else if (this.settings.profile.selected.toLowerCase().includes('ios')) {
        this.currentProfileGroup = 'iOS';
      } else if (this.settings.profile.selected.includes('and')) {
        this.currentProfileGroup = 'android';
      }
    }

    this.tmp.intervalMax = this.settings.profile.interval.max;
    this.tmp.intervalMin = this.settings.profile.interval.min;
    this.tmp.rangeFrom = this.settings.headers.spoofIP.rangeFrom;
    this.tmp.rangeTo = this.settings.headers.spoofIP.rangeTo;
  }

  async getCurrentPage() {
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

    return p ? p.name : profile === 'default' ? this.$t('text-defaultWhitelistProfile.message') : (this.$t('text-realProfile.message') as any);
  }

  async excludeProfile(profile: string) {
    if (!/\d/.test(profile)) {
      await this['$store'].dispatch(
        'excludeProfile',
        this.profileListing.map(p => p.id)
      );
    } else {
      await this['$store'].dispatch('excludeProfile', profile);
    }

    webext.sendToBackground(this.settings);
  }

  isExcluded(profileId: string): boolean {
    if (!profileId) return false;

    if (!/\d/.test(profileId)) {
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
    if (tab === 'whitelist') {
      if (this.currentPage.whitelisted) {
        tab += `?id=${this.currentPage.rule.id}`;
      } else {
        tab += `?site=${this.currentPage.domain}`;
      }
    }

    browser.tabs.create({
      url: browser.runtime.getURL(`/options/options.html#${tab}`),
    });
    window.close();
  }

  async setIPRange(evt: any) {
    let regex = new RegExp(/^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/);
    let key: string = evt.target.name.includes('rangeFrom') ? 'rangeFrom' : 'rangeTo';
    let compareTo: string = key === 'rangeFrom' ? 'rangeTo' : 'rangeFrom';

    if (!regex.test(evt.target.value)) {
      this.errors[key] = true;
      return;
    }

    let valid: boolean = util.validateIPRange(this.tmp.rangeFrom, this.tmp.rangeTo);

    if (valid) {
      this.errors.rangeFrom = false;
      this.errors.rangeTo = false;
    } else {
      this.errors.rangeFrom = true;
      this.errors.rangeTo = true;
      return;
    }

    await this['$store'].dispatch('changeSetting', [
      {
        name: 'headers.spoofIP.rangeFrom',
        value: this.tmp.rangeFrom,
      },
      {
        name: 'headers.spoofIP.rangeTo',
        value: this.tmp.rangeTo,
      },
    ]);

    webext.sendToBackground(this.settings);
  }

  async setProfileInterval(evt: any) {
    let key: string = evt.target.name.includes('min') ? 'intervalMin' : 'intervalMax';
    let compareTo: string = key === 'intervalMin' ? 'intervalMax' : 'intervalMin';

    this.tmp[key] = parseInt(evt.target.value, 10);

    let min: number = parseInt(this.tmp.intervalMin, 10) || 0;
    let max: number = parseInt(this.tmp.intervalMax, 10) || 0;

    if (min > 0 && max > 0 && min <= max) {
      this.errors.intervalMin = false;
      this.errors.intervalMax = false;
    } else {
      this.errors.intervalMin = true;
      this.errors.intervalMax = true;
      return;
    }

    await this['$store'].dispatch('changeSetting', [
      {
        name: 'profile.interval.min',
        value: this.tmp.intervalMin,
      },
      {
        name: 'profile.interval.max',
        value: this.tmp.intervalMax,
      },
    ]);

    webext.sendToBackground(this.settings);
  }

  async setSelected(type: string, value: string) {
    if (type === 'options') {
      this.currentOption = value;
    } else if (type === 'os') {
      this.currentProfileGroup = this.currentProfileGroup === value ? '' : value;
      (this.$refs.scrollView as any).$el.scrollTop = 0;
    } else if (type === 'profile') {
      await this['$store'].dispatch('changeProfile', value);
      webext.sendToBackground(this.settings);
    } else if (type === 'tab') {
      this.currentTab = value;
    }
  }

  async toggleChameleon() {
    await this['$store'].dispatch('toggleChameleon', !this.settings.config.enabled);
    webext.sendToBackground(this.settings);

    browser.runtime.sendMessage({
      action: 'reloadInjectionScript',
    });
  }

  async toggleNotifications() {
    await this['$store'].dispatch('toggleNotifications');
    webext.sendToBackground(this.settings);
  }

  async toggleTheme() {
    await this['$store'].dispatch('toggleTheme');
    webext.sendToBackground(this.settings);
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

.ps__rail-y {
  opacity: 0.6 !important;
}
</style>
