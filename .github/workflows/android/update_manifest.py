import json

manifest = {}

with open('./src/manifest.json') as f:
  manifest = json.load(f)

  # increment version for android build
  version = manifest['version'].split('.')
  version[-1] = str(int(version[-1]) + 1)

  manifest['version'] = ".".join(version)

  # add update url
  manifest['browser_specific_settings']['gecko']['update_url'] = 'https://raw.githubusercontent.com/sereneblue/chameleon/master/.github/workflows/android/updates.json'

  # remove optional permissions
  del manifest['optional_permissions']

  manifest['permissions'].append('privacy')

with open('./src/manifest.json', 'w') as f:
  json.dump(manifest, f, indent=2)