import { vscode } from "../../utils/vscode"
import styled, { keyframes } from "styled-components"
import { useExtensionState } from "../../context/ExtensionStateContext"
import MissingOrganizationMessage from "./MissingOrganizationMessage"

const spin = keyframes`
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
`

const GoogleButton = styled.button`
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 8px;
	background-color: #000;
	color: #fff;
	font-weight: 500;
	border: 1px solid rgba(255, 255, 255, 0.2);
	border-radius: 8px;
	padding: 12px 24px;
	font-size: 16px;
	width: 280px; 
	height: 50px; 
	cursor: pointer;
	transition:
		background-color 0.3s,
		border-color 0.3s;

	&:hover {
		background-color: rgba(255, 255, 255, 0.1);
		border-color: rgba(255, 255, 255, 0.5);
	}

	svg {
		width: 20px;
		height: 20px;
	}
`

const SpinnerWrapper = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
`

const Spinner = styled.div`
	border: 3px solid rgba(255, 255, 255, 0.3);
	border-top: 3px solid #fff;
	border-radius: 50%;
	width: 20px;
	height: 20px;
	margin-right: 10px;
	animation: ${spin} 1s linear infinite;
`

const Login = () => {
	const { isSignedIn, userErrors, isSignInLoading, setIsSignInLoading } = useExtensionState()

	const handleLogin = () => {
		setIsSignInLoading(true)
		vscode.postMessage({ type: "googleLogin", text: "login" })
	}

	return (
		<div>
			<h1>Welcome to Robodev</h1>

			{!isSignedIn && (
				<div>
					<GoogleButton onClick={handleLogin} disabled={isSignInLoading}>
						{isSignInLoading ? (
							<SpinnerWrapper>
								<Spinner />
								<span>Signing in...</span>
							</SpinnerWrapper>
						) : (
							<>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="800px"
									height="800px"
									viewBox="0 0 32 32"
									data-name="Layer 1"
									id="Layer_1">
									<path
										d="M23.75,16A7.7446,7.7446,0,0,1,8.7177,18.6259L4.2849,22.1721A13.244,13.244,0,0,0,29.25,16"
										fill="#00ac47"
									/>
									<path
										d="M23.75,16a7.7387,7.7387,0,0,1-3.2516,6.2987l4.3824,3.5059A13.2042,13.2042,0,0,0,29.25,16"
										fill="#4285f4"
									/>
									<path
										d="M8.25,16a7.698,7.698,0,0,1,.4677-2.6259L4.2849,9.8279a13.177,13.177,0,0,0,0,12.3442l4.4328-3.5462A7.698,7.698,0,0,1,8.25,16Z"
										fill="#ffba00"
									/>
									<polygon fill="#2ab2db" points="8.718 13.374 8.718 13.374 8.718 13.374 8.718 13.374" />
									<path
										d="M16,8.25a7.699,7.699,0,0,1,4.558,1.4958l4.06-3.7893A13.2152,13.2152,0,0,0,4.2849,9.8279l4.4328,3.5462A7.756,7.756,0,0,1,16,8.25Z"
										fill="#ea4435"
									/>
									<polygon fill="#2ab2db" points="8.718 18.626 8.718 18.626 8.718 18.626 8.718 18.626" />
									<path d="M29.25,15v1L27,19.5H16.5V14H28.25A1,1,0,0,1,29.25,15Z" fill="#4285f4" />
								</svg>
								<span>Continue with Google</span>
							</>
						)}
					</GoogleButton>
					<MissingOrganizationMessage userErrors={userErrors} />
				</div>
			)}
		</div>
	)
}

export default Login
