# Product

<!-- impeccable:product-schema 1 -->

> Not: Kullanıcı soru turunu atlayıp "direkt başla" dedi. *(çıkarım)* etiketli maddeler depodan ve kullanıcının isteğinden çıkarıldı, onaylanmadı.

## Platform

web

## Users

Türkiye'deki KOBİ ve orta ölçekli şirketlerin sahipleri ve yöneticileri *(çıkarım: mevcut site metni ve SSS'deki sektör listesi)*. Siteye genellikle bir tavsiye, LinkedIn paylaşımı veya soğuk e-posta üzerinden gelirler; yapay zekâ ve otomasyon hakkında genel bir merak taşırlar ama kendi işlerinde neyin otomatikleşebileceğini net bilmezler. Görevleri: "Bu ekip benim şirketim için gerçekten işe yarar bir şey kurabilir mi?" sorusuna hızlıca cevap bulmak.

## Product Purpose

Warden Automations, şirketlere özel yapay zekâ destekli iş otomasyonları tasarlayıp kuran İstanbul merkezli bir ekip. Site artık hazır ürün kataloğu sunmuyor (Müşterim, Voice Warden ve Data Hunter bölümleri kullanıcı isteğiyle kaldırıldı). Sitenin işi: şirket sahibini bir analiz formunu doldurmaya ikna etmek. Form yanıtları kullanıcının n8n otomasyonuna gider; otomasyon yanıtları yapay zekâyla analiz edip o şirkete en uygun, satılabilir otomasyon örneğini çıkarır. Başarı: nitelikli form gönderimi ve ardından keşif görüşmesi.

## Positioning

Paket ürün satmak yerine önce şirketin kendi süreçlerini dinleyip ona özel otomasyon önerisi çıkarmak; öneri, şirketin kendi verdiği cevaplardan türetilir *(çıkarım: kullanıcının form tarifi)*. Altyapı n8n üzerine kurulu; kurucu n8n tabanlı yapay zekâ orkestrasyonu üzerine akademik çalışma yapmış *(çıkarım: IMISC 2026 bildirisi, kullanıcının masaüstündeki dosyalar)*.

## Operating Context

- Ziyaretçi masaüstünde ofiste ya da telefonda, iş arasında siteye bakar.
- Form yanıtı bir n8n webhook'una POST edilir; analiz sonucu e-postayla ya da keşif görüşmesinde iletilir *(çıkarım; sonuç kanalı henüz kararlaştırılmadı)*.
- Keşif görüşmesi Calendly üzerinden alınır (15 dk).
- İletişim: emre@wardenautomations.com, İstanbul.

## Capabilities and Constraints

- React 18 + Vite + Tailwind + three.js (@react-three/fiber) tek sayfa; Vercel'de yayında *(çıkarım: .gitignore'da .vercel)*.
- Kullanıcının n8n'de kurduğu otomasyon türleri (kanıt): Google Maps lead toplama, soğuk e-posta / outbound, web sitesine göre e-posta taslağı, WhatsApp restoran rezervasyonu, Excel stok kontrolü ve raporu, pazar araştırması, günlük mail özeti, RSS haber özeti.
- Entegrasyonlar: n8n, HubSpot, Pipedrive, Google Sheets, Gmail, WhatsApp Business, Calendly, Apify, Hunter.io, Instantly, ZeroBounce, Vapi.
- Açık karar: form webhook adresi (ortam değişkeni ile verilecek), analiz sonucunun ziyaretçiye nasıl döneceği.

## Brand Commitments

- İsim: Warden Automations. Dil: Türkçe.
- Kullanıcı isteği (bağlayıcı): site "yapay zekâyla yapılmış" gibi görünmemeli; 3D animasyon olmalı.

## Evidence on Hand

- Gerçek müşteri referansı, vaka çalışması, logo veya rakamsal sonuç yok. Önceki sitedeki "%63 daha hızlı", "3.4x" gibi istatistikler doğrulanmamış; uydurma rakam, müşteri yorumu ya da logo eklenmeyecek.
- Gerçek n8n iş akışı isimleri ve türleri yukarıda; örnek otomasyon gösterimleri bunlardan türetilebilir ve "örnek" olarak etiketlenmeli.

## Product Principles

1. Önce dinle, sonra öner: her şey formdaki cevaplara bağlanır.
2. Somut göster: "yapay zekâ ağı" gibi soyutlamalar yerine bir şirketin gerçek bir işinin otomatikleşmiş halini göster.
3. İddia değil kanıt: doğrulanmamış rakam ve referans yok.
4. Şirket sahibinin dili: teknik jargon yerine iş, zaman ve para dili.

## Accessibility & Inclusion

Türkçe karakterler tam desteklenmeli; form klavyeyle doldurulabilir ve ekran okuyucuyla anlaşılır olmalı; hareket azaltma tercihine uyulmalı.
