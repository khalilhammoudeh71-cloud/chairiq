// Supabase Edge Function for sending SMS via Twilio
// This function integrates with Twilio API to send SMS messages

// Declare Deno types for environment variables
declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
  serve(handler: (req: Request) => Promise<Response>): void;
};

const TWILIO_ACCOUNT_SID = Deno.env.get('TWILIO_ACCOUNT_SID');
const TWILIO_AUTH_TOKEN = Deno.env.get('TWILIO_AUTH_TOKEN');
const TWILIO_PHONE_NUMBER = Deno.env.get('TWILIO_PHONE_NUMBER');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders
    });
  }

  try {
    // Special endpoint to check configuration status
    if (req.method === 'GET') {
      const configStatus = {
        configured: !!(TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN && TWILIO_PHONE_NUMBER),
        credentials: {
          account_sid: !!TWILIO_ACCOUNT_SID,
          auth_token: !!TWILIO_AUTH_TOKEN,
          phone_number: !!TWILIO_PHONE_NUMBER
        }
      };

      return new Response(JSON.stringify({
        success: configStatus.configured,
        message: configStatus.configured 
          ? 'Twilio credentials are configured' :'Twilio credentials are missing - please configure in Supabase Edge Function secrets',
        details: configStatus
      }), {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }

    // CRITICAL: Check Twilio credentials before processing SMS request
    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
      const missingSecrets = [];
      if (!TWILIO_ACCOUNT_SID) missingSecrets.push('TWILIO_ACCOUNT_SID');
      if (!TWILIO_AUTH_TOKEN) missingSecrets.push('TWILIO_AUTH_TOKEN');
      if (!TWILIO_PHONE_NUMBER) missingSecrets.push('TWILIO_PHONE_NUMBER');

      console.error('CONFIGURATION ERROR: Missing Twilio credentials', {
        missing: missingSecrets,
        timestamp: new Date().toISOString()
      });

      return new Response(JSON.stringify({
        success: false,
        error: 'CONFIGURATION_ERROR',
        message: 'SMS service is not configured. Please contact your administrator.',
        userMessage: 'The SMS service is not yet set up. Please ask your practice administrator to configure Twilio credentials.',
        adminInstructions: {
          step1: 'Go to Supabase Dashboard → Edge Functions → send-sms',
          step2: 'Click on "Secrets" tab',
          step3: 'Add these three secrets with your Twilio account values:',
          required_secrets: [
            'TWILIO_ACCOUNT_SID (from Twilio Console → Account Info)',
            'TWILIO_AUTH_TOKEN (from Twilio Console → Account Info)',
            'TWILIO_PHONE_NUMBER (your Twilio phone number in E.164 format: +1XXXXXXXXXX)'
          ],
          step4: 'Redeploy the Edge Function after adding secrets',
          help_link: 'https://www.twilio.com/docs/usage/secure-credentials'
        },
        missing_secrets: missingSecrets
      }), {
        status: 503, // Service Unavailable - more appropriate than 500
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }

    // Parse and validate request body
    const body = await req.json();
    const { to, message } = body;

    if (!to || !message) {
      console.error('Bad request: Missing required fields', { 
        to_provided: !!to, 
        message_provided: !!message 
      });

      return new Response(JSON.stringify({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Missing required fields',
        details: {
          required: ['to', 'message'],
          provided: {
            to: !!to,
            message: !!message
          }
        }
      }), {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }

    // Validate phone number format
    if (!to.match(/^\+?[1-9]\d{1,14}$/)) {
      console.error('Invalid phone number format', { provided: to });

      return new Response(JSON.stringify({
        success: false,
        error: 'INVALID_PHONE_NUMBER',
        message: 'Phone number must be in E.164 format (e.g., +1234567890)',
        provided: to
      }), {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }

    console.log('Processing SMS request', { 
      to: to,
      message_length: message.length,
      timestamp: new Date().toISOString()
    });

    // Prepare Twilio API request
    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;
    const credentials = btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`);

    const formData = new URLSearchParams({
      To: to,
      From: TWILIO_PHONE_NUMBER,
      Body: message
    });

    // Call Twilio API
    const twilioResponse = await fetch(twilioUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData
    });

    const twilioData = await twilioResponse.json();

    // Handle Twilio API errors
    if (!twilioResponse.ok) {
      console.error('Twilio API error', {
        status: twilioResponse.status,
        error_code: twilioData.code,
        error_message: twilioData.message,
        more_info: twilioData.more_info
      });

      // Map Twilio error codes to user-friendly messages
      let userMessage = 'Failed to send SMS. Please try again.';
      if (twilioData.code === 21211) {
        userMessage = 'Invalid phone number. Please check the number and try again.';
      } else if (twilioData.code === 21408) {
        userMessage = 'SMS service permission error. Please contact support.';
      } else if (twilioData.code === 21606) {
        userMessage = 'The phone number is not verified. Please verify it in Twilio Console.';
      }

      return new Response(JSON.stringify({
        success: false,
        error: 'TWILIO_API_ERROR',
        message: userMessage,
        details: {
          twilio_code: twilioData.code,
          twilio_message: twilioData.message,
          more_info: twilioData.more_info,
          status: twilioResponse.status
        }
      }), {
        status: twilioResponse.status,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }

    // Success response
    console.log('SMS sent successfully', {
      message_sid: twilioData.sid,
      status: twilioData.status,
      to: to,
      timestamp: new Date().toISOString()
    });

    return new Response(JSON.stringify({
      success: true,
      messageSid: twilioData.sid,
      status: twilioData.status,
      dateCreated: twilioData.date_created,
      to: to
    }), {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    // Catch any unexpected errors
    console.error('Unexpected error in send-sms function', {
      error: error.message,
      stack: error.stack,
      name: error.name,
      timestamp: new Date().toISOString()
    });

    return new Response(JSON.stringify({
      success: false,
      error: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred while sending SMS',
      details: {
        error_type: error.name,
        error_message: error.message
      }
    }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  }
});