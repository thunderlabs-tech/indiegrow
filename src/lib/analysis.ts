
export type AnalysisResult = {
  analysis: string;
}

export const analysisPrompt = `
Act as a product marketing expert.
You will begiven the contents of an App Store page for an app and an image with the screenshots.
Analyze the app-store presense and answer the following questions:
- What is the app about?
- What are the key features?
- What are the benefits?
- Who is the target group?
- Do the screenshots show the most important features?

Return the result in form of text with simple html markup.
Don't use any other encoding for the result.
`;
