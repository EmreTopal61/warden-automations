# Form WA-01 → n8n bağlantısı

Sitedeki "Otomasyon ihtiyaç formu" gönderildiğinde cevaplar tek bir JSON gövdesiyle n8n'deki bir **Webhook** düğümüne `POST` edilir. Analizi yapan akış sizin n8n akışınızdır; site yalnızca veriyi gönderir.

## Kurulu akış

n8n'de **"Warden Form WA-01 · Analiz ve Görüşme Daveti"** akışı kurulu (kişisel proje). Webhook'tan gelen her form:

1. **Normalize Form** — alanları ayıklar; HTML ve istem için güvenli kopyalar üretir.
2. **Başvuruyu Kaydet** — ham cevapları `warden_form_basvurulari` n8n tablosuna yazar.
3. **Otomasyon Önerisi Çıkar** (OpenAI, `gpt-5-mini`) — şirkete uygun tek otomasyonu yapılandırılmış JSON olarak üretir → **Bana Bildir** öneriyi ve cevapları e7555222@gmail.com adresine yollar (yanıtla = şirkete yaz).
4. **Şirkete Görüşme Daveti** — formu dolduran kişiye Calendly bağlantılı, sabit şablonlu teşekkür e-postası. Yapay zekâ şirkete giden metni yazmaz.

5. **Hata bildirimi** — kayıt, analiz veya iki e-posta adımından biri hata verirse hata `warden_form_hatalar` tablosuna yazılır ve form cevaplarıyla birlikte size uyarı e-postası gider. Webhook, geçerli e-posta içermeyen istekleri hiç çalıştırmaz.

Production webhook adresi: `https://z48xg9uy.rpcld.app/webhook/warden-form`

Yayına almadan önce: **OpenAI Modeli** düğümündeki "OpenAI account" kimliğine kendi API anahtarınızı girin.

## 1. n8n tarafı

1. Yeni bir akışta **Webhook** düğümü ekleyin.
   - HTTP Method: `POST`
   - Path: `warden-form` (istediğiniz bir ad olabilir)
   - Respond: `Immediately` (site 2xx yanıtı görünce "Formunuz alındı" kaşesini basar)
   - Options → **Allowed Origins (CORS)**: `https://wardenautomations.com` (yerelde denemek için `http://localhost:5173` de ekleyin, virgülle)
2. Akışı **Active** yapın ve **Production URL**'i kopyalayın.
3. Webhook'un çıktısında form alanları `body` altında gelir (örnek: `{{ $json.body.summary }}`).

## 2. Site tarafı

- Yerelde: proje kökünde `.env` dosyası oluşturup `.env.example`'daki satırı kendi URL'nizle yazın.
- Vercel'de: Project Settings → Environment Variables → `VITE_N8N_WEBHOOK_URL` = Production URL, ardından **yeniden deploy**. (Vite değeri derleme sırasında gömer.)
- Adres tanımlı değilse: geliştirme ortamında gönderim taklit edilir ve veri tarayıcı konsoluna yazılır; canlı sitede ziyaretçiye "gönderilemedi" uyarısı ve e-posta adresi gösterilir.

## 3. Gelen veri

Örnek (uydurma şirket):

```json
{
  "form": "WA-01",
  "registryNo": "WA-2026/04127",
  "submittedAt": "2026-10-19T09:30:00.000Z",
  "page": "https://wardenautomations.com/",
  "sector": "uretim",
  "sectorLabel": "Üretim",
  "employees": "6-20",
  "companyName": "Örnek Makina Ltd.",
  "website": "ornekmakina.com.tr",
  "channels": ["whatsapp", "eposta"],
  "channelLabels": ["WhatsApp", "E-posta"],
  "tools": ["excel-sheets", "erp-muhasebe"],
  "toolLabels": ["Excel, Google Sheets", "Muhasebe/ERP (Logo, Mikro, Netsis…)"],
  "repetitiveTask": "Bayilerden gelen siparişleri WhatsApp'tan okuyup Excel'e giriyoruz...",
  "weeklyHours": "10-20",
  "lossAreas": ["stok-siparis", "elle-veri"],
  "lossAreaLabels": ["Stok ve sipariş hataları", "Elle veri girişinde hatalar"],
  "magicWand": "Siparişler kendiliğinden depoya düşsün.",
  "budget": "15k-50k",
  "timeline": "1-3-ay",
  "fullName": "Ad Soyad",
  "email": "ad@ornekmakina.com.tr",
  "phone": "",
  "kvkkConsent": true,
  "summary": "Sektör: Üretim\nÇalışan sayısı: 6–20\n..."
}
```

- `*Label(s)` alanları insan/yapay zekâ için okunur Türkçe etiketlerdir; kısa kodlar (`sector`, `channels`…) filtre ve dallanma için.
- `summary`: şirket bilgisi + 12 sorunun cevabı, satır satır. Bir LLM düğümüne doğrudan verilebilir. Kişisel iletişim bilgileri (ad, e-posta, telefon) bu metne bilerek konmadı.
- `registryNo`: ziyaretçiye gösterilen evrak numarası; e-postada ve CRM'de aynı numarayı kullanın.

## 4. Analiz için örnek istem (AI düğümü)

```
Sen Warden Automations için çalışan bir otomasyon danışmanısın. Aşağıda bir şirket sahibinin
doldurduğu ihtiyaç formu var. Bu şirkete n8n ile kurulabilecek, satılabilir TEK bir otomasyon öner.

Çıktı (Türkçe, JSON):
- baslik: otomasyonun kısa adı
- sorun: şirketin kendi cümlelerine dayanarak çözülen sorun
- nasil_calisir: 3-5 adımda akış (tetikleyici → işlemler → sonuç)
- baglanacak_araclar: şirketin zaten kullandığı araçlar öncelikli
- kazanc: haftalık süre cevabına dayanan, abartısız kazanım tahmini (aralık olarak)
- ilk_adim: kuruluma başlamak için gereken tek bilgi/erişim

Form:
{{ $json.body.summary }}
```

Sonucu Gmail düğümüyle `{{ $json.body.email }}` adresine, konu satırında `{{ $json.body.registryNo }}` ile gönderebilirsiniz.

## Not: KVKK

Aydınlatma metni `kvkk.html` sayfasında; formdaki onay kutusu ve alt bilgi bu sayfaya bağlı. Akışa yeni bir hizmet sağlayıcı eklerseniz (ör. CRM) metindeki "Kimlere aktarıyoruz" bölümünü de güncelleyin. Ticari unvan, adres ve saklama süresi bir hukukçu tarafından kontrol edilmelidir.
