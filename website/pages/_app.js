'use client';

import React, { useState } from 'react';
import Head from 'next/head';

import { PrivyProvider } from '@privy-io/react-auth';

import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';

export const myDarkTheme = createTheme({
    palette: {
        mode: 'dark',
        background: {
            default: '#1B1B1F', // Dark background with a subtle tint
            paper: '#222226', // Slightly lighter for cards and papers
        },
        text: {
            primary: '#E0E0E0', // Light gray for better readability
            secondary: '#B0B0B0', // Muted gray for secondary text
        },
        primary: {
            main: '#FF6EC7', // Vibrant pink for primary accent
        },
        secondary: {
            main: '#FFD700', // Bright gold for secondary accent
        },
        error: {
            main: '#FF4C4C', // Bright red for errors
        },
        success: {
            main: '#4CAF50', // Green for success
        },
        warning: {
            main: '#FF9800', // Orange for warnings
        },
        info: {
            main: '#2196F3', // Blue for informational messages
        },
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontSize: '2.2rem', // Larger size for modern look
            fontWeight: 700,
            color: '#FF6EC7', // Vibrant pink
            marginBottom: '0.5rem',
        },
        h2: {
            fontSize: '1.8rem', // Slightly smaller than h1
            fontWeight: 600,
            color: '#E0E0E0', // Light gray
            marginBottom: '0.5rem',
        },
        body1: {
            fontSize: '1rem',
            color: '#E0E0E0', // Light gray
        },
        body2: {
            fontSize: '0.875rem',
            color: '#B0B0B0', // Muted gray
        },
        button: {
            fontWeight: 600,
        },
        // Define other custom typography as needed
    },
    components: {
        MuiTooltip: {
            styleOverrides: {
                tooltip: {
                    fontSize: '1rem',
                    padding: '10px 15px',
                    backgroundColor: '#333338', // Darker background for tooltips
                },
            },
        },
        MuiLink: {
            styleOverrides: {
                root: {
                    color: '#FFD700', // Bright gold for links
                    textDecoration: 'none', // No underline by default
                    '&:hover': {
                        textDecoration: 'underline', // Underline on hover
                    },
                    '&:focus': {
                        color: '#FF6EC7', // Change color on focus to vibrant pink
                        textDecoration: 'underline', // Underline on focus
                    },
                    '&:active': {
                        color: '#FF6EC7', // Change color when active (clicked)
                    },
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none', // No uppercase transformation
                    borderRadius: '8px', // Rounded corners
                },
                outlined: {
                    borderColor: '#FF6EC7', // Use primary color for outlined buttons
                    color: '#FF6EC7', // Use primary color for text
                    '&:hover': {
                        backgroundColor: 'rgba(255, 110, 199, 0.1)', // Slightly darker on hover
                    },
                },
                contained: {
                    backgroundColor: '#FF6EC7', // Use primary color for contained buttons
                    color: '#1B1B1F', // Dark background for contrast
                    '&:hover': {
                        backgroundColor: '#FF5AB0', // Slightly darker on hover
                    },
                },
                text: {
                    color: '#FF6EC7', // Use primary color for text buttons
                    '&:hover': {
                        backgroundColor: 'rgba(255, 110, 199, 0.1)', // Slightly darker on hover
                    },
                },
            },
        },
        // You can add more component style overrides here
    },
});

function App({ Component, pageProps }) {
    return (
        <>
            <Head>
                <link rel="icon" href="/logo.png" />
                <link rel="icon" type="image/jpg" sizes="32x32" href="/logo.png" />
                <link rel="icon" type="image/jpg" sizes="16x16" href="/logo.png" />
                <link rel="apple-touch-icon" href="/logo.png" />
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />

                <title>Merkle Card</title>

                <meta name="description" content="" />

                <meta property="og:site_name" content="" />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="" />
                <meta property="og:title" content="" />
                <meta property="og:description" content="" />
                <meta property="og:image" content="" />

                <meta name="twitter:card" content="summary_large_image" />
                <meta property="twitter:domain" content="" />
                <meta property="twitter:url" content="" />
                <meta name="twitter:title" content="" />
                <meta name="twitter:description" content="" />
                <meta name="twitter:image" content="" />
                <meta name="twitter:image:alt" content="" />
            </Head>
            <ThemeProvider theme={myDarkTheme}>
                <PrivyProvider
                    appId={process.env.NEXT_PUBLIC_APP_PRIVY_APP_ID}
                    onLogin={(user) => console.log(`User ${user.id} logged in!`)}
                    config={{
                        // Display email and wallet as login methods
                        loginMethods: ['email', 'wallet'],
                        // Customize Privy's appearance in your app
                        appearance: {
                            theme: 'dark',
                            accentColor: '#676FFF',
                            logo: process.env.NEXT_PUBLIC_APP_LOGO_URL,
                        },
                        // Create embedded wallets for users who don't have a wallet
                        embeddedWallets: {
                            createOnLogin: 'users-without-wallets',
                        },
                    }}
                >
                    <Component {...pageProps} />
                </PrivyProvider>
            </ThemeProvider>
        </>
    );
}

export default App;
