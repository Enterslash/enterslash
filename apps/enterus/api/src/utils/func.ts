// Destructuring environment variables
// const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_SERVICE_SID_CODE_4, TWILIO_SERVICE_SID_CODE_6, OTP_ENABLE } = process.env;

// import twilio from "twilio";

// twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

// export const sendOtpVia = async (via = "email", to, codeSize = 6) => {
// 	try {
// 		if (OTP_ENABLE !== "true") {
// 			return { accepted: true };
// 		}

// 		const otpSend = await twilio.verify.services(codeSize === 6 ? TWILIO_SERVICE_SID_CODE_6 : TWILIO_SERVICE_SID_CODE_4).verifications.create({ to, channel: via });

// 		if (otpSend.status === "pending") {
// 			return { accepted: true };
// 		} else {
// 			return { accepted: false };
// 		}
// 	} catch (error) {
// 		console.log(error);
// 		return { accepted: false, issue: error.message };
// 	}
// }

// export const verifyOtp = async (to, otp, next, codeSize = 6) => {
// 	try {
// 		if (OTP_ENABLE !== "true") {
// 			return true;
// 		}

// 		const checkedResult = await twilio.verify.services(codeSize === 6 ? TWILIO_SERVICE_SID_CODE_6 : TWILIO_SERVICE_SID_CODE_4).verificationChecks.create({ to, code: otp.toString() });

// 		if (checkedResult && checkedResult.status === "approved") {
// 			return true;
// 		} else {
// 			return false;
// 		}
// 	} catch (error) {
// 		next(error);
// 	}
// }

export const isValidEmail = (email) => {
	const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	const allowChars = /^[0-9a-zA-Z_@.]+$/;
	const validEmail = re.test(email) && allowChars.test(email);
	return validEmail;
}
