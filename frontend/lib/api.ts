
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export async function fetchAPI(path: string, urlParamsObject = {}, options = {}) {
    // Merge default and user options
    const mergedOptions = {
        headers: {
            'Content-Type': 'application/json',
        },
        ...options,
    };

    // Build request URL
    const queryString = new URLSearchParams(urlParamsObject).toString();
    const requestUrl = `${STRAPI_URL}/api${path}${queryString ? `?${queryString}` : ''}`;

    // Trigger API call
    const response = await fetch(requestUrl, mergedOptions);

    // Handle response
    if (!response.ok) {
        console.error(response.statusText);
        throw new Error(`An error occurred please try again`);
    }
    const data = await response.json();
    return data;
}

export async function getArticles() {
    const articles = await fetchAPI('/articles', { populate: '*' });
    return articles.data;
}

export async function getCategories() {
    const categories = await fetchAPI('/categories', { populate: '*' });
    return categories.data;
}
