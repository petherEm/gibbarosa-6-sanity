import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // This endpoint doesn't need to do anything server-side
    // The cart is cleared client-side
    // We just return a successful response
    
    return NextResponse.json({ 
      success: true,
      message: "Cart cleared successfully"
    });
  } catch (error: any) {
    console.error("Error in clear-cart API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}