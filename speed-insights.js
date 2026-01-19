/**
 * Speed Insights Initialization
 * 
 * This module initializes Vercel Speed Insights for the Resume Builder application.
 * Speed Insights tracks web performance metrics including Core Web Vitals.
 * 
 * See: https://vercel.com/docs/speed-insights
 */

// Only initialize if running on client-side (not SSR)
if (typeof window !== 'undefined') {
  // Dynamic import to avoid blocking page load
  import('@vercel/speed-insights').then(({ injectSpeedInsights }) => {
    try {
      injectSpeedInsights();
    } catch (error) {
      // Gracefully handle any errors during Speed Insights initialization
      console.debug('Speed Insights initialization error:', error);
    }
  }).catch((error) => {
    // Gracefully handle any module loading errors
    console.debug('Failed to load Speed Insights module:', error);
  });
}
