import { GoogleLogin } from "react-google-login";

const GoogleLoginButton = () => {
    const handleSuccess = (response) => {
        console.log(response);
        // Send token to the backend for verification
    };

    const handleFailure = (response) => {
        console.error(response);
    };

    return (
        <GoogleLogin
            clientId="YOUR_GOOGLE_CLIENT_ID"
            buttonText="Login with Google"
            onSuccess={handleSuccess}
            onFailure={handleFailure}
            cookiePolicy="single_host_origin"
        />
    );
};

export default GoogleLoginButton;
