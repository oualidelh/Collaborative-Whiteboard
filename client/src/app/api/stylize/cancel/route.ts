import { NextResponse } from "next/server";

export const config = {
  runtime: "edge",
};

/**
 * Endpoint to cancel an ongoing stylization process
 * Note: The actual implementation depends on the underlying AI service's support for cancellation
 */
export async function POST() {
  try {
    // In a production environment, you would implement actual cancellation logic here
    // This might involve:
    // 1. Maintaining a mapping of active jobs in a global store or database
    // 2. Sending a cancellation request to the AI service API
    // 3. Cleaning up any resources associated with the job

    console.log("Received stylization cancellation request");

    // For now, we just return a success response
    return NextResponse.json({
      success: true,
      message: "Stylization cancellation requested",
    });
  } catch (error) {
    console.error("Error cancelling stylization:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
