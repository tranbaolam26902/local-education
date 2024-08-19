/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                'botega-green': 'var(--color-botega-green)',
                'nature-green': 'var(--color-nature-green)',
                'light-green': 'var(--color-light-green)',
                brown: 'var(--color-brown)',
                'nature-yellow': 'var(--color-nature-yellow)',
                'light-yellow': 'var(--color-light-yellow)',
                dark: 'var(--color-dark)',
                typo: 'var(--color-typo)'
            },
            fontFamily: {
                oswald: ['Oswald', 'sans-serif'],
                noto: ['"Noto Sans Display"', 'sans-serif']
            },
            boxShadow: {
                'reverse-sm': '0 -1px 2px 0 rgb(0 0 0 / 0.05)',
                reverse: '0 -1px 3px 0 rgb(0 0 0 / 0.1), 0 -1px 2px -1px rgb(0 0 0 / 0.1)',
                'reverse-md': '0 -4px 6px -1px rgb(0 0 0 / 0.1), 0 -2px 4px -2px rgb(0 0 0 / 0.1)',
                'reverse-lg': '0 -10px 15px -3px rgb(0 0 0 / 0.1), 0 -4px 6px -4px rgb(0 0 0 / 0.1)',
                'reverse-xl': '0 -20px 25px -5px rgb(0 0 0 / 0.1), 0 -8px 10px -6px rgb(0 0 0 / 0.1)',
                'reverse-2xl': '0 -25px 50px -12px rgb(0 0 0 / 0.25)'
            },
            keyframes: {
                float: {
                    '0%': {
                        transform: 'translateY(0px)'
                    },
                    '50%': {
                        transform: 'translateY(-16px)'
                    },
                    '100%': {
                        transform: 'translateY(0px)'
                    }
                },
                'float-left': {
                    '0%': {
                        transform: 'translateX(0px)'
                    },
                    '50%': {
                        transform: 'translateX(-4px)'
                    },
                    '100%': {
                        transform: 'translateX(0px)'
                    }
                },
                'float-right': {
                    '0%': {
                        transform: 'translateX(0px)'
                    },
                    '50%': {
                        transform: 'translateX(4px)'
                    },
                    '100%': {
                        transform: 'translateX(0px)'
                    }
                }
            },
            animation: {
                float: 'float 1.5s ease-in-out infinite',
                'float-left': 'float-left 1s ease-in-out infinite',
                'float-right': 'float-right 1s ease-in-out infinite'
            }
        }
    },
    darkMode: 'class',
    plugins: [require('@tailwindcss/typography')]
};
