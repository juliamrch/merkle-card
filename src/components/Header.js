import React from 'react'
import { usePrivy } from "@privy-io/react-auth";

function Header({ authenticated, onLogin, onLogout }) {
    const { ready, user, login, logout } = usePrivy();

    // Wait until the Privy client is ready before taking any actions
    if (!ready) {
        return null;
    }

    const handleLogin = async () => {
        await login();
        onLogin(user);
    };

    const handleLogout = async () => {
        await logout();
        onLogout();
    };

    return (
        <div className="App">
            <header className="App-header">
                {/* If the user is not authenticated, show a login button */}
                {/* If the user is authenticated, show the app and logout button */}
                {ready && authenticated ? (
                <div>
                    <textarea
                    readOnly
                    value={JSON.stringify(user, null, 2)}
                    style={{ width: "600px", height: "250px", borderRadius: "6px" }}
                    />
                    <br />
                    <button onClick={handleLogout} style={{ marginTop: "20px", padding: "12px", backgroundColor: "#069478", color: "#FFF", border: "none", borderRadius: "6px" }}>
                    Log Out
                    </button>
                </div>
                ) : (
                    <button onClick={handleLogin} style={{padding: "12px", backgroundColor: "#069478", color: "#FFF", border: "none", borderRadius: "6px" }}>Log In</button>
                )}
            </header>
        </div>
    );
}

export default Header;