import { DetailPage } from '@/components';
export type AssetType = 'projects' | 'articles';

function isAssetType(type: string): type is AssetType {
    return type === 'projects' || type === 'articles';
}

export default async function Page({
    params,
}: {
    params: Promise<{ slug: [string, string] }>;
}) {
    const { slug } = await params;
    const postType = slug[0];
    const typeSlug = slug[1];

    if (isAssetType(postType)) {
        return <DetailPage postType={postType} slug={typeSlug} />;
    }
    return <div>Post not found</div>;
}
