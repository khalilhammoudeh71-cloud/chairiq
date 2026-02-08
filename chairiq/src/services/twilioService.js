import { supabase } from '../lib/supabase';

/**
 * Service for Twilio SMS integration via Supabase Edge Functions
 */
class TwilioService {
  constructor() {
    this.configurationChecked = false;
    this.isConfigured = false;
  }

  /**
   * Check if Twilio is properly configured
   * @returns {Promise<{configured: boolean, message: string}>}
   */
  async checkConfiguration() {
    try {
      const { data, error } = await supabase?.functions?.invoke('send-sms', {
        method: 'GET'
      });

      if (error) {
        console.error('Configuration check failed:', error);
        return {
          configured: false,
          message: 'Unable to check Twilio configuration'
        };
      }

      this.configurationChecked = true;
      this.isConfigured = data?.success || false;

      return {
        configured: this.isConfigured,
        message: data?.message,
        details: data?.details
      };
    } catch (error) {
      console.error('Error checking Twilio configuration:', error);
      return {
        configured: false,
        message: 'Unable to verify SMS service configuration'
      };
    }
  }

  /**
   * Send SMS message to a phone number
   * @param {string} to - Recipient phone number (E.164 format: +1XXXXXXXXXX)
   * @param {string} message - SMS message content
   * @returns {Promise<{success: boolean, messageSid?: string, error?: string, userMessage?: string}>}
   */
  async sendSMS(to, message) {
    try {
      // Validate inputs
      if (!to || !message) {
        return {
          success: false,
          error: 'Phone number and message are required',
          userMessage: 'Please provide both phone number and message'
        };
      }

      // Ensure phone number is in E.164 format
      const formattedPhone = this.formatPhoneNumber(to);

      console.log('Invoking send-sms Edge Function...', { to: formattedPhone });

      // Call Supabase Edge Function
      const { data, error } = await supabase?.functions?.invoke('send-sms', {
        body: {
          to: formattedPhone,
          message: message
        }
      });

      // Handle Edge Function invocation errors
      if (error) {
        console.error('Edge Function invocation error:', {
          message: error?.message,
          context: error?.context,
          details: error
        });

        return {
          success: false,
          error: error?.message || 'Failed to invoke SMS service',
          userMessage: 'Unable to connect to SMS service. Please try again or contact support.',
          errorCode: 'INVOCATION_ERROR'
        };
      }

      // Handle configuration errors (503 status)
      if (data?.error === 'CONFIGURATION_ERROR') {
        console.error('SMS service not configured:', data);
        
        return {
          success: false,
          error: data?.message,
          userMessage: data?.userMessage || 'SMS service is not yet configured. Please contact your administrator.',
          errorCode: 'CONFIGURATION_ERROR',
          adminInstructions: data?.adminInstructions
        };
      }

      // Handle validation errors (400 status)
      if (data?.error === 'VALIDATION_ERROR') {
        console.error('Validation error:', data);
        
        return {
          success: false,
          error: data?.message,
          userMessage: 'Invalid phone number or message format',
          errorCode: 'VALIDATION_ERROR'
        };
      }

      // Handle Twilio API errors
      if (data?.error === 'TWILIO_API_ERROR') {
        console.error('Twilio API error:', data);
        
        return {
          success: false,
          error: data?.details?.twilio_message || data?.message,
          userMessage: data?.message,
          errorCode: 'TWILIO_ERROR',
          twilioCode: data?.details?.twilio_code
        };
      }

      // Handle other errors
      if (!data?.success) {
        console.error('SMS sending failed:', data);
        
        return {
          success: false,
          error: data?.message || 'Failed to send SMS',
          userMessage: data?.message || 'Failed to send SMS. Please try again.',
          errorCode: data?.error || 'UNKNOWN_ERROR'
        };
      }

      // Success
      console.log('SMS sent successfully:', {
        messageSid: data?.messageSid,
        status: data?.status
      });

      return {
        success: true,
        messageSid: data?.messageSid,
        status: data?.status,
        to: data?.to
      };

    } catch (error) {
      console.error('Unexpected error in sendSMS:', {
        message: error?.message,
        stack: error?.stack
      });

      return {
        success: false,
        error: error?.message || 'Unexpected error occurred',
        userMessage: 'An unexpected error occurred. Please try again.',
        errorCode: 'UNEXPECTED_ERROR'
      };
    }
  }

  /**
   * Format phone number to E.164 format
   * @param {string} phone - Phone number in any format
   * @returns {string} - Phone number in E.164 format
   */
  formatPhoneNumber(phone) {
    // Remove all non-digit characters
    let cleaned = phone?.replace(/\D/g, '') || '';

    // If doesn't start with country code, assume US (+1)
    if (!cleaned?.startsWith('1') && cleaned?.length === 10) {
      cleaned = '1' + cleaned;
    }

    // Add + prefix for E.164 format
    return '+' + cleaned;
  }

  /**
   * Send treatment plan SMS to patient
   * @param {string} patientPhone - Patient phone number
   * @param {string} patientFirstName - Patient first name
   * @param {string} practiceName - Practice name
   * @param {string} publicToken - Treatment plan public token
   * @returns {Promise<{success: boolean, messageSid?: string, error?: string, userMessage?: string}>}
   */
  async sendTreatmentPlanSMS(patientPhone, patientFirstName, practiceName, publicToken) {
    try {
      // Generate patient link
      const patientLink = `${window?.location?.origin}/p/${publicToken}`;

      // Generate SMS message
      const message = `Hi ${patientFirstName}! Your treatment plan from ${practiceName} is ready. View it here: ${patientLink}`;

      // Send SMS
      return await this.sendSMS(patientPhone, message);
    } catch (error) {
      console.error('Error sending treatment plan SMS:', error);
      return {
        success: false,
        error: error?.message || 'Failed to send treatment plan SMS',
        userMessage: 'Failed to send treatment plan link. Please try again.'
      };
    }
  }
}

export const twilioService = new TwilioService();

/**
 * Send SMS to patient and store in database
 * @param {string} phoneNumber - Patient phone number
 * @param {string} patientFirstName - Patient first name
 * @param {string} treatmentPlanUrl - Treatment plan URL
 * @param {string} treatmentPlanId - Treatment plan ID
 * @returns {Promise<{success: boolean, data?: object, error?: object, userMessage?: string}>}
 */
export const sendSms = async (phoneNumber, patientFirstName, treatmentPlanUrl, treatmentPlanId) => {
  try {
    // Validate inputs
    if (!phoneNumber || !patientFirstName || !treatmentPlanUrl || !treatmentPlanId) {
      return {
        success: false,
        error: { message: 'All parameters are required' },
        userMessage: 'Missing required information to send SMS'
      };
    }

    // Format phone number
    const formattedPhone = twilioService?.formatPhoneNumber(phoneNumber);

    // Generate SMS message
    const messageContent = `Hi ${patientFirstName}! Your dental treatment plan is ready. View it here: ${treatmentPlanUrl}`;

    console.log('Sending SMS via Twilio service...', {
      to: formattedPhone,
      treatmentPlanId: treatmentPlanId
    });

    // Send SMS via Twilio service
    const smsResult = await twilioService?.sendSMS(formattedPhone, messageContent);

    // Handle SMS sending failure
    if (!smsResult?.success) {
      console.error('SMS sending failed:', smsResult);

      // Store failed SMS in database
      const { error: dbError } = await supabase?.from('sms_messages')?.insert({
        phone_number: formattedPhone,
        message_content: messageContent,
        message_type: 'treatment_plan',
        plan_link_url: treatmentPlanUrl,
        treatment_plan_id: treatmentPlanId,
        delivery_status: 'failed',
        error_message: smsResult?.error || 'Unknown error',
        error_code: smsResult?.errorCode,
        failed_at: new Date()?.toISOString()
      });

      if (dbError) {
        console.error('Error storing failed SMS:', dbError);
      }

      return {
        success: false,
        error: {
          message: smsResult?.error,
          code: smsResult?.errorCode,
          twilioCode: smsResult?.twilioCode
        },
        userMessage: smsResult?.userMessage || 'Failed to send SMS',
        adminInstructions: smsResult?.adminInstructions // Include admin instructions if configuration error
      };
    }

    console.log('SMS sent successfully:', {
      messageSid: smsResult?.messageSid,
      status: smsResult?.status
    });

    // Store successful SMS in database
    const { data: smsRecord, error: dbError } = await supabase?.from('sms_messages')?.insert({
      phone_number: formattedPhone,
      message_content: messageContent,
      message_type: 'treatment_plan',
      plan_link_url: treatmentPlanUrl,
      treatment_plan_id: treatmentPlanId,
      delivery_status: 'sent',
      twilio_message_sid: smsResult?.messageSid,
      sent_at: new Date()?.toISOString()
    })?.select()?.single();

    if (dbError) {
      console.error('Error storing SMS record:', dbError);
      // Still return success since SMS was sent
      return {
        success: true,
        data: {
          messageSid: smsResult?.messageSid,
          status: smsResult?.status
        },
        warning: 'SMS sent but failed to store in database'
      };
    }

    return {
      success: true,
      data: {
        messageSid: smsResult?.messageSid,
        status: smsResult?.status,
        smsRecord: smsRecord
      }
    };

  } catch (error) {
    console.error('Error in sendSms:', error);
    return {
      success: false,
      error: { message: error?.message || 'Failed to send SMS' },
      userMessage: 'An unexpected error occurred while sending SMS'
    };
  }
};

// Fetch SMS delivery status for a treatment plan
export const getSmsDeliveryStatus = async (treatmentPlanId) => {
  try {
    const { data, error } = await supabase
      ?.from('sms_messages')
      ?.select('*')
      ?.eq('treatment_plan_id', treatmentPlanId)
      ?.order('sent_at', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching SMS delivery status:', error);
    return { data: null, error };
  }
};

// Retry failed SMS delivery
export const retrySmsDelivery = async (smsLogId, patientPhone, patientName, treatmentPlanUrl) => {
  try {
    // Get the original SMS log
    const { data: originalLog, error: fetchError } = await supabase
      ?.from('sms_messages')
      ?.select('*')
      ?.eq('id', smsLogId)
      ?.single();

    if (fetchError) throw fetchError;

    // Attempt to send SMS again
    const smsResult = await sendSms(
      patientPhone,
      patientName,
      treatmentPlanUrl,
      originalLog?.treatment_plan_id
    );

    if (!smsResult?.success) {
      throw new Error(smsResult?.error?.message || 'Failed to retry SMS delivery');
    }

    return { 
      success: true, 
      message: 'SMS retry sent successfully',
      data: smsResult?.data 
    };
  } catch (error) {
    console.error('Error retrying SMS delivery:', error);
    return { 
      success: false, 
      error: error?.message || 'Failed to retry SMS delivery' 
    };
  }
};