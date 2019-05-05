let protectKB = () => {
	return `
		let handler = (e) => {
			 if (e.target && e.target.nodeName == 'INPUT' && e.target.type == 'text'){
	         	if (Math.floor(Math.random() * 2)) {
					let endTime = Date.now() + (Math.floor(Math.random() * 30));
				 	while(Date.now() < endTime) {};
	         	} 
			}
		}

		document.addEventListener('keyup', handler);
		document.addEventListener('keydown', handler);
	`;
}