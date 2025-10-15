import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { prisma } from "@/lib/prisma";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { projectId, title, description, tags, price } = await request.json();

    if (!projectId) {
      return NextResponse.json(
        { success: false, error: "Project ID is required" },
        { status: 400 }
      );
    }

    // First, check if we already have cached analysis for this project
    const existingAnalysis = await prisma.analysis.findUnique({
      where: { projectId },
    });

    if (existingAnalysis) {
      return NextResponse.json({
        success: true,
        analysis: existingAnalysis.data,
        projectId,
        cached: true,
        generatedAt: existingAnalysis.updatedAt,
      });
    }

    // If no cached analysis, generate new one using AI
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `
Analyze this startup project for potential investors and return a detailed analysis in JSON format.

Project Details:
- Title: ${title}
- Description: ${description}
- Tags: ${tags?.join(", ") || "None"}
- Price/Valuation: ${price ? `$${price.toLocaleString()}` : "Not specified"}

Please provide a comprehensive investment analysis in this EXACT JSON structure:

{
  "summary": {
    "overallScore": 8.5,
    "investmentRecommendation": "Strong Buy/Buy/Hold/Cautious/Avoid",
    "keyHighlights": ["highlight1", "highlight2", "highlight3"]
  },
  "marketAnalysis": {
    "marketSize": "$X billion",
    "growthRate": "X% annually",
    "marketTrend": "Growing/Stable/Declining",
    "targetAudience": "Description of target market",
    "barriers": ["barrier1", "barrier2"]
  },
  "competitorAnalysis": {
    "directCompetitors": [
      {
        "name": "Competitor Name",
        "marketShare": "X%",
        "strengths": ["strength1", "strength2"],
        "weaknesses": ["weakness1", "weakness2"]
      }
    ],
    "competitiveAdvantage": "What makes this project unique",
    "threats": ["threat1", "threat2"]
  },
  "financialProjection": {
    "revenueProjection": {
      "year1": "$XXX,XXX",
      "year3": "$X,XXX,XXX",
      "year5": "$XX,XXX,XXX"
    },
    "profitabilityTimeline": "Expected to be profitable by Year X",
    "fundingNeeded": "$XXX,XXX to $X,XXX,XXX",
    "useOfFunds": ["use1", "use2", "use3"]
  },
  "riskAssessment": {
    "riskLevel": "Low/Medium/High",
    "majorRisks": [
      {
        "risk": "Risk description",
        "impact": "High/Medium/Low",
        "mitigation": "How to address this risk"
      }
    ]
  },
  "investmentMetrics": {
    "expectedROI": "X%",
    "timeToExit": "X-X years",
    "valuationMultiple": "Xx revenue multiple",
    "comparableDeals": "Recent similar investments"
  },
  "nextSteps": [
    "Immediate action item 1",
    "Follow-up question 2",
    "Due diligence item 3"
  ]
}

Provide realistic, data-driven insights. If specific data isn't available, make reasonable estimates based on industry standards and clearly mark them as estimates.
`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Extract JSON from the response
    let analysisData;
    try {
      // Try to parse the response as JSON
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysisData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      // Fallback response if JSON parsing fails
      analysisData = {
        error: "Analysis generated but couldn't be parsed properly",
        rawResponse: text,
        summary: {
          overallScore: 7.0,
          investmentRecommendation: "Further Analysis Needed",
          keyHighlights: [
            "Promising concept",
            "Market potential exists",
            "Needs more detailed evaluation",
          ],
        },
      };
    }

    // Store the analysis in the database for future use
    try {
      await prisma.analysis.create({
        data: {
          projectId,
          data: analysisData,
        },
      });
    } catch (dbError) {
      console.error("Database error while storing analysis:", dbError);
      // Continue even if database storage fails, return the analysis
    }

    return NextResponse.json({
      success: true,
      analysis: analysisData,
      projectId,
      cached: false,
      generatedAt: new Date(),
    });
  } catch (error) {
    console.error("Analysis generation error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate analysis",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
