export default {
  type: 'custom',
  data: `
    let handler = (e) => {
      let delay = CHAMELEON_SPOOF.get(spoofContext).kbDelay; 
      if (e.target && e.target.nodeName == 'INPUT') {
        if (Math.floor(Math.random() * 2)) {
          let endTime = Date.now() + Math.floor(Math.random() * (30 + (delay || 30)));
          while(Date.now() < endTime) {};
        } 
      }
    }

    spoofContext.document.addEventListener('keyup', handler);
    spoofContext.document.addEventListener('keydown', handler);`,
};
