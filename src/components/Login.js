import { usePrivy } from '@privy-io/react-auth';

function LoginButton() {
  const { ready, authenticated, login, logout } = usePrivy();
  console.log('Ready:', ready, 'Authenticated:', authenticated);

  // Disable login when Privy is not ready
  const disableButton = !ready;

  return (
    <div>
      <button
        className="login-button"
        disabled={disableButton}
        onClick={authenticated ? logout : login}
      >
        {authenticated ? 'Log Out' : 'Log In'}
      </button>
    </div>
  );
}

export default LoginButton;