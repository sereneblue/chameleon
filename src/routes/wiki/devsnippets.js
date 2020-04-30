export default {
  controlWithExtension: [
    {
      lang: 'javascript',
      title: 'JavaScript',
      code: `
// You'll need to use the developer build of Chameleon if you want to
// control Chameleon with another extension
// https://github.com/sereneblue/chameleon/releases

let chameleonPort = browser.runtime.connect("{3579f63b-d8ee-424f-bbb6-6d0ce3285e6a}");

// change browser profile to Windows 10 - Firefox
chameleonPort.postMessage({
  action: 'updateProfile',
  data: 'win4-ff',
});

// import settings by using the settings exported by Chameleon
// let settings = exported settings loaded as an object  
// saving settings is also how changes are persisted after reloading the extension
chameleonPort.postMessage({
  action: 'save',
  data: settings,
});

// Don't forget to call reloadInjectionScrip and/or reload IP info after making the changes above.
chameleonPort.postMessage({
  action: 'reloadIPInfo',
  data: false
});

chameleonPort.postMessage({
  action: 'reloadInjectionScript',
});

// The logic for how messages are routed is mostly handled in this file
// https://github.com/sereneblue/chameleon/blob/develop/src/store/actions.ts`
    }
  ],
  importSettings: [
    {
      lang: 'python',
      title: 'Python',
      code: `   
# navigate to chameleon options page
driver.get(OPTIONS_PAGE)

# import settings
driver.find_element_by_id('chameleonImport').send_keys('/path/to/settings.json')

# wait for chameleon to reload
sleep(3)
      `
    }
  ],
  launchChameleon: [
    {
      lang: 'python',
      title: 'Python',
      code: `
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
from time import sleep

firefox_binary = '/usr/bin/firefox'
driver = webdriver.Firefox(firefox_binary=firefox_binary, executable_path='./geckodriver')
extension_path = '/path/to/chameleon/ext.xpi'
driver.install_addon(extension_path, temporary=True)

driver.get('about:debugging#/runtime/this-firefox')

# wait for extensions to appear
wait = WebDriverWait(driver, 5)
element = wait.until(EC.element_to_be_clickable((By.CLASS_NAME, 'card')))

# internal uuid for extension pages
internal_uuid = driver.execute_script("""
  let extensions = Array.from(document.querySelectorAll('.card'));
  let chameleon = extensions.filter(el => el.querySelector('span').title == 'Chameleon')[0];
  let metadata = Array.from(chameleon.querySelectorAll('.fieldpair__description')).map(e => e.innerText);
  return metadata[2];
""")

POPUP_PAGE = f'moz-extension://{internal_uuid}/popup/popup.html'
OPTIONS_PAGE = f'moz-extension://{internal_uuid}/options/options.html'

# navigate to chameleon popup page
driver.get(POPUP_PAGE)

# select profile tab
driver.find_element_by_id('profileTab').click()

# select Random Desktop profile option
driver.find_element_by_id('randomDesktop').click()

# verify user agent changed
driver.get('https://httpbin.org/headers')

sleep(10)

driver.quit()
      `
    }
  ]
}