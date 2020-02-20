import re

regexp = re.compile('(<a(.|\s)*?)[<a]?')

with open('CHANGELOG.md') as f:
  versions = []

  log = f.read()
  for i in log.split('<a name="v'):
    for j in i.strip().split('</a>'):
      contents = j.strip()
      if contents != "" and contents[0] == "#":
        versions.append(contents)

  if len(versions):
    print("\n".join(versions[0].split('\n')[2:]))