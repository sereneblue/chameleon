<script>
  import Snippet from '../../components/Snippet.svelte';
  import devsnips from './devsnippets';

</script>

<svelte:head>
	<title>Developer Guide | Chameleon</title>
</svelte:head>

<div class="mb-8 px-4 leading-tight">
  <div class="text-lg mb-4">
    You can use the scripts below to manage Chameleon with a browser automation library.
  </div>
  <div class="mb-4">
    <Snippet title="Launch a browser with Chameleon" data={devsnips.launchChameleon}/> 
  </div>
  <div class="mb-4">
    <Snippet title="Import Settings" data={devsnips.importSettings}/> 
  </div>
  <div class="mb-4">
    <h2 class="font-semibold text-xl border-primary border-b-2 mb-1">Browser Profiles</h2>
    <p>
      When selecting a specfic browser profile to use, you can use the browser profile ID as a selector. Profile IDs are
      made from a combination of an OS and a browser such as "win1-edg". Listed below are OS IDs and the browser abbreviations
      that Chameleon uses.
    </p>
    <table>
      <thead>
        <tr>
          <th>OS</th>
          <th>ID</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Windows 7</td>
          <td>win1</td>
        </tr>
        <tr>
          <td>Windows 8</td>
          <td>win2</td>
        </tr>
        <tr>
          <td>Windows 8.1</td>
          <td>win3</td>
        </tr>
        <tr>
          <td>Windows 10</td>
          <td>win4</td>
        </tr>
        <tr>
          <td>macOS 10.13 (or 2 behind latest)</td>
          <td>mac1</td>
        </tr>
        <tr>
          <td>macOS 10.14 (or 1 behind latest)</td>
          <td>mac2</td>
        </tr>
        <tr>
          <td>macOS 10.15 (or latest)</td>
          <td>mac3</td>
        </tr>
        <tr>
          <td>Linux</td>
          <td>lin1</td>
        </tr>
        <tr>
          <td>Ubuntu Linux</td>
          <td>lin2</td>
        </tr>
        <tr>
          <td>Fedora Linux</td>
          <td>lin3</td>
        </tr>
        <tr>
          <td>iOS 11 (or 2 behind latest)</td>
          <td>ios1</td>
        </tr>
        <tr>
          <td>iOS 12 (or 1 behind latest)</td>
          <td>ios2</td>
        </tr>
        <tr>
          <td>iOS 13 (or latest)</td>
          <td>ios3</td>
        </tr>
        <tr>
          <td>Android 6 (or 4 behind latest)</td>
          <td>and1</td>
        </tr>
        <tr>
          <td>Android 7 (or 3 behind latest)</td>
          <td>and2</td>
        </tr>
        <tr>
          <td>Android 8 (or 2 behind latest)</td>
          <td>and3</td>
        </tr>
        <tr>
          <td>Android 9 (or 1 behind latest)</td>
          <td>and4</td>
        </tr>
      </tbody>
    </table>
    <table>
      <thead>
        <tr>
          <th>Browser</th>
          <th>ID</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Chrome</td>
          <td>gcr (desktop) / gcrm (mobile) / gcrt (tablet)</td>
        </tr>
        <tr>
          <td>Edge</td>
          <td>edg (desktop) / edgm (mobile)</td>
        </tr>
        <tr>
          <td>Firefox</td>
          <td>ff (desktop) / ffm (mobile) / fft (tablet)</td>
        </tr>
        <tr>
          <td>Internet Explorer</td>
          <td>ie</td>
        </tr>
        <tr>
          <td>Safari</td>
          <td>sf (desktop) / sfm (iPhone) / sft (iPad)</td>
        </tr>
      </tbody>
    </table>
  </div>
  <div class="mb-4">
    <Snippet title="Controlling Chameleon with an Addon" data={devsnips.controlWithExtension}/> 
  </div>
</div>