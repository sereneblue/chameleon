let protectKB = (delay) => {
	return `
		let handler = (e) => {
			let delay = ${delay}; 
			if (e.target && e.target.nodeName == 'INPUT'){
	         	if (Math.floor(Math.random() * 2)) {
					let endTime = Date.now() + (Math.floor(Math.random() * (delay || 20) ));
				 	while(Date.now() < endTime) {};
	         	} 
			}
		}

		document.addEventListener('keypress', handler);
		document.addEventListener('keyup', handler);
	`;
}