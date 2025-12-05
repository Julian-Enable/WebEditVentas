import { NextRequest, NextResponse } from 'next/server';
import { detectBank } from '@/lib/bankDetection';

export async function POST(request: NextRequest) {
    try {
        const { bin } = await request.json();

        if (!bin || bin.length < 6) {
            return NextResponse.json({ bank: null }, { status: 400 });
        }

        // 1. Check Local List (Fastest & Most Reliable for Target Banks)
        const localDetection = detectBank(bin);
        if (localDetection) {
            return NextResponse.json({
                source: 'local',
                bank: localDetection
            });
        }

        // 2. Fallback to Public API (binlist.net)
        // Note: Free tier has rate limits (10 req/min). 
        try {
            const apiResponse = await fetch(`https://lookup.binlist.net/${bin}`, {
                headers: {
                    'Accept-Version': '3'
                },
                signal: AbortSignal.timeout(3000) // 3s timeout
            });

            if (apiResponse.ok) {
                const data = await apiResponse.json();

                // Map external API format to our internal BankInfo format
                // Data sample: { bank: { name: "BANK OF AMERICA" }, scheme: "visa", country: { alpha2: "US" } }
                if (data.bank && data.bank.name) {
                    return NextResponse.json({
                        source: 'api',
                        bank: {
                            bankName: data.bank.name, // Will likely be "BANCOLOMBIA S.A." etc.
                            cardBrand: data.scheme ? (data.scheme.charAt(0).toUpperCase() + data.scheme.slice(1)) : 'Unknown',
                            country: data.country?.alpha2 || 'Unknown'
                        }
                    });
                }
            }
        } catch (apiError) {
            console.warn('External BIN API failed:', apiError);
            // Fail silently and return null -> User enters generic flow
        }

        return NextResponse.json({ bank: null });

    } catch (error) {
        console.error('BIN Lookup Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
