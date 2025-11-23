module.exports = {
    darkMode: ["class"],
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
    	extend: {
    		colors: {
    			border: 'hsl(var(--border))',
    			input: 'hsl(var(--input))',
    			ring: 'hsl(var(--ring))',
    			background: 'hsl(var(--background))',
    			foreground: 'hsl(var(--foreground))',
    			primary: {
    				DEFAULT: 'hsl(var(--primary))',
    				foreground: 'hsl(var(--primary-foreground))'
    			},
    			secondary: {
    				DEFAULT: 'hsl(var(--secondary))',
    				foreground: 'hsl(var(--secondary-foreground))'
    			},
    			destructive: {
    				DEFAULT: 'hsl(var(--destructive))',
    				foreground: 'hsl(var(--destructive-foreground))'
    			},
    			muted: {
    				DEFAULT: 'hsl(var(--muted))',
    				foreground: 'hsl(var(--muted-foreground))'
    			},
    			accent: {
    				DEFAULT: 'hsl(var(--accent))',
    				foreground: 'hsl(var(--accent-foreground))'
    			},
    			popover: {
    				DEFAULT: 'hsl(var(--popover))',
    				foreground: 'hsl(var(--popover-foreground))'
    			},
    			card: {
    				DEFAULT: 'hsl(var(--card))',
    				foreground: 'hsl(var(--card-foreground))'
    			},
    			sidebar: {
    				DEFAULT: 'hsl(var(--sidebar))',
    				foreground: 'hsl(var(--sidebar-foreground))',
    				primary: 'hsl(var(--sidebar-primary))',
    				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
    				accent: 'hsl(var(--sidebar-accent))',
    				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
    				border: 'hsl(var(--sidebar-border))',
    				ring: 'hsl(var(--sidebar-ring))'
    			},
    			chart: {
    				'1': 'hsl(var(--chart-1))',
    				'2': 'hsl(var(--chart-2))',
    				'3': 'hsl(var(--chart-3))',
    				'4': 'hsl(var(--chart-4))',
    				'5': 'hsl(var(--chart-5))'
    			},
    			// App-specific colors
    			emerald: {
    				'500': '#10b981',
    				'600': '#48bb78',
    				'700': '#16a34a',
    				'400': '#22c55e',
    				'300': '#4ade80',
    			},
    			app: {
    				primary: '#10b981',
    				'primary-dark': '#48bb78',
    				'primary-light': '#22c55e',
    				orange: '#e69500',
    				'orange-dark': '#d48500',
    				purple: '#a32bff',
    				'purple-dark': '#6b0073',
    				'purple-light': '#950aff',
    				cyan: '#0099b0',
    				'cyan-dark': '#007a92',
    				'bg-dark': '#020202',
    				'bg-darker': '#18191a',
    				'bg-light': '#E8E8E8',
    				'bg-lighter': '#E0E0E0',
    				'text-off-white': '#f0f0f0',
    				'text-light-gray': '#d0d0d0',
    				error: '#EF4444',
    			}
    		},
    		borderRadius: {
    			xl: 'calc(var(--radius) + 4px)',
    			lg: 'var(--radius)',
    			md: 'calc(var(--radius) - 2px)',
    			sm: 'calc(var(--radius) - 4px)'
    		},
    		boxShadow: {
    			'in': 'inset 0 1px 2px 0 rgba(0, 0, 0, 0.3)',
    			'out': '0 1px 2px 0 rgba(0, 0, 0, 0.3)'
    		},
    		fontFamily: {
    			sans: [
    				'Inter',
    				'sans-serif'
    			],
    			serif: [
    				'var(--font-serif)'
    			],
    			mono: [
    				'var(--font-mono)'
    			],
    			saira: [
    				'Saira',
    				'sans-serif'
    			],
    			inter: [
    				'Inter',
    				'sans-serif'
    			],
    			vend: [
    				'Vend Sans',
    				'sans-serif'
    			]
    		}
    	}
    },
    plugins: [require("tailwindcss-animate")],
  }