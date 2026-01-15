
import { getArticles } from '@/lib/api';

export default async function Home() {
    const articles = await getArticles();

    return (
        <main className="max-w-2xl mx-auto px-6 py-20 font-sans">
            <header className="mb-20">
                <h1 className="text-3xl font-light tracking-tight text-gray-900">Minimalist.</h1>
                <p className="text-gray-400 mt-2 text-sm">A Strapi + Next.js Collection</p>
            </header>

            <div className="space-y-16">
                {articles.map((article: any) => (
                    <article key={article.documentId} className="group cursor-pointer">
                        <div className="flex flex-col space-y-3">
                            <div className="flex items-center space-x-3">
                                <span className="text-xs font-medium text-gray-400 uppercase tracking-widest">
                                    {article.category?.name}
                                </span>
                                <span className="h-px w-8 bg-gray-200"></span>
                            </div>
                            <h2 className="text-2xl font-normal text-gray-800 group-hover:text-black transition-colors duration-300">
                                {article.title}
                            </h2>
                            <div className="text-gray-500 leading-relaxed font-light">
                                {article.content && article.content[0]?.children[0]?.text}
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </main>
    );
}
