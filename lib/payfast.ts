import crypto from 'crypto';

export interface PayFastData {
  merchant_id: string;
  merchant_key: string;
  return_url: string;
  cancel_url: string;
  notify_url: string;
  name_first: string;
  name_last: string;
  email_address: string;
  cell_number?: string;
  m_payment_id: string;
  amount: string;
  item_name: string;
  item_description?: string;
  custom_int1?: string;
  custom_str1?: string;
  email_confirmation?: string;
  confirmation_address?: string;
}

/**
 * Generate PayFast signature for payment data
 * @param data PayFast payment data
 * @param passphrase PayFast passphrase (optional, required for production)
 * @returns MD5 signature
 */
export function generatePayFastSignature(
  data: Partial<PayFastData>,
  passphrase?: string
): string {
  // PayFast signature fields in the order they appear in the documentation
  // Do NOT use alphabetical ordering - PayFast requires documentation order
  const signatureFields = [
    'merchant_id',
    'merchant_key',
    'return_url',
    'cancel_url',
    'notify_url',
    'name_first',
    'name_last',
    'email_address',
    'cell_number',
    'm_payment_id',
    'amount',
    'item_name',
    'item_description',
    'custom_int1',
    'custom_str1',
    'email_confirmation',
    'confirmation_address'
  ];

  // Create parameter string
  let pfOutput = '';
  
  // Build string with only signature fields, in order
  for (const key of signatureFields) {
    const value = data[key as keyof PayFastData];
    if (value !== undefined && value !== '') {
      // URL-encode values as per PayFast requirements
      // Spaces must be encoded as '+', not '%20'
      const encoded = encodeURIComponent(value.toString().trim()).replace(/%20/g, '+');
      pfOutput += `${key}=${encoded}&`;
    }
  }

  // Remove last ampersand
  pfOutput = pfOutput.slice(0, -1);

  // Append passphrase if provided
  if (passphrase) {
    const encodedPassphrase = encodeURIComponent(passphrase.trim()).replace(/%20/g, '+');
    pfOutput += `&passphrase=${encodedPassphrase}`;
  }

  // Debug logging
  console.log('PayFast signature string:', pfOutput);
  
  // Generate MD5 signature
  const signature = crypto.createHash('md5').update(pfOutput).digest('hex');
  console.log('PayFast signature generated:', signature);
  
  return signature;
}

/**
 * Verify PayFast signature from IPN/return
 * @param data Received data from PayFast
 * @param signature Signature to verify
 * @param passphrase PayFast passphrase (optional)
 * @returns True if signature is valid
 */
export function verifyPayFastSignature(
  data: Record<string, string>,
  signature: string,
  passphrase?: string
): boolean {
  const generatedSignature = generatePayFastSignature(data as any, passphrase);
  return generatedSignature === signature;
}

/**
 * Get PayFast configuration from environment
 */
export function getPayFastConfig() {
  const isSandbox = process.env.PAYFAST_SANDBOX === 'true';
  
  return {
    merchantId: process.env.PAYFAST_MERCHANT_ID || '',
    merchantKey: process.env.PAYFAST_MERCHANT_KEY || '',
    passphrase: process.env.PAYFAST_PASSPHRASE || '',
    sandbox: isSandbox,
    host: isSandbox 
      ? 'https://sandbox.payfast.co.za'
      : 'https://www.payfast.co.za',
    processUrl: isSandbox
      ? 'https://sandbox.payfast.co.za/eng/process'
      : 'https://www.payfast.co.za/eng/process'
  };
}

/**
 * Create PayFast payment data
 */
export function createPayFastPayment(params: {
  orderId: string;
  amount: number;
  itemName: string;
  itemDescription?: string;
  firstName: string;
  lastName: string;
  email: string;
  cellNumber?: string;
}): PayFastData {
  const config = getPayFastConfig();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  const paymentData: any = {
    merchant_id: config.merchantId,
    merchant_key: config.merchantKey,
    return_url: `${baseUrl}/payment/success`,
    cancel_url: `${baseUrl}/payment/cancel`,
    notify_url: `${baseUrl}/api/payfast/notify`,
    name_first: params.firstName,
    name_last: params.lastName,
    email_address: params.email,
    m_payment_id: params.orderId,
    amount: params.amount.toFixed(2),
    item_name: params.itemName,
  };

  // Only add optional fields if they have values
  if (params.itemDescription) {
    paymentData.item_description = params.itemDescription;
  }
  
  if (params.cellNumber) {
    paymentData.cell_number = params.cellNumber;
  }

  return paymentData;
}
