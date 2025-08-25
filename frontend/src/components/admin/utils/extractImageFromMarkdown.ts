/**
 * Gets the featured image URL from article data, with fallback to markdown content
 * @param article - The article object that may contain featuredImageUrl
 * @returns The featured image URL or null if no image is found
 */
export function getFeaturedImageUrl(article: { featuredImageUrl?: string; content?: string }): string | null {
    console.log('getFeaturedImageUrl called with:', article); // Debug line
    
    // First priority: featuredImageUrl field
    if (article.featuredImageUrl?.trim()) {
        const url = article.featuredImageUrl.trim();
        console.log('Using featuredImageUrl:', url); // Debug line
        return url;
    }
    
    // Fallback: extract from markdown content (for backward compatibility)
    if (article.content) {
        const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/;
        const match = article.content.match(imageRegex);
        
        if (match && match[2]) {
            const imageUrl = match[2].trim();
            // Basic validation to ensure it looks like a URL
            if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://') || imageUrl.startsWith('/')) {
                console.log('Using markdown image:', imageUrl); // Debug line
                return imageUrl;
            }
        }
    }
    
    console.log('No image found, returning null'); // Debug line
    return null;
}

/**
 * Legacy function - kept for backward compatibility
 * @deprecated Use getFeaturedImageUrl instead
 */
export function extractImageFromMarkdown(content: string | undefined): string | null {
    if (!content) return null;
    
    // Regex to match markdown image syntax: ![alt text](url)
    const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/;
    const match = content.match(imageRegex);
    
    if (match && match[2]) {
        const imageUrl = match[2].trim();
        // Basic validation to ensure it looks like a URL
        if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://') || imageUrl.startsWith('/')) {
            return imageUrl;
        }
    }
    
    return null;
}

/**
 * Checks if a markdown content contains any images
 * @param content - The markdown content to check
 * @returns true if content contains at least one image, false otherwise
 */
export function hasImages(content: string | undefined): boolean {
    return extractImageFromMarkdown(content) !== null;
}
