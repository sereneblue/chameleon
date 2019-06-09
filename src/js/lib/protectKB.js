let protectKB = () => {
	return `
		let handler = (e) => {
			 if (e.target && e.target.nodeName == 'INPUT'){
	         	if (Math.floor(Math.random() * 2)) {
					let endTime = Date.now() + (Math.floor(Math.random() * 20));
				 	while(Date.now() < endTime) {};
	         	} 
			}
		}

		document.addEventListener('keypress', handler);
		document.addEventListener('keyup', handler);
	`;
}