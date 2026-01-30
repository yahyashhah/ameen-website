import fetch from 'node-fetch';
import { ProductRecord, readEnv } from './utils';

const ICECAT_BASE = 'https://live.icecat.biz/api/';

export type IcecatResult = {
  Title?: string;
  ProductDescription?: { ShortSummaryDescription?: string; LongSummaryDescription?: string };
  Gallery?: { LowPic?: string; HighPic?: string; Gallery?: { HighPic?: string; LowPic?: string }[] };
  Brand?: { Brand?: string };
  Category?: { Name?: string };
};

async function fetchIcecatByGTIN(gtin: string, lang: string, username: string) {
  const url = `${ICECAT_BASE}?UserName=${encodeURIComponent(username)}&Language=${encodeURIComponent(lang)}&GTIN=${encodeURIComponent(gtin)}&output=json`;
  const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
  if (!res.ok) return undefined;
  return (await res.json()) as any as IcecatResult;
}

async function fetchIcecatByBrandMpn(brand: string, mpn: string, lang: string, username: string) {
  const url = `${ICECAT_BASE}?UserName=${encodeURIComponent(username)}&Language=${encodeURIComponent(lang)}&Brand=${encodeURIComponent(brand)}&ProductCode=${encodeURIComponent(mpn)}&output=json`;
  const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
  if (!res.ok) return undefined;
  return (await res.json()) as any as IcecatResult;
}

export async function enrichWithIcecat(records: ProductRecord[]): Promise<ProductRecord[]> {
  const username = readEnv('ICECAT_USERNAME', 'OpenIcecat')!;
  const lang = readEnv('ICECAT_LANGUAGE', 'en')!;

  const results: ProductRecord[] = [];
  for (const rec of records) {
    try {
      let ice: IcecatResult | undefined;
      if (rec.barcode) {
        ice = await fetchIcecatByGTIN(rec.barcode, lang, username);
      }
      if (!ice && rec.vendor && rec.mpn) {
        ice = await fetchIcecatByBrandMpn(rec.vendor, rec.mpn, lang, username);
      }
      if (ice) {
        const images: { url: string; alt?: string }[] = [];
        const g = ice.Gallery;
        if (g?.HighPic) images.push({ url: g.HighPic, alt: rec.title });
        if (g?.LowPic && images.length === 0) images.push({ url: g.LowPic, alt: rec.title });
        if (Array.isArray(g?.Gallery)) {
          for (const pic of g!.Gallery!) {
            if (pic.HighPic) images.push({ url: pic.HighPic, alt: rec.title });
          }
        }

        const short = ice.ProductDescription?.ShortSummaryDescription ?? '';
        const long = ice.ProductDescription?.LongSummaryDescription ?? '';
        const descriptionHtml = [short, long].filter(Boolean).join('<br/><br/>');

        results.push({
          ...rec,
          images: images.length ? images : rec.images,
          descriptionHtml: descriptionHtml || rec.descriptionHtml,
          type: rec.type || ice.Category?.Name || rec.type,
        });
      } else {
        results.push(rec);
      }
    } catch (e) {
      results.push(rec);
    }
  }
  return results;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('This script is intended to be imported by build-shopify-csv.ts');
}
