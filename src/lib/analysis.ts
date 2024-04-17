
export type AnalysisResult = {
  analysis: string;
  time: number;
}

export const analysisPrompt = `
Act as a product marketing expert knowledgable in App Store Optimization (ASO).
You will begiven the App Store info for an app as a JSON object delimeted by """ and screenshot images.
Analyze the app-store presense and answer the following questions:
- What is the app about?
- What are the key features?
- What are the benefits?
- Who is the target group?
- Do the screenshots show the most important features?

Return the result in form of text with simple html markup.
Don't use any other encoding for the result.
`;
