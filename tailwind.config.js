module.exports = {
	mode: 'jit',
	purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
	darkMode: true, // or 'media' or 'class'
	theme: {
		extend: {
			fontFamily: {
				cairo: ['Cairo'],
				houseslant: ['House Slant'],
				inter: ['Inter'],
			},
		},
	},
	variants: {
		extend: {},
	},
	plugins: [],
};
