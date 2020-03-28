<script>
  import sha1 from 'tiny-hashes/sha1';

  let generateRandomNum = () => {
    return Math.floor(Math.random() * 50);
  }

  let operation = Math.random() > 0.5 ? 'plus' : 'minus';
  let firstNum = generateRandomNum();
  let secondNum = generateRandomNum();
  let _0x9ba0 = ["\x32\x38\x34\x31\x39\x30\x66\x63\x30\x36\x36\x36\x34\x64\x36\x37\x62\x34\x61\x33\x38\x36\x66\x63\x34\x32\x35\x62\x36\x35\x36\x66"];
  let k = _0x9ba0[0];
  let reqStatus = "";
  let pending = false;

  $: solution = operation === 'plus' ? firstNum + secondNum : firstNum - secondNum;
  $: captchaMsg = `What is ${firstNum} ${operation} ${secondNum}?`;

  let submitForm = async () => {
    let form = new FormData(document.querySelector('form'));
    let userSolution = Number(form.get('solution'));

    pending = true;

    if (userSolution === solution) {
      try {
        let res = await fetch(`https://flamboyant-colden-cabaa9.netlify.com/.netlify/functions/app`, {
          method: 'POST',
          body: JSON.stringify({
            name: form.get('name'),
            email: form.get('email'),
            message: form.get('message'),
            h: sha1(`${form.get('email')}:${k}`)
          }),
          headers: {
            'Content-Type': 'application/json'
          }
        });

        let data = await res.json();
        if (data.success) {
          reqStatus = "success";
        } else {
          reqStatus = "fail";
        }

      } catch (e) {
        reqStatus = "fail";
      }

      pending = false;
    } else {
      firstNum = generateRandomNum();
      secondNum = generateRandomNum();

      document.querySelector('input[name="solution"]').value = "";
    }
  }
</script>

<svelte:head>
	<title>Contact | Chameleon</title>
</svelte:head>

<div class="flex bg-light h-screen w-full px-2 lg:	px-0 justify-center">
	<div class="flex lg:max-w-5xl mt-8 md:mt-8 w-full">
		<div class="flex flex-col w-full">
			<h2 class="font-bold text-5xl mb-5 text-center">Contact</h2>
      <div class="w-full px-4 text-lg">
        {#if reqStatus == "success"}
          <div class="bg-green-200 p-2 rounded mb-4 text-center">
            Your message has been  successfully sent!
          </div>
        {:else if reqStatus == "fail"}
          <div class="bg-red-200 p-2 rounded mb-4 text-center">
            There was an error sending the message. Please try again later.
          </div>
        {:else}
          <form on:submit|preventDefault={submitForm} method="POST">
            <label class="block">
              <span class="text-gray-700">Name</span>
              <input name="name" class="form-input mt-1 block w-full" type="text" required>
            </label>
            <label class="block my-2">
              <span class="text-gray-700">Email</span>
              <input name="email" class="form-input mt-1 block w-full" type="email" required>
            </label>
            <label class="block">
              <span class="text-gray-700">Message</span>
              <textarea name="message" class="form-textarea mt-1 block w-full" rows="5" required></textarea>
            </label>
            <label class="block my-2">
              <span class="text-gray-700">{ captchaMsg }</span>
              <input name="solution" class="form-input mt-1 block w-full" type="text" required>
            </label>
            <button class="bg-primary hover:bg-primary-soft text-white font-bold py-2 px-4 mt-4 border border-primary w-full rounded" type="submit" disabled='{pending}'>
              Send message
            </button>
          </form>
        {/if}
      </div>
		</div>
	</div>
</div>