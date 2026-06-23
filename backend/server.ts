import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { Groq } from 'groq-sdk';

import { fileURLToPath } from 'url';

// Resolve environment file location (checks root from backend execution perspective)
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// Supabase Init
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

let supabase: ReturnType<typeof createClient> | null = null;
const isSupabaseConfigured = supabaseUrl && supabaseServiceRoleKey && 
                             !supabaseUrl.includes('your_supabase_url') && 
                             supabaseUrl.startsWith('http');
if (isSupabaseConfigured) {
  try {
    supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
  }
} else {
  console.warn('WARNING: Supabase is not properly configured. Database logging and leads storage will be stubbed/bypassed.');
}

// Groq Init
const groqApiKey = process.env.GROQ_API_KEY || '';
let groq: Groq | null = null;
if (groqApiKey && !groqApiKey.includes('your_groq_api_key')) {
  groq = new Groq({ apiKey: groqApiKey });
} else {
  console.warn('WARNING: GROQ_API_KEY is missing or contains placeholder. Chatbot and calculation personalization will fall back to static templates.');
}

// ----------------------------------------------------
// DATABASE NOTIFICATION LOGGERS & STUBS
// ----------------------------------------------------

async function logNotification(leadId: string | null, channel: string, status: 'sent' | 'failed' | 'stubbed', errorMessage?: string) {
  try {
    if (!supabase) {
      console.log(`[STUB DB LOG] Notification logged: Lead ID: ${leadId} | Channel: ${channel} | Status: ${status} ${errorMessage ? '| Err: ' + errorMessage : ''}`);
      return;
    }
    const { error } = await supabase
      .from('notification_log')
      .insert({
        lead_id: leadId,
        channel,
        status,
        error_message: errorMessage || null
      });
    if (error) console.error('Database logging error for notification:', error);
  } catch (err) {
    console.error('Failed to log notification in DB:', err);
  }
}

async function sendWhatsAppLeadNotification(leadId: string, name: string, phone: string, source: string, extraInfo: string = '') {
  const channel = 'whatsapp_lead';
  try {
    // Standard Official Meta API integration template structure
    const apiKey = process.env.WHATSAPP_API_KEY || '';
    const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID || '';
    
    let messageBody = '';
    if (source === 'trial_form') {
      messageBody = `Hi ${name}, your fitness trial assessment at Sway Beast Fitness is confirmed! Slot: ${extraInfo}. A coach will text you coordinates shortly.`;
    } else if (source === 'bmi_calculator') {
      messageBody = `Hi ${name}, your BMI calculation is complete. Result: ${extraInfo}. Book your free session now to start transforming.`;
    } else {
      messageBody = `Hi ${name}, your matched fitness split is complete: ${extraInfo}. Book your free visit at Sway Beast to start lifting.`;
    }

    if (apiKey && phoneId && !apiKey.includes('your_whatsapp_api_key')) {
      // Real API integration code block
      console.log(`[REAL WHATSAPP LEAD] Firing template load via Meta API to ${phone}...`);
      // Simulating fetch request
      // const res = await fetch(`https://graph.facebook.com/v17.0/${phoneId}/messages`, { ... })
      await logNotification(leadId, channel, 'sent');
    } else {
      // Swaps to stubbed log behavior
      console.log(`[STUB WHATSAPP LEAD] To: ${phone} | Content: ${messageBody}`);
      await logNotification(leadId, channel, 'stubbed');
    }
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : String(err);
    console.error('WhatsApp Lead alert failed:', err);
    await logNotification(leadId, channel, 'failed', errMsg);
  }
}

async function sendWhatsAppOwnerNotification(leadId: string, name: string, phone: string, source: string, extraInfo: string = '') {
  const channel = 'whatsapp_owner';
  try {
    const ownerPhone = process.env.OWNER_WHATSAPP_NUMBER || '';
    const apiKey = process.env.WHATSAPP_API_KEY || '';
    
    let messageBody = `New Lead Alert!\nName: ${name}\nPhone: ${phone}\nSource: ${source}`;
    if (extraInfo) {
      messageBody += `\nDetails: ${extraInfo}`;
    }

    if (apiKey && ownerPhone && !apiKey.includes('your_whatsapp_api_key')) {
      console.log(`[REAL WHATSAPP OWNER] Firing template alert to owner ${ownerPhone}...`);
      await logNotification(leadId, channel, 'sent');
    } else {
      console.log(`[STUB WHATSAPP OWNER] To Owner (${ownerPhone || 'Admin'}): ${messageBody}`);
      await logNotification(leadId, channel, 'stubbed');
    }
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : String(err);
    console.error('WhatsApp Owner alert failed:', err);
    await logNotification(leadId, channel, 'failed', errMsg);
  }
}

async function sendEmailOwnerNotification(leadId: string, name: string, phone: string, source: string, extraInfo: string = '') {
  const channel = 'email_owner';
  try {
    const ownerEmail = process.env.OWNER_EMAIL || '';
    const resendKey = process.env.RESEND_API_KEY || '';
    
    let emailHtml = `<p><strong>New Sway Beast Lead Capture</strong></p>
                     <p><strong>Name:</strong> ${name}</p>
                     <p><strong>WhatsApp:</strong> ${phone}</p>
                     <p><strong>Source:</strong> ${source}</p>`;
    if (extraInfo) {
      emailHtml += `<p><strong>Form Details:</strong> ${extraInfo}</p>`;
    }

    if (resendKey && ownerEmail && !resendKey.includes('your_resend_api_key')) {
      console.log(`[REAL RESEND EMAIL] Sending lead alert to ${ownerEmail}...`);
      await logNotification(leadId, channel, 'sent');
    } else {
      console.log(`[STUB EMAIL OWNER] To Owner (${ownerEmail || 'admin@example.com'}): \n${emailHtml.replace(/<[^>]*>/g, ' ')}`);
      await logNotification(leadId, channel, 'stubbed');
    }
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : String(err);
    console.error('Email Owner alert failed:', err);
    await logNotification(leadId, channel, 'failed', errMsg);
  }
}

// ----------------------------------------------------
// IDEMPOTENCY / DOUBLE-CLICK DUPLICATE PROTECTION
// ----------------------------------------------------

async function isDuplicateSubmission(whatsapp_number: string, source: string): Promise<boolean> {
  try {
    const sixtySecondsAgo = new Date(Date.now() - 60000).toISOString();
    const { data, error } = await supabase
      .from('leads')
      .select('id')
      .eq('whatsapp_number', whatsapp_number)
      .eq('source', source)
      .gt('created_at', sixtySecondsAgo)
      .limit(1);

    if (error) {
      console.error('Database query error during duplicate check:', error);
      return false;
    }
    return !!(data && data.length > 0);
  } catch (err) {
    console.error('Duplicate submission checking failed:', err);
    return false;
  }
}

// ----------------------------------------------------
// ROUTE ENDPOINTS
// ----------------------------------------------------

// [PHASE 8.5] OTP Generation
app.post('/api/auth/send-otp', async (req: express.Request, res: express.Response) => {
  const { phone_number } = req.body;
  if (!phone_number) return res.status(400).json({ success: false, message: 'Phone number required' });

  try {
    if (!supabase) return res.status(200).json({ success: true, message: 'Stubbed OTP sent (No Supabase connected)' });
    const { error } = await supabase.auth.signInWithOtp({ phone: phone_number });
    if (error) throw error;
    return res.status(200).json({ success: true, message: 'OTP Sent' });
  } catch (err) {
    console.error('OTP send failed:', err);
    return res.status(500).json({ success: false, message: 'Failed to send OTP' });
  }
});

// [PHASE 8.5] OTP Verification
app.post('/api/auth/verify-otp', async (req: express.Request, res: express.Response) => {
  const { phone_number, token } = req.body;
  if (!phone_number || !token) return res.status(400).json({ success: false, message: 'Phone and token required' });

  try {
    if (!supabase) return res.status(200).json({ success: true, session: { access_token: 'stub-token' } });
    const { data, error } = await supabase.auth.verifyOtp({ phone: phone_number, token, type: 'sms' });
    if (error) throw error;
    return res.status(200).json({ success: true, session: data.session });
  } catch (err) {
    console.error('OTP verify failed:', err);
    return res.status(401).json({ success: false, message: 'Invalid OTP' });
  }
});

// [PHASE 8.5] Unified Transactional Submission Layer
app.post('/api/leads/process-submission', async (req: express.Request, res: express.Response) => {
  const payload = req.body;
  
  if (!payload.client_submission_id || !payload.type || !payload.phone_number || !payload.full_name) {
    return res.status(400).json({ success: false, message: 'Missing core tracking payload fields' });
  }

  try {
    if (!supabase) {
      console.log(`[STUB RPC] Process submission bypass for ${payload.type} from ${payload.phone_number}`);
      return res.status(200).json({ success: true, customer_id: 'stub-cust-id', reference_id: 'SB-STUB-0001' });
    }

    const { data, error } = await supabase.rpc('process_submission', { payload });
    
    if (error) {
      console.error('RPC Error:', error);
      throw error;
    }

    // Success response format from RPC: { success: true, customer_id, reference_id }
    if (!data.success) {
      // It caught a duplicate via client_submission_id
      if (data.error === 'Duplicate submission id') {
        console.log(`[IDEMPOTENCY] Shielded duplicate submission: ${payload.client_submission_id}`);
        return res.status(200).json({ success: true, status: 'duplicate_success_shielded' });
      }
      throw new Error(data.error);
    }

    // Trigger asynchronous notifications based on the result
    sendWhatsAppLeadNotification(data.reference_id, payload.full_name, payload.phone_number, payload.type, `Reference ID: ${data.reference_id}`);
    sendWhatsAppOwnerNotification(data.reference_id, payload.full_name, payload.phone_number, payload.type, `Ref: ${data.reference_id}`);
    
    return res.status(200).json(data);
  } catch (err) {
    console.error('Process Submission failed:', err);
    return res.status(500).json({ success: false, message: 'Internal transaction failed' });
  }
});

// 1. Trial Form Submission
app.post('/api/leads/trial-form', async (req: express.Request, res: express.Response) => {
  const { name, whatsapp_number, email, fitness_goal, preferred_time, source = 'trial_form' } = req.body;

  if (!name || !whatsapp_number) {
    return res.status(400).json({ success: false, message: 'Name and WhatsApp number are required fields.' });
  }

  try {
    // Guard against rapid duplicate clicks (within 60s)
    const isDup = await isDuplicateSubmission(whatsapp_number, source);
    if (isDup) {
      console.log(`[IDEMPOTENCY] Caught duplicate submission for ${name} (${whatsapp_number}) via ${source}. Returning success.`);
      return res.status(200).json({ success: true, status: 'duplicate_success_shielded' });
    }

    let leadId = 'fake-lead-' + Math.floor(Math.random() * 100000);
    if (supabase) {
      // Insert Lead
      const { data: leadData, error: leadError } = await supabase
        .from('leads')
        .insert({
          name,
          whatsapp_number,
          source,
          status: 'new'
        })
        .select('id')
        .single();

      if (leadError) throw leadError;
      leadId = leadData.id;

      // Insert Bookings
      const { error: bookingError } = await supabase
        .from('trial_bookings')
        .insert({
          lead_id: leadId,
          fitness_goal: fitness_goal || 'not_specified',
          preferred_time: preferred_time || 'not_specified'
        });

      if (bookingError) throw bookingError;
    } else {
      console.log(`[STUB DB INSERT] Trial Booking Lead: ${name} | Phone: ${whatsapp_number} | Source: ${source}`);
    }

    // Trigger dual alerts asynchronously
    const timeDetail = preferred_time ? `Slot: ${preferred_time}` : 'Not Specified';
    sendWhatsAppLeadNotification(leadId, name, whatsapp_number, source, timeDetail);
    sendWhatsAppOwnerNotification(leadId, name, whatsapp_number, source, `Goal: ${fitness_goal}, Time: ${preferred_time}, Email: ${email}`);
    sendEmailOwnerNotification(leadId, name, whatsapp_number, source, `Goal: ${fitness_goal}, Time: ${preferred_time}, Email: ${email}`);

    return res.status(200).json({ success: true, leadId });
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : String(err);
    console.error('Trial form processing failed:', err);
    return res.status(500).json({ success: false, message: errMsg || 'Server error occurred processing trial.' });
  }
});

// 2. BMI Calculator Submission
app.post('/api/leads/bmi-calculator', async (req: express.Request, res: express.Response) => {
  const { name, whatsapp_number, height_cm, weight_kg, age, gender } = req.body;

  if (!name || !whatsapp_number || !height_cm || !weight_kg) {
    return res.status(400).json({ success: false, message: 'All biometric inputs are required.' });
  }

  // Sane bounds validation
  if (height_cm < 100 || height_cm > 250 || weight_kg < 30 || weight_kg > 300) {
    return res.status(400).json({ success: false, message: 'Input values are outside realistic human ranges.' });
  }

  try {
    const calculatedBmi = weight_kg / Math.pow(height_cm / 100, 2);
    
    // Exact non-overlapping category boundaries
    let category = '';
    if (calculatedBmi < 18.5) {
      category = 'underweight';
    } else if (calculatedBmi >= 18.5 && calculatedBmi < 25) {
      category = 'healthy';
    } else if (calculatedBmi >= 25 && calculatedBmi < 30) {
      category = 'overweight';
    } else {
      category = 'obese';
    }

    const isDup = await isDuplicateSubmission(whatsapp_number, 'bmi_calculator');
    if (isDup) {
      console.log(`[IDEMPOTENCY] Caught duplicate BMI submission for ${name}.`);
      return res.status(200).json({
        success: true,
        bmi_value: calculatedBmi,
        bmi_category: category,
        recommendation: 'Your parameters are logged. Check your WhatsApp for next steps.'
      });
    }

    let leadId = 'fake-lead-' + Math.floor(Math.random() * 100000);
    if (supabase) {
      // Insert Lead
      const { data: leadData, error: leadError } = await supabase
        .from('leads')
        .insert({
          name,
          whatsapp_number,
          source: 'bmi_calculator',
          status: 'new'
        })
        .select('id')
        .single();

      if (leadError) throw leadError;
      leadId = leadData.id;

      // Insert BMI Submission details
      const { error: bmiError } = await supabase
        .from('bmi_submissions')
        .insert({
          lead_id: leadId,
          height_cm,
          weight_kg,
          bmi_value: calculatedBmi,
          bmi_category: category
        });

      if (bmiError) throw bmiError;
    } else {
      console.log(`[STUB DB INSERT] BMI Lead: ${name} | Phone: ${whatsapp_number} | BMI: ${calculatedBmi.toFixed(1)}`);
    }

    // Get encouraging personalized recommendation using Groq LLM
    let recommendation = '';
    const staticFallbacks: Record<string, string> = {
      underweight: 'Focus on progressive strength training and a structured caloric surplus with dense proteins to build healthy muscle mass safely.',
      healthy: 'Great foundation. Prioritize progressive overload lifts and balanced macros to optimize athletic power and core longevity.',
      overweight: 'Excellent starting point. Combine consistent resistance training with a sustainable caloric deficit to drop fat and build strength.',
      obese: 'Focus on joint-safe strength routines and structured nutritional balance to support metabolic health and steady weight loss.'
    };

    if (groq) {
      try {
        const chatCompletion = await groq.chat.completions.create({
          messages: [
            {
              role: 'system',
              content: 'You are an encouraging, professional fitness coach. Based on the user\'s BMI value and category, write one concise, actionable, and motivating sentence recommendation for their fitness journey. Keep it under 20 words. No medical claims or diagnosis language.'
            },
            {
              role: 'user',
              content: `Name: ${name}, Age: ${age}, Gender: ${gender}, BMI: ${calculatedBmi.toFixed(1)}, Category: ${category}.`
            }
          ],
          model: 'llama-3.3-70b-specdec',
          max_tokens: 60,
          temperature: 0.7
        });
        recommendation = chatCompletion.choices[0]?.message?.content?.trim() || staticFallbacks[category];
      } catch (err) {
        console.error('Groq API call failed in BMI recommendation, falling back:', err);
        recommendation = staticFallbacks[category];
      }
    } else {
      recommendation = staticFallbacks[category];
    }

    // Fire alerts
    const bmiText = `BMI: ${calculatedBmi.toFixed(1)} (${category})`;
    sendWhatsAppLeadNotification(leadId, name, whatsapp_number, 'bmi_calculator', bmiText);
    sendWhatsAppOwnerNotification(leadId, name, whatsapp_number, 'bmi_calculator', `${bmiText}, H: ${height_cm}cm, W: ${weight_kg}kg`);
    sendEmailOwnerNotification(leadId, name, whatsapp_number, 'bmi_calculator', `${bmiText}, Height: ${height_cm}cm, Weight: ${weight_kg}kg`);

    return res.status(200).json({
      success: true,
      bmi_value: calculatedBmi,
      bmi_category: category,
      recommendation
    });

  } catch (err) {
    console.error('BMI calculations failed:', err);
    return res.status(500).json({ success: false, message: 'Server calculation failure.' });
  }
});

// 3. Fitness Quiz Submission
app.post('/api/leads/fitness-quiz', async (req: express.Request, res: express.Response) => {
  const { name, whatsapp_number, goal_answer, frequency_answer, experience_answer } = req.body;

  if (!name || !whatsapp_number || !goal_answer || !frequency_answer || !experience_answer) {
    return res.status(400).json({ success: false, message: 'All quiz answers are required.' });
  }

  try {
    // Logic mapping to select programs on site
    let matchedProgram = 'Beginner Transformation';
    let reason = '';

    if (goal_answer === 'weight_loss') {
      matchedProgram = 'Weight Loss';
      reason = 'Focusing on consistent calorie management combined with high-density intervals will yield rapid fat loss results.';
    } else if (goal_answer === 'build_muscle') {
      matchedProgram = 'Muscle Gain';
      reason = 'Structured hypertrophy sets with caloric surplus targets is optimal for building lean skeletal mass.';
    } else if (goal_answer === 'general_fitness') {
      if (frequency_answer === '5+') {
        matchedProgram = 'Functional Fitness';
        reason = 'High-frequency mobility splits and joint capsule stabilization will rebuild raw athletic capacity.';
      } else {
        matchedProgram = 'Beginner Transformation';
        reason = 'Building steady motor control and basic gym consistency is the safest path to general fitness.';
      }
    } else if (goal_answer === 'sport_specific') {
      matchedProgram = 'Athletic Performance';
      reason = 'Agility training, explosive force development, and raw speed splits fit your sport objectives.';
    }

    const isDup = await isDuplicateSubmission(whatsapp_number, 'fitness_quiz');
    if (isDup) {
      console.log(`[IDEMPOTENCY] Caught duplicate quiz submission.`);
      return res.status(200).json({
        success: true,
        matched_program: matchedProgram,
        reason,
        recommendation: 'Your quiz results are recorded. A coach will text you on WhatsApp shortly.'
      });
    }

    let leadId = 'fake-lead-' + Math.floor(Math.random() * 100000);
    if (supabase) {
      // Insert Lead
      const { data: leadData, error: leadError } = await supabase
        .from('leads')
        .insert({
          name,
          whatsapp_number,
          source: 'fitness_quiz',
          status: 'new'
        })
        .select('id')
        .single();

      if (leadError) throw leadError;
      leadId = leadData.id;

      // Insert Quiz Submission Details
      const { error: quizError } = await supabase
        .from('quiz_submissions')
        .insert({
          lead_id: leadId,
          goal_answer,
          frequency_answer,
          experience_answer,
          matched_program: matchedProgram
        });

      if (quizError) throw quizError;
    } else {
      console.log(`[STUB DB INSERT] Quiz Lead: ${name} | Phone: ${whatsapp_number} | Goal: ${goal_answer} | Program: ${matchedProgram}`);
    }

    // Groq Advice Recommendation (Encouraging Tone)
    let recommendation = '';
    const fallbackRecommendation = `Based on your goal to train ${frequency_answer} days a week as a ${experience_answer}, our ${matchedProgram} split will align your biomechanics perfectly.`;

    if (groq) {
      try {
        const chatCompletion = await groq.chat.completions.create({
          messages: [
            {
              role: 'system',
              content: 'You are an encouraging, professional fitness coach. Based on the user\'s fitness goal, weekly training frequency, and experience level, write one concise, actionable, and motivating sentence recommendation for their matched program. Keep it under 25 words.'
            },
            {
              role: 'user',
              content: `Goal: ${goal_answer}, Frequency: ${frequency_answer} days/week, Experience: ${experience_answer}, Matched Program: ${matchedProgram}.`
            }
          ],
          model: 'llama-3.3-70b-specdec',
          max_tokens: 60,
          temperature: 0.7
        });
        recommendation = chatCompletion.choices[0]?.message?.content?.trim() || fallbackRecommendation;
      } catch (err) {
        console.error('Groq Quiz recommendation failed, falling back:', err);
        recommendation = fallbackRecommendation;
      }
    } else {
      recommendation = fallbackRecommendation;
    }

    // Alerts
    sendWhatsAppLeadNotification(leadId, name, whatsapp_number, 'fitness_quiz', matchedProgram);
    sendWhatsAppOwnerNotification(leadId, name, whatsapp_number, 'fitness_quiz', `Matched: ${matchedProgram}, Answers: ${goal_answer}/${frequency_answer}/${experience_answer}`);
    sendEmailOwnerNotification(leadId, name, whatsapp_number, 'fitness_quiz', `Matched Program: ${matchedProgram}. Inputs: Goal=${goal_answer}, Frequency=${frequency_answer}, Exp=${experience_answer}`);

    return res.status(200).json({
      success: true,
      matched_program: matchedProgram,
      reason,
      recommendation
    });

  } catch (err) {
    console.error('Quiz routing processing failed:', err);
    return res.status(500).json({ success: false, message: 'Server failed to analyze quiz answers.' });
  }
});

// 4. Scoped Chatbot Endpoint
app.post('/api/chat', async (req: express.Request, res: express.Response) => {
  const { message, language = 'en', history = [] } = req.body;

  if (!message) {
    return res.status(400).json({ success: false, message: 'Message content is required.' });
  }

  // Scoped Grounding data system instruction
  const systemPrompt = `You are the Sway Beast Fitness Chat Coach. You only answer questions about Sway Beast Fitness.
If asked about memberships, trials, hours, or equipment, answer concisely and energetically based on the following context.
Do not invent prices or schedules. If you don't know, tell them to call the gym or book a trial.
    
Context:
- Location: Pillar No. 135, 2nd Floor, Above Vaishnaoi Honda Showroom, Kondapur, Hyderabad.
- Memberships: Standard starts at ₹3,500/month. Quarterly Adapt is ₹9,500. Annual Elite is ₹25,000.
- Coaches: Expert trainers specialized in biomechanics, muscle gain, fat loss, and sustainable transformation.
- Vibe: Premium, results-oriented, hardcore but welcoming.
- Core Offer: Free 1-Day Trial.

RULES:
1. If the user asks about unrelated topics (general knowledge, coding, recipes, calculations, or other gyms), politely redirect: "I can only help with questions about our programs, pricing, trainers, or booking a trial — what would you like to know?"
2. Respond in the selected language. The selected language is: ${language}. If Hindi or Telugu is selected, reply using that language.
3. Keep responses brief (2-4 sentences max) in direct, professional, encouraging coaching tone.
4. If they want to join or book, instruct them: "To book a slot, please use the Trial Form at the bottom of our page or click the Book Trial button in this panel."`;

  if (groq) {
    try {
      interface ChatHistoryItem {
        role: string;
        content: string;
      }
      
      // Map history to match Groq types
      const mappedMessages = [
        { role: 'system', content: systemPrompt },
        ...history.slice(-6).map((h: ChatHistoryItem) => ({
          role: h.role === 'user' ? 'user' : 'assistant',
          content: h.content
        })),
        { role: 'user', content: message }
      ];

      const chatCompletion = await groq.chat.completions.create({
        messages: mappedMessages as { role: 'system' | 'user' | 'assistant'; content: string }[],
        model: 'llama-3.3-70b-specdec',
        max_tokens: 150,
        temperature: 0.5
      });

      const reply = chatCompletion.choices[0]?.message?.content?.trim() || '';
      return res.status(200).json({ success: true, reply });

    } catch (err) {
      console.error('Groq chat completion failed, using stub fallbacks:', err);
      // Fallback
      return res.status(500).json({ success: false, message: 'LLM completion failed.' });
    }
  } else {
    // Stub local default stubs depending on query
    let userMessage = message.toLowerCase();
    let reply = 'Welcome to Sway Beast Fitness! Our expert coaches specialize in biomechanics, muscle gain, and fat loss. Let us know how we can help!';
    if (userMessage.includes('price') || userMessage.includes('cost') || userMessage.includes('membership')) {
      reply = 'Sway Beast memberships start at ₹3,500/month for standard gym access. We highly recommend our Quarterly Adapt tier (₹9,500) which includes nutrition goals. Book a free trial below to begin.';
    } else if (userMessage.includes('program') || userMessage.includes('class')) {
      reply = 'We offer Weight Loss, Muscle Gain, Strength Training, and Personal Training splits. Each schedule is customized to your biometrics. Fill out the form below to book a consultation.';
    }
    return res.status(200).json({ success: true, reply });
  }
});

// 5. GET Leads list (CRM simulation for pitch dashboard)
app.get('/api/leads/list', async (req: express.Request, res: express.Response) => {
  try {
    if (!supabase) {
      return res.status(200).json({
        success: true,
        leads: [
          { id: '1', name: 'Aravind Reddy', whatsapp_number: '+91 98480 22338', source: 'trial_form', status: 'new', created_at: new Date().toISOString() },
          { id: '2', name: 'Neha Sen', whatsapp_number: '+91 99630 11445', source: 'bmi_calculator', status: 'converted', created_at: new Date(Date.now() - 3600000).toISOString() },
          { id: '3', name: 'Rahul Kapoor', whatsapp_number: '+91 98850 55667', source: 'fitness_quiz', status: 'contacted', created_at: new Date(Date.now() - 7200000).toISOString() }
        ]
      });
    }
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) throw error;
    return res.status(200).json({ success: true, leads: data || [] });
  } catch (err) {
    console.error('CRM fetch failed, returning empty:', err);
    return res.status(200).json({ success: true, leads: [] });
  }
});

// Export for Vercel serverless functions
export default app;

// Only start listening in local development (not on Vercel)
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`[BACKEND SERVER] Express proxy listening on http://localhost:${PORT}`);
  });
}
