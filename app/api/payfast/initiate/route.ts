import { NextRequest, NextResponse } from 'next/server';
import { createPayFastPayment, generatePayFastSignature, getPayFastConfig } from '@/lib/payfast';

export const dynamic = 'force-dynamic';

interface InitiatePaymentRequest {
  orderId: string;
  amount: number;
  itemName: string;
  itemDescription?: string;
  firstName: string;
  lastName: string;
  email: string;
  cellNumber?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: InitiatePaymentRequest = await request.json();

    console.log('Initiating PayFast payment:', {
      orderId: body.orderId,
      amount: body.amount,
      email: body.email
    });

    // Check if PayFast credentials are configured
    const config = getPayFastConfig();
    if (!config.merchantId || !config.merchantKey) {
      console.error('PayFast credentials missing!');
      return NextResponse.json(
        {
          success: false,
          error: 'PayFast not configured',
          details: 'PAYFAST_MERCHANT_ID and PAYFAST_MERCHANT_KEY must be set in .env.local'
        },
        { status: 500 }
      );
    }

    console.log('PayFast config:', {
      merchantId: config.merchantId,
      hasMerchantKey: !!config.merchantKey,
      hasPassphrase: !!config.passphrase,
      sandbox: config.sandbox
    });

    // Create payment data
    const paymentData = createPayFastPayment({
      orderId: body.orderId,
      amount: body.amount,
      itemName: body.itemName,
      itemDescription: body.itemDescription,
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      cellNumber: body.cellNumber
    });

    // Generate signature
    const signature = generatePayFastSignature(paymentData, config.passphrase);

    console.log('PayFast payment data created:', {
      merchant_id: paymentData.merchant_id,
      amount: paymentData.amount,
      m_payment_id: paymentData.m_payment_id,
      sandbox: config.sandbox
    });

    return NextResponse.json({
      success: true,
      paymentData,
      signature,
      processUrl: config.processUrl
    });

  } catch (error: any) {
    console.error('PayFast initiation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to initiate payment',
        details: error.message
      },
      { status: 500 }
    );
  }
}
