const express = require("express");
const twilio = require("twilio");

require("dotenv").config();

const app = express();

// Generate a random 6-digit OTP
function generateOTP() {
  const otp = Math.floor(100000 + Math.random() * 900000);
  return otp.toString();
}

app.use(cors());

// API endpoint for sending SMS with OTP
app.get("/api/send-otp", (req, res) => {
  // Get the phone number from the query parameters
  const phoneNumber = req.query.phoneNumber;

  // Generate a 6-digit OTP
  const otp = generateOTP();

  // Create a Twilio client instance
  const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );

  // Compose the message body with the OTP
  const message = `Your OTP is: ${otp} from FinRight`;

  // Send the SMS
  client.messages
    .create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: `+91${phoneNumber}`,
    })
    .then((message) => {
      res.json({
        success: true,
        data: {
          message: "SMS sent successfully",
          otp: otp,
        },
      });
    })
    .catch((error) => {
      console.error("Error sending SMS: ", error);
      res.status(500).json({
        error: {
          message: "Error sending SMS",
          error,
        },
      });
    });
});

// Hello API endpoint
app.get("/api", (req, res) => {
  res.json("Hello");
});

app.listen(process.env.PORT || 3000);
