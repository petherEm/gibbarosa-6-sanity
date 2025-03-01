import { NextRequest, NextResponse } from "next/server";
import { backendClient } from "@/sanity/lib/backendClient";

// Secure this endpoint in production with proper authentication
export async function POST(req: NextRequest) {
  try {
    // Add proper authentication for production use
    const authHeader = req.headers.get('authorization');
    if (process.env.NODE_ENV === 'production' && 
        (!authHeader || authHeader !== `Bearer ${process.env.ADMIN_API_KEY}`)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const { productId } = await req.json();
    
    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }
    
    // Simply set inStock to true
    const result = await backendClient
      .patch(productId)
      .set({ inStock: true })
      .commit();
    
    return NextResponse.json({
      success: true,
      message: `Product ${productId} is now in stock`,
      product: result
    });
  } catch (error: any) {
    console.error("Error restoring stock:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}