import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY || "re_123456789"); // Fallback to prevent build crash

export async function POST(request: Request) {
    try {
        const { photo } = await request.json();

        if (!photo) {
            return NextResponse.json(
                { error: 'No photo provided' },
                { status: 400 }
            );
        }

        // Convert base64 to buffer
        const base64Data = photo.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');

        // Send email with Resend
        const { data, error } = await resend.emails.send({
            from: 'Valentine Proposal <onboarding@resend.dev>', // Will be from Resend's domain
            to: ['donaldfoxit@gmail.com'],
            subject: 'She Said YES! 💕',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(to bottom, #ffe5e5, #ffffff); border-radius: 10px;">
                    <h1 style="color: #e11d48; text-align: center; font-size: 32px; margin-bottom: 10px;">
                        💕 She Said YES! 💕
                    </h1>
                    <p style="text-align: center; color: #666; font-size: 16px; margin-bottom: 30px;">
                        Your valentine proposal was accepted with a kiss!
                    </p>
                    <div style="text-align: center; margin: 30px 0;">
                        <p style="font-size: 48px; margin: 0;">💋</p>
                    </div>
                    <p style="text-align: center; color: #999; font-size: 14px; margin-top: 40px;">
                        Sent from your Valentine Proposal Website<br>
                        ${new Date().toLocaleString('en-US', {
                dateStyle: 'full',
                timeStyle: 'short'
            })}
                    </p>
                </div>
            `,
            attachments: [
                {
                    filename: 'kiss-from-sleepyhead.jpg',
                    content: buffer,
                },
            ],
        });

        if (error) {
            console.error('Resend error:', JSON.stringify(error, null, 2));
            return NextResponse.json(
                { error: 'Failed to send email', details: error },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error('API error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
