export default {
  type: 'custom',
  data: `
		const COMMON_FONTS_WINDOWS = ['Arial', 'Arial Black', 'Calibri', 'Cambria', 'Cambria Math', 'Candara', 'Comic Sans MS', 'Consolas', 'Constantia', 'Corbel', 'Courier New', 'Ebrima', 'Franklin Gothic Medium', 'Gabriola', 'Georgia', 'Impact', 'Lucida Console', 'Lucida Sans Unicode', 'Malgun Gothic', 'Microsoft Himalaya', 'Microsoft JhengHei', 'Microsoft New Tai Lue', 'Microsoft PhagsPa', 'Microsoft Sans Serif', 'Microsoft Tai Le', 'Microsoft Yi Baiti', 'Microsoft YaHei', 'Mongolian Baiti', 'MS Gothic', 'Palatino Linotype', 'Segoe Print', 'Segoe Script', 'Segoe UI', 'Segoe UI Symbol', 'SimSun', 'Sylfaen', 'Symbol', 'Tahoma', 'Times New Roman', 'Trebuchet MS', 'Verdana', 'Webdings', 'Wingdings'];
		const COMMON_FONTS_MAC		 = ['Al Bayan', 'Al Nile', 'Al Tarikh', 'American Typewriter', 'Andale Mono', 'Apple Braille', 'Apple Chancery', 'Apple Color Emoji', 'Apple SD Gothic Neo', 'Apple Symbols', 'AppleGothic', 'AppleMyungjo', 'Arial', 'Arial Black', 'Arial Hebrew', 'Arial Rounded MT Bold', 'Arial Narrow', 'Avenir', 'Avenir Next', 'Avenir Next Condensed', 'Ayuthaya', 'Baghdad', 'Bangla MN', 'Bangla Sangam MN', 'Baskerville', 'Beirut', 'Big Caslon', 'Bodoni 72', 'Bodoni 72 Oldstyle', 'Bodoni 72 Smallcaps', 'Bodoni Ornaments', 'Bradley Hand', 'Brush Script MT', 'Chalkboard', 'Chalkboard SE', 'Chalkduster', 'Charter', 'Cochin', 'Comic Sans MS', 'Copperplate', 'Corsiva Hebrew', 'Courier', 'Courier New', 'Damascus', 'DecoType Naskh', 'Devanagari MT', 'Devanagari Sangam MN', 'Didot', 'Diwan Kufi', 'Diwan Thuluth', 'DIN Alternate', 'DIN Condensed', 'Euphemia UCAS', 'Farah', 'Futura', 'GB18030', 'Geeza Pro', 'Geneva', 'Georgia', 'Gill Sans', 'Gujarati MT', 'Gujarati Sangam MN', 'Gurmukhi MN', 'Gurmukhi MT', 'Gurmukhi Sangam MN', 'Heiti SC', 'Heiti TC', 'Helvetica', 'Helvetica Neue', 'Herculanum', 'Hiragino Kaku Gothic StdN', 'Hiragino Maru Gothic ProN', 'Hiragino Mincho ProN', 'Hiragino Sans', 'Hoefler Text', 'ITF Devanagari', 'ITF Devanagari Marathi', 'Impact', 'InaiMathi', 'Kailasa', 'Kannada MN', 'Kannada Sangam MN', 'Kefa', 'Khmer MN', 'Khmer Sangam MN', 'Kohinoor Bangla', 'Kohinoor Devanagari', 'Kohinoor Telugu', 'Kokonor', 'Krungthep', 'KufiStandardGK', 'Lao MN', 'Lao Sangam MN', 'Lucida Grande', 'Luminari', 'Malayalam MN', 'Malayalam Sangam MN', 'Marker Felt', 'Menlo', 'Microsoft Sans Serif', 'Mishafi', 'Mishafi Gold', 'Monaco', 'Mshtakan', 'Muna', 'Myanmar MN', 'Myanmar Sangam MN', 'Nadeem', 'New Peninim MT', 'Noteworthy', 'Noto Nastaliq Urdu', 'Optima', 'Oriya MN', 'Oriya Sangam MN', 'PT Mono', 'PT Sans', 'PT Serif', 'Palatino', 'Papyrus', 'Phosphate', 'PingFang HK', 'PingFang SC', 'PingFang TC', 'Plantagenet Cherokee', 'Raanana', 'Rockwell', 'STIXGeneral', 'STIXIntegralsD', 'STIXIntegralsSm', 'STIXIntegralsUp', 'STIXIntegralsUpD', 'STIXIntegralsUpSm', 'STIXNonUnicode', 'STIXSizeFiveSym', 'STIXSizeFourSym', 'STIXSizeOneSym', 'STIXSizeThreeSym', 'STIXSizeTwoSym', 'STIXVariants', 'STSong', 'Sana', 'Sathu', 'Savoye LET', 'Shree Devanagari 714', 'SignPainter-HouseScript', 'Silom', 'Sinhala MN', 'Sinhala Sangam MN', 'Skia', 'Snell Roundhand', 'Songti SC', 'Songti TC', 'Sukhumvit Set', 'Symbol', 'Tahoma', 'Tamil MN', 'Tamil Sangam MN', 'Telugu MN', 'Telugu Sangam MN', 'Thonburi', 'Times', 'Times New Roman', 'Times Roman', 'Trattatello', 'Trebuchet MS', 'Verdana', 'Waseem', 'Webdings', 'Wingdings', 'Zapf Dingbats', 'Zapfino'];
		const COMMON_FONTS_LINUX   = ['Andale Mono', 'Arial', 'Arial Black', 'Comic Sans MS', 'Courier New', 'Droid Sans', 'Georgia', 'Impact', 'Liberation Mono', 'Liberation Sans', 'Noto Color Emoji', 'Noto Mono', 'Noto Sans', 'Times New Roman', 'Trebuchet MS', 'Veradana', 'Webdings'];
		const COMMON_FONTS_IOS  	 = ['Academy Engraved LET', 'Al Nile', 'American Typewriter', 'Apple Color Emoji', 'Apple SD Gothic Neo', 'Arial', 'Arial Hebrew', 'Arial Rounded MT Bold', 'Avenir', 'Avenir Next', 'Avenir Next Condensed', 'Baskerville', 'Bodoni 72', 'Bodoni 72 Oldstyle', 'Bodoni 72 Smallcaps', 'Bodoni Ornaments', 'Bradley Hand', 'Chalkboard SE', 'Chalkduster', 'Charter', 'Cochin', 'Copperplate', 'Courier', 'Courier New', 'Damascus', 'Devanagari Sangam MN', 'Didot', 'DIN Alternate', 'DIN Condensed', 'Euphemia UCAS', 'Farah', 'Futura', 'Geeza Pro', 'Georgia', 'Gill Sans', 'Helvetica', 'Helvetica Neue', 'Hiragino Maru Gothic ProN', 'Hiragino Mincho ProN', 'Hiragino Sans', 'Hoefler Text', 'Kailasa', 'Kefa', 'Khmer Sangam MN', 'Kohinoor Bangla', 'Kohinoor Devanagari', 'Kohinoor Telugu', 'Lao Sangam MN', 'Malayalam Sangam MN', 'Marker Felt', 'Menlo', 'Mishafi', 'Myanmar Sangam MN', 'Noteworthy', 'Noto Nastaliq Urdu', 'Optima', 'Palatino', 'Papyrus', 'Party LET', 'PingFang HK', 'PingFang SC', 'PingFang TC', 'Rockwell', 'Savoye LET', 'Sinhala Sangam MN', 'Snell Roundhand', 'Symbol', 'Tamil Sangam MN', 'Thonburi', 'Times New Roman', 'Trebuchet MS', 'Verdana', 'Zapf Dingbats', 'Zapfino' ];
		const COMMON_FONTS_ANDROID = ['Carrois Gothic SC', 'Cutive Mono',  'Cutive Mono', 'Dancing Script', 'Droid Sans', 'Droid Serif', 'Noto Sans', 'Noto Serif', 'Roboto', 'Roboto Condensed'];
		const DEFAULT_FONT = ['sans serif', 'serif', 'monospace', 'auto'];
		const WEB_FONTS 	 = ['CoreUI-Icons-Linear-Free', 'CoreUI-Icons-Free', 'iconmonstr-iconic-font', 'icomoon', 'FontAwesome', 'Material Design Icons', 'Material Icons'];

		const FONTS = {
			'win1': COMMON_FONTS_WINDOWS.concat([
				'Aharoni Bold', 'Andalus', 'Angsana New', 'AngsanaUPC', 'Aparajita', 'Arabic Typesetting', 'Batang', 'Browallia New', 'BrowalliaUPC', 'Cordia New', 'CordiaUPC', 'DaunPenh', 'David', 'DFKai-SB', 'DilleniaUPC', 'DokChampa', 'Dotum', 'Estrangelo Edessa', 'EucrosiaUPC', 'Euphemia', 'FangSong', 'FrankRuehl', 'FreesiaUPC', 'Gautami', 'Gisha', 'Gulim', 'Gungsuh', 'IrisUPC', 'Iskoola Pota', 'JasmineUPC', 'KaiTi', 'Kalinga', 'Kartika', 'Khmer UI', 'KodchiangUPC', 'Kokila', 'Lao UI', 'Latha', 'Leelawadee', 'Levenim MT', 'LilyUPC', 'Mangal', 'Marlett', 'Meiryo', 'Meiryo UI', 'Microsoft Ulghur', 'MingLiU', 'Miriam', 'MoolBoran', 'MS Mincho', 'MV Boli', 'Narkisim', 'Nyala', 'Plantagenet Cherokee', 'Raavi', 'Rod', 'Sakkal Majalla', 'Shonar Bangla', 'Shruti', 'SimHei', 'Simplified Arabic', 'Traditional Arabic', 'Tunga', 'Utsaah', 'Vani', 'Vijaya', 'Vrinda'
			]),
			'win2': COMMON_FONTS_WINDOWS.concat([
				'Aharoni Bold', 'Aldhabi', 'Andalus', 'Angsana New', 'AngsanaUPC', 'Aparajita', 'Arabic Typesetting', 'Batang', 'Browallia New', 'BrowalliaUPC', 'Cordia New', 'CordiaUPC', 'DaunPenh', 'David', 'DFKai-SB', 'DilleniaUPC', 'DokChampa', 'Dotum', 'Estrangelo Edessa', 'EucrosiaUPC', 'Euphemia', 'FangSong', 'FrankRuehl', 'FreesiaUPC', 'Gadugi', 'Gautami', 'Gisha', 'Gulim', 'Gungsuh', 'IrisUPC', 'Iskoola Pota', 'JasmineUPC', 'Javanese Text', 'KaiTi', 'Kalinga', 'Kartika', 'Khmer UI', 'KodchiangUPC', 'Kokila', 'Lao UI', 'Latha', 'Leelawadee', 'Levenim MT', 'LilyUPC', 'Mangal', 'Marlett', 'Meiryo', 'Meiryo UI', 'Microsoft Ulghur', 'MingLiU', 'Miriam', 'MoolBoran', 'MS Mincho', 'MV Boli', 'Myanmar Text', 'Narkisim', 'Nirmala UI', 'Nyala', 'Plantagenet Cherokee', 'Raavi', 'Rod', 'Sakkal Majalla', 'Shonar Bangla', 'Shruti', 'SimHei', 'Simplified Arabic', 'Traditional Arabic', 'Tunga', 'Urdu Typesetting', 'Utsaah', 'Vani', 'Vijaya', 'Vrinda'
			]),
			'win3': COMMON_FONTS_WINDOWS.concat([
				'Aharoni Bold', 'Aldhabi', 'Andalus', 'Angsana New', 'AngsanaUPC', 'Aparajita', 'Arabic Typesetting', 'Batang', 'Browallia New', 'BrowalliaUPC', 'Cordia New', 'CordiaUPC', 'DaunPenh', 'David', 'DFKai-SB', 'DilleniaUPC', 'DokChampa', 'Dotum', 'Estrangelo Edessa', 'EucrosiaUPC', 'Euphemia', 'FangSong', 'FrankRuehl', 'FreesiaUPC', 'Gadugi', 'Gautami', 'Gisha', 'Gulim', 'Gungsuh', 'IrisUPC', 'Iskoola Pota', 'JasmineUPC', 'Javanese Text', 'KaiTi', 'Kalinga', 'Kartika', 'Khmer UI', 'KodchiangUPC', 'Kokila', 'Lao UI', 'Latha', 'Leelawadee', 'Leelawadee UI', 'Levenim MT', 'LilyUPC', 'Mangal', 'Meiryo', 'Meiryo UI', 'Microsoft Ulghur', 'MingLiU', 'Miriam', 'MoolBoran', 'MS Mincho', 'MV Boli', 'Myanmar Text', 'Narkisim', 'Nirmala UI', 'Nyala', 'Plantagenet Cherokee', 'Raavi', 'Rod', 'Sakkal Majalla', 'Segoe UI Emoji', 'Shonar Bangla', 'Shruti', 'SimHei', 'Simplified Arabic', 'Sitka', 'Traditional Arabic', 'Tunga', 'Urdu Typesetting', 'Utsaah', 'Vani', 'Vrinda', 'Yu Gothic', 'Yu Mincho'
			]),
			'win4': COMMON_FONTS_WINDOWS.concat([
				'Bahnschrift', 'Gadugi', 'HoloLens MDL2 Assets', 'Ink Free', 'Javanese Text', 'Leelawadee UI', 'Marlett', 'MingLiU-ExtB', 'Myanmar Text', 'Nirmala UI', 'Segoe MDL2 Assets', 'Segoe UI Historic', 'Segoe UI Emoji', 'Sitka', 'Yu Gothic'
			]),
			'mac1': COMMON_FONTS_MAC.concat([
				'Hiragino Kaku Gothic ProN'
			]),
			'mac2': COMMON_FONTS_MAC.concat([
				'Farisi'
			]),
			'mac3': COMMON_FONTS_MAC.concat([
				'Farisi', 'Galvji', 'Kohinoor Gujarati', 'MuktaMahee', 'Noto Sans Kannada', 'Noto Sans Myanmar', 'Noto Sans Oriya'
			]),
			'lin1': COMMON_FONTS_LINUX.concat([
				'Akaash', 'AkrutiMal1', 'AkrutiMal2', 'AkrutiTml1', 'AkrutiTml2', 'Bitstream Vera Sans', 'Bitstream Vera Sans Mono', 'Bitstream Vera Serif', 'C059', 'Cantarell', 'D050000L', 'Droid Sans Mono', 'Gargi-1.2b', 'GurbaniBoliLite', 'Hack', 'Inconsolata', 'Liberation Serif', 'LIkhan', 'malayalam', 'MalOtf', 'Mukti Narrow', 'Nimbus Mono PS', 'Nimbus Roman', 'Nimbus Sans', 'Noto Mono', 'Noto Serif', 'orya', 'P052', 'padmaa', 'Pothana2000', 'Sagar', 'Sampige', 'Source Code Pro', 'Source Code Variable', 'Standard Symbols PS', 'TAMu_Kadambri', 'TAMu_Kalyani', 'TAMu_Maduram', 'TSCu_Comic', 'TSCu_Paranar', 'TSCu_Times', 'URW Bookman', 'URW Gothic', 'xos4 Terminus', 'Z003' 
			]),
			'lin2': COMMON_FONTS_LINUX.concat([
				'aakar', 'Abyssinica SIL', 'Ani', 'AnjaliOldLipi', 'AR PL Ukai', 'Chandas', 'Chilanka', 'DejaVu Sans', 'DejaVu Sans Mono', 'DejaVu Serif', 'Dyuthi', 'FreeMono', 'FreeSans', 'FreeSerif', 'Gargi', 'Garuda', 'Gubbi', 'Jamrul', 'KacstBook', 'KacstDecorative', 'KacstDigital', 'KacstFarsi', 'KacstNaskh', 'KacstOffice', 'KacstOne', 'KacstPen', 'KacstPoster', 'KacstQurn', 'KacstScreen', 'Kacstitle', 'Kalapi', 'Kalimati', 'Karumbi', 'Keraleeyam', 'Khmer OS', 'Khmer OS System', 'Kinnari', 'Laksaman', 'Liberations Serif', 'Likhan', 'LKLUG', 'Lohit Assamese', 'Lohit Bengali', 'Lohit Devanagari', 'Lohit Gujarati', 'Logit Gurmukhi', 'Lohit Kannada', 'Lohit Malayalam', 'Lohit Odia', 'Lohit Tamil', 'Lohit Tamil Classical', 'Lohit Telugu', 'Loma', 'Manjari', 'Meera', 'Mitra Mono', 'mry_KacstQurn', 'Mukti Narrow', 'Nakula', 'Navilu', 'Norasi', 'Noto Mono', 'Noto Serif', 'OpenSymbol', 'Padauk', 'padmaa', 'Pagul', 'Phetsarath OT', 'Pothana2000', 'Purisa', 'Rachana' ,'RaghuMalayalamSans', 'Rasa', 'Rekha', 'Saab', 'Sahadeva', 'Samanata', 'Samyak Devanagai', 'Samyak Gujarati', 'Samyak Malayalam', 'Samyak Tamil', 'Sarai', 'Sawasdee', 'Suruma', 'Tibetan Machine Uni', 'TlwgMono', 'TlwgTypewriter', 'Ubuntu', 'Ubuntu Mono', 'Umpush', 'Uroob', 'utkal', 'Vemana2000', 'Waree', 'Yrsa'
			]),
			'lin3': COMMON_FONTS_LINUX.concat([
				'Abyssinica SIL', 'C059', 'Caladea', 'Cantarell', 'Carlito', 'Comfortaa', 'DejaVu Sans', 'DejaVu Sans Mono', 'DejaVu Serif', 'FreeMono', 'FreeSans', 'FreeSerif', 'Jomolhari', 'Khmer OS', 'Khmer OS System', 'Liberations Serif', 'Lohit Assamese', 'Lohit Bengali', 'Lohit Devanagari', 'Lohit Gujarati', 'Lohit Kannada', 'Lohit Odia', 'Lohit Tamil', 'Lohit Telugu', 'Meera', 'Mingzat', 'Montserrat', 'Nimbus Mono', 'Nimbus Roman', 'Nimbus Sans', 'Noto Mono', 'Nuosu SIL', 'OpenSymbol', 'P052', 'Padauk', 'PakType Naskh Basic', 'PT Sans', 'Source Code Pro', 'STIX', 'Symbola', 'URW Bookman', 'URW Gothic', 'Waree', 'Z003'
			]),
			'ios1': COMMON_FONTS_IOS.concat([
			 'Bangla Sangam MN', 'Gujarati Sangam MN', 'Gurmuhki MN', 'Heiti SC', 'Heiti TC', 'Kannada Sangam NM', 'Oriya Sangam MN', 'Telugu Sangam MN'
			]),
			'ios2': COMMON_FONTS_IOS.concat([
			 'Bangla Sangam MN', 'Buddy Build', 'Gujarati Sangam MN', 'Gurmuhki MN', 'Heiti SC', 'Heiti TC', 'Kannada Sangam NM', 'Kohinoor Gujarati', 'Noto Sans Chakma', 'Oriya Sangam MN', 'Telugu Sangam MN'
			]),
			'ios3': COMMON_FONTS_IOS.concat([
				'Apple Symbols', 'Galvji', 'Kohinoor Gujarati', 'Mukta Mahee', 'Noto Sans Myanmar', 'Noto Sans Oriya'
			]),
			'and1': COMMON_FONTS_ANDROID,
			'and2': COMMON_FONTS_ANDROID.concat([
				'Coming Soon'
			]),
			'and3': COMMON_FONTS_ANDROID.concat([
				'Coming Soon'
			]),
			'and4': COMMON_FONTS_ANDROID.concat([
				'Coming Soon'
			])
		};

		let _setAttribute = Element.prototype.setAttribute;
		let _appendChild = Element.prototype.appendChild;
		let selectedFonts = FONTS[CHAMELEON_SPOOF.get(window).fontFingerprintOS].concat(WEB_FONTS).map(f => f.toLowerCase());

		const REGEX_FONT_FAMILY = /font\-family:[^;']*;?/g;

		let getWhitelistFonts = (fontList) => {
			let tmpFonts = fontList
										.replace(/"/g, '')
										.split(',');

			let fonts = [];

			for (let i = 0; i < tmpFonts.length; i++) {
				if (selectedFonts.includes(tmpFonts[i].trim().toLowerCase())) {
					fonts.push(tmpFonts[i]);
				}
			}

    	return (fonts.length ? fonts : DEFAULT_FONT).join(',');
		}

		let modifyCSS = (css) => {
			let matches = css.match(REGEX_FONT_FAMILY);

			if (matches) {
				matches.forEach(m => {
					let fonts = m.replace(/;$/, '').split(':')[1];
					css = css.replace(m, 'font-family: ' + getWhitelistFonts(fonts) + ';');
				});
			}

			return css;
		}

		let modifyFontFamily = (node) => {
			node.style.fontFamily = getWhitelistFonts(node.style.fontFamily);
		}

		let modifyNodeFont = (node) => {
			if (node) {
				if (node.style && node.style.fontFamily != '') {
					modifyFontFamily(node);
				}
			
				node.childNodes.forEach(modifyNodeFont);
			}

			return node;
		}

		// modify CSS2Properties fontFamily
		// In Firefox, the fontFamily property is located here instead of CSSStyleDeclaration
		Object.defineProperty(CSS2Properties.prototype, "fontFamily", {
			set: function fontFamily(f) {
				this["font-family"] = getWhitelistFonts(f);
			}
		});

		// modify CSSStyleDeclaration cssText
		{
			let obj = Object.getOwnPropertyDescriptor(CSSStyleDeclaration.prototype, 'cssText');

			Object.defineProperty(CSSStyleDeclaration.prototype, 'cssText', {
				set(css) {
					obj.set.call(this, modifyCSS(css));
				}
			})
		}

		// replace stylesheet
		function CHAMELEON_SPOOF_f() {
			try {
				for (let i = 0; i < document.styleSheets.length; i++) {
					for (let j = 0; j < document.styleSheets[i].cssRules.length; j++) {
						let font = document.styleSheets[i].cssRules[j].style.fontFamily;
						if (font) document.styleSheets[i].cssRules[j].style.fontFamily = getWhitelistFonts(font);
					}
				}
			} catch (e) {
				// Firefox throws a SecurityError if a stylesheet is being loaded from another domain with CORS
				
				// Attempt again if CSS has not finished loading
				if (e.name === "InvalidAccessError") {
					setTimeout(CHAMELEON_SPOOF_f, 10);
				}
			}
		}

		// modify CSS Stylesheets
		document.addEventListener('DOMContentLoaded', function() {
			CHAMELEON_SPOOF_f();
		}, false);

		// modify Element props
		['innerHTML', 'outerHTML'].forEach(p => {
			let obj = Object.getOwnPropertyDescriptor(Element.prototype, p);

			Object.defineProperty(Element.prototype, p, {
				set(html) {
					obj.set.call(this, html);
					modifyNodeFont(this.parentNode);
				}
			});
		});

		Object.defineProperty(Element.prototype, 'setAttribute', {
			value: function setAttribute(name, value) {
				if (name == 'style') {
					value = modifyCSS(value);
				}

				_setAttribute.call(this, name, value);
			}
		});

		// modify appendChild
		Object.defineProperty(Element.prototype, 'appendChild', {
			value: function appendChild(child) {
				let e = _appendChild.call(this, child);
				if (child.nodeName === 'LINK') CHAMELEON_SPOOF_f();
				return e;
			}
		});
  `,
};
